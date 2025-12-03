/**
 * Multi-Channel Communication Orchestrator
 * Coordinates message delivery across WhatsApp, SMS, and Email channels
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { whatsappAutomationService } from '@/services/whatsapp/automation'
import { smsService } from './sms.service'
import { emailOutreachService } from './email.service'
import {
  UnifiedMessage,
  MessageDeliveryResult,
  ChannelType,
  SequenceStep,
  ChannelSequence,
  SequenceExecution,
  CommunicationPreferences,
  MessageStatus,
} from './types'

/**
 * Channel availability status
 */
interface ChannelStatus {
  whatsapp: boolean
  sms: boolean
  email: boolean
}

/**
 * Multi-Channel Communication Orchestrator
 * Central service for managing all outbound communication
 */
export class MultiChannelOrchestrator {
  /**
   * Send a message through the specified channel
   */
  async sendMessage(message: UnifiedMessage): Promise<MessageDeliveryResult> {
    try {
      logger.info(
        {
          workspaceId: message.workspaceId,
          channel: message.channel,
          to: message.to,
        },
        'Sending message via multi-channel orchestrator'
      )

      // Check if channel is enabled
      const isEnabled = await this.isChannelEnabled(
        message.workspaceId,
        message.channel
      )
      if (!isEnabled) {
        return {
          success: false,
          channel: message.channel,
          status: 'failed',
          timestamp: new Date(),
          error: `${message.channel} channel is not enabled for this workspace`,
        }
      }

      // Check communication preferences
      const preferences = await this.getLeadPreferences(message.leadId)
      if (preferences?.optOutChannels.includes(message.channel)) {
        return {
          success: false,
          channel: message.channel,
          status: 'failed',
          timestamp: new Date(),
          error: `Lead has opted out of ${message.channel} communication`,
        }
      }

      // Check quiet hours
      if (preferences && this.isInQuietHours(preferences)) {
        // Schedule for later
        const scheduledTime = this.getNextAvailableTime(preferences)
        logger.info(
          { workspaceId: message.workspaceId, scheduledTime },
          'Message scheduled for after quiet hours'
        )
        return this.scheduleMessage(message, scheduledTime)
      }

      // Route to appropriate channel service
      switch (message.channel) {
        case 'whatsapp':
          return await this.sendWhatsApp(message)
        case 'sms':
          return await smsService.sendSms(message)
        case 'email':
          return await emailOutreachService.sendEmail(message)
        default:
          throw new Error(`Unknown channel: ${message.channel}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error(
        { error, workspaceId: message.workspaceId },
        'Failed to send message'
      )

      return {
        success: false,
        channel: message.channel,
        status: 'failed',
        timestamp: new Date(),
        error: errorMessage,
      }
    }
  }

  /**
   * Send message via WhatsApp
   */
  private async sendWhatsApp(message: UnifiedMessage): Promise<MessageDeliveryResult> {
    try {
      const result = await whatsappAutomationService.sendMessage(
        message.workspaceId,
        message.to,
        message.content
      )

      return {
        success: true,
        messageId: result.messageId,
        externalId: result.messageId,
        channel: 'whatsapp',
        status: 'sent',
        timestamp: new Date(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        channel: 'whatsapp',
        status: 'failed',
        timestamp: new Date(),
        error: errorMessage,
      }
    }
  }

  /**
   * Send message through best available channel
   */
  async sendViaBestChannel(
    workspaceId: string,
    leadId: string,
    content: string,
    subject?: string
  ): Promise<MessageDeliveryResult> {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    const preferences = await this.getLeadPreferences(leadId)
    const availableChannels = await this.getAvailableChannels(workspaceId)

    // Determine best channel based on preferences and availability
    let selectedChannel: ChannelType | null = null

    if (preferences?.preferredChannel && availableChannels[preferences.preferredChannel]) {
      selectedChannel = preferences.preferredChannel
    } else if (lead.phone && availableChannels.whatsapp) {
      selectedChannel = 'whatsapp'
    } else if (lead.phone && availableChannels.sms) {
      selectedChannel = 'sms'
    } else if (lead.email && availableChannels.email) {
      selectedChannel = 'email'
    }

    if (!selectedChannel) {
      return {
        success: false,
        channel: 'email', // default
        status: 'failed',
        timestamp: new Date(),
        error: 'No available channel for this lead',
      }
    }

    const to = selectedChannel === 'email' ? lead.email! : lead.phone!

    return this.sendMessage({
      workspaceId,
      leadId,
      channel: selectedChannel,
      to,
      content,
      subject,
    })
  }

  /**
   * Start a multi-channel sequence for a lead
   */
  async startSequence(
    sequenceId: string,
    workspaceId: string,
    leadId: string
  ): Promise<SequenceExecution> {
    try {
      const sequence = await this.getSequence(sequenceId)
      if (!sequence || !sequence.active) {
        throw new Error('Sequence not found or inactive')
      }

      // Create execution record with cryptographically secure ID
      const executionId = `exec_${Date.now()}_${secretsService.generateToken(8)}`
      const execution: SequenceExecution = {
        id: executionId,
        sequenceId,
        workspaceId,
        leadId,
        currentStepIndex: 0,
        status: 'active',
        startedAt: new Date(),
      }

      // Store execution state
      await this.storeSequenceExecution(execution)

      // Execute first step immediately
      await this.executeSequenceStep(execution, sequence.steps[0])

      logger.info(
        { executionId, sequenceId, leadId },
        'Sequence started'
      )

      return execution
    } catch (error) {
      logger.error({ error, sequenceId, leadId }, 'Failed to start sequence')
      throw error
    }
  }

  /**
   * Execute a sequence step
   */
  private async executeSequenceStep(
    execution: SequenceExecution,
    step: SequenceStep
  ): Promise<void> {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: execution.leadId },
      })

      if (!lead) {
        throw new Error('Lead not found')
      }

      const to = step.channel === 'email' ? lead.email : lead.phone
      if (!to) {
        logger.warn(
          { executionId: execution.id, channel: step.channel },
          'Lead missing contact info for channel'
        )
        return
      }

      await this.sendMessage({
        workspaceId: execution.workspaceId,
        leadId: execution.leadId,
        channel: step.channel,
        to,
        content: step.content || '',
        subject: step.subject,
        templateId: step.templateId,
      })

      // Schedule next step if available
      const sequence = await this.getSequence(execution.sequenceId)
      if (sequence && execution.currentStepIndex < sequence.steps.length - 1) {
        const nextStep = sequence.steps[execution.currentStepIndex + 1]
        const nextStepTime = new Date(Date.now() + nextStep.delayMinutes * 60 * 1000)

        await this.updateSequenceExecution(execution.id, {
          currentStepIndex: execution.currentStepIndex + 1,
          lastStepAt: new Date(),
          nextStepAt: nextStepTime,
        })

        // Schedule next step (would typically use a job queue)
        logger.info(
          { executionId: execution.id, nextStepAt: nextStepTime },
          'Next sequence step scheduled'
        )
      } else {
        // Sequence completed
        await this.updateSequenceExecution(execution.id, {
          status: 'completed',
          completedAt: new Date(),
        })
        
        logger.info({ executionId: execution.id }, 'Sequence completed')
      }
    } catch (error) {
      logger.error({ error, executionId: execution.id }, 'Failed to execute sequence step')
      await this.updateSequenceExecution(execution.id, {
        status: 'failed',
      })
    }
  }

  /**
   * Pause a running sequence
   */
  async pauseSequence(executionId: string): Promise<void> {
    await this.updateSequenceExecution(executionId, {
      status: 'paused',
    })
    logger.info({ executionId }, 'Sequence paused')
  }

  /**
   * Resume a paused sequence
   */
  async resumeSequence(executionId: string): Promise<void> {
    const execution = await this.getSequenceExecution(executionId)
    if (!execution || execution.status !== 'paused') {
      throw new Error('Sequence not found or not paused')
    }

    await this.updateSequenceExecution(executionId, {
      status: 'active',
    })

    // Resume from current step
    const sequence = await this.getSequence(execution.sequenceId)
    if (sequence) {
      const currentStep = sequence.steps[execution.currentStepIndex]
      await this.executeSequenceStep(execution, currentStep)
    }

    logger.info({ executionId }, 'Sequence resumed')
  }

  /**
   * Cancel a running sequence
   */
  async cancelSequence(executionId: string): Promise<void> {
    await this.updateSequenceExecution(executionId, {
      status: 'cancelled',
      completedAt: new Date(),
    })
    logger.info({ executionId }, 'Sequence cancelled')
  }

  /**
   * Get available channels for a workspace
   */
  async getAvailableChannels(workspaceId: string): Promise<ChannelStatus> {
    const [whatsappEnabled, smsEnabled, emailEnabled] = await Promise.all([
      this.isChannelEnabled(workspaceId, 'whatsapp'),
      this.isChannelEnabled(workspaceId, 'sms'),
      this.isChannelEnabled(workspaceId, 'email'),
    ])

    return {
      whatsapp: whatsappEnabled,
      sms: smsEnabled,
      email: emailEnabled,
    }
  }

  /**
   * Check if a channel is enabled for a workspace
   */
  private async isChannelEnabled(
    workspaceId: string,
    channel: ChannelType
  ): Promise<boolean> {
    switch (channel) {
      case 'whatsapp': {
        const wa = await prisma.whatsAppIntegration.findUnique({
          where: { workspaceId },
        })
        return wa?.status === 'active'
      }
      case 'sms':
        return await smsService.isEnabled(workspaceId)
      case 'email':
        return await emailOutreachService.isEnabled(workspaceId)
      default:
        return false
    }
  }

  /**
   * Get lead communication preferences
   */
  private async getLeadPreferences(
    leadId?: string
  ): Promise<CommunicationPreferences | null> {
    if (!leadId) return null

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead?.metadata) return null

    const metadata = lead.metadata as Record<string, unknown>
    return (metadata.communicationPreferences as CommunicationPreferences) || null
  }

  /**
   * Check if current time is within quiet hours
   */
  private isInQuietHours(preferences: CommunicationPreferences): boolean {
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false
    }

    const now = new Date()
    const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number)
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number)

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (startMinutes < endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes
    } else {
      // Quiet hours span midnight
      return currentMinutes >= startMinutes || currentMinutes < endMinutes
    }
  }

  /**
   * Get next available time after quiet hours
   */
  private getNextAvailableTime(preferences: CommunicationPreferences): Date {
    if (!preferences.quietHoursEnd) {
      return new Date()
    }

    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number)
    const next = new Date()
    next.setHours(endHour, endMin, 0, 0)

    if (next <= new Date()) {
      next.setDate(next.getDate() + 1)
    }

    return next
  }

  /**
   * Schedule a message for later delivery
   */
  private async scheduleMessage(
    message: UnifiedMessage,
    scheduledTime: Date
  ): Promise<MessageDeliveryResult> {
    // Create a scheduled followup
    if (message.leadId) {
      await prisma.followup.create({
        data: {
          workspaceId: message.workspaceId,
          leadId: message.leadId,
          type: message.channel,
          scheduledAt: scheduledTime,
          content: message.content,
          status: 'pending',
        },
      })
    }

    return {
      success: true,
      channel: message.channel,
      status: 'queued',
      timestamp: new Date(),
      metadata: {
        scheduledFor: scheduledTime.toISOString(),
      },
    }
  }

  /**
   * Get sequence by ID (placeholder - would be from database)
   */
  private async getSequence(sequenceId: string): Promise<ChannelSequence | null> {
    // In a full implementation, this would fetch from database
    // For now, return a default sequence for demonstration
    return {
      id: sequenceId,
      workspaceId: 'default',
      name: 'Default Welcome Sequence',
      steps: [
        {
          id: 'step-1',
          order: 1,
          channel: 'whatsapp',
          content: 'Hi {{name}}! Welcome to our fitness studio. 🎉',
          delayMinutes: 0,
        },
        {
          id: 'step-2',
          order: 2,
          channel: 'email',
          subject: 'Your Fitness Journey Starts Here',
          content: 'Hi {{name}}, thank you for joining us...',
          delayMinutes: 60, // 1 hour later
        },
        {
          id: 'step-3',
          order: 3,
          channel: 'sms',
          content: 'Ready to book your first session? Reply YES!',
          delayMinutes: 1440, // 24 hours later
        },
      ],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  /**
   * Store sequence execution state
   */
  private async storeSequenceExecution(execution: SequenceExecution): Promise<void> {
    await prisma.conversationState.create({
      data: {
        workspaceId: execution.workspaceId,
        leadId: execution.leadId,
        state: execution.status,
        metadata: {
          executionId: execution.id,
          sequenceId: execution.sequenceId,
          currentStepIndex: execution.currentStepIndex,
          startedAt: execution.startedAt.toISOString(),
        },
      },
    })
  }

  /**
   * Get sequence execution by ID
   */
  private async getSequenceExecution(
    executionId: string
  ): Promise<SequenceExecution | null> {
    const state = await prisma.conversationState.findFirst({
      where: {
        metadata: {
          path: ['executionId'],
          equals: executionId,
        },
      },
    })

    if (!state) return null

    const metadata = state.metadata as Record<string, unknown>
    return {
      id: executionId,
      sequenceId: metadata.sequenceId as string,
      workspaceId: state.workspaceId,
      leadId: state.leadId,
      currentStepIndex: metadata.currentStepIndex as number,
      status: state.state as SequenceExecution['status'],
      startedAt: new Date(metadata.startedAt as string),
    }
  }

  /**
   * Update sequence execution state
   */
  private async updateSequenceExecution(
    executionId: string,
    updates: Partial<SequenceExecution>
  ): Promise<void> {
    const current = await this.getSequenceExecution(executionId)
    if (!current) return

    const state = await prisma.conversationState.findFirst({
      where: {
        metadata: {
          path: ['executionId'],
          equals: executionId,
        },
      },
    })

    if (!state) return

    const currentMetadata = state.metadata as Record<string, unknown>

    await prisma.conversationState.update({
      where: { id: state.id },
      data: {
        state: updates.status || current.status,
        metadata: {
          ...currentMetadata,
          ...(updates.currentStepIndex !== undefined && {
            currentStepIndex: updates.currentStepIndex,
          }),
          ...(updates.lastStepAt && {
            lastStepAt: updates.lastStepAt.toISOString(),
          }),
          ...(updates.nextStepAt && {
            nextStepAt: updates.nextStepAt.toISOString(),
          }),
          ...(updates.completedAt && {
            completedAt: updates.completedAt.toISOString(),
          }),
        },
      },
    })
  }

  /**
   * Get message delivery statistics for a workspace
   */
  async getDeliveryStats(
    workspaceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    byChannel: Record<ChannelType, { sent: number; delivered: number; failed: number }>
    overall: { sent: number; delivered: number; failed: number; deliveryRate: number }
  }> {
    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
        direction: 'outbound',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const stats = {
      byChannel: {
        whatsapp: { sent: 0, delivered: 0, failed: 0 },
        sms: { sent: 0, delivered: 0, failed: 0 },
        email: { sent: 0, delivered: 0, failed: 0 },
      } as Record<ChannelType, { sent: number; delivered: number; failed: number }>,
      overall: { sent: 0, delivered: 0, failed: 0, deliveryRate: 0 },
    }

    for (const message of messages) {
      const channel = message.channel as ChannelType
      const metadata = message.metadata as Record<string, unknown> | null
      const status = (metadata?.status as MessageStatus) || 'sent'

      if (stats.byChannel[channel]) {
        stats.byChannel[channel].sent++
        if (status === 'delivered' || status === 'read') {
          stats.byChannel[channel].delivered++
        } else if (status === 'failed' || status === 'bounced') {
          stats.byChannel[channel].failed++
        }
      }

      stats.overall.sent++
      if (status === 'delivered' || status === 'read') {
        stats.overall.delivered++
      } else if (status === 'failed' || status === 'bounced') {
        stats.overall.failed++
      }
    }

    stats.overall.deliveryRate =
      stats.overall.sent > 0
        ? (stats.overall.delivered / stats.overall.sent) * 100
        : 0

    return stats
  }
}

export const multiChannelOrchestrator = new MultiChannelOrchestrator()
