/**
 * SMS Service using Twilio
 * Handles SMS sending, receiving, and status tracking
 */

import twilio from 'twilio'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'
import { 
  UnifiedMessage, 
  MessageDeliveryResult, 
  MessageStatus,
  MessageTemplate 
} from './types'

/**
 * SMS Service for sending and managing SMS messages via Twilio
 */
export class SmsService {
  /**
   * Get Twilio client for a workspace (uses subaccount if available)
   */
  private async getTwilioClient(workspaceId: string): Promise<{
    client: twilio.Twilio
    fromNumber: string
  }> {
    const subaccount = await prisma.twilioSubaccount.findUnique({
      where: { workspaceId },
    })

    if (subaccount && subaccount.phoneNumber) {
      const apiKeySecret = secretsService.decrypt(subaccount.apiKeySecret)
      return {
        client: twilio(subaccount.apiKeySid, apiKeySecret, {
          accountSid: subaccount.subaccountSid,
        }),
        fromNumber: subaccount.phoneNumber,
      }
    }

    // Fallback to master account
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error('Twilio credentials not configured')
    }

    return {
      client: twilio(accountSid, authToken),
      fromNumber: phoneNumber,
    }
  }

  /**
   * Send an SMS message
   */
  async sendSms(message: UnifiedMessage): Promise<MessageDeliveryResult> {
    const startTime = Date.now()
    
    try {
      logger.info(
        { workspaceId: message.workspaceId, to: message.to },
        'Sending SMS message'
      )

      const { client, fromNumber } = await this.getTwilioClient(message.workspaceId)

      // Process template if provided
      let content = message.content
      if (message.templateId && message.templateVariables) {
        content = this.processTemplate(content, message.templateVariables)
      }

      const twilioMessage = await client.messages.create({
        body: content,
        from: message.from || fromNumber,
        to: message.to,
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twilio/sms-status`,
      })

      // Store message in database
      const dbMessage = await prisma.message.create({
        data: {
          workspaceId: message.workspaceId,
          leadId: message.leadId,
          channel: 'sms',
          direction: 'outbound',
          content: content,
          metadata: {
            externalId: twilioMessage.sid,
            from: fromNumber,
            to: message.to,
            status: twilioMessage.status,
            templateId: message.templateId,
            deliveryTimeMs: Date.now() - startTime,
          },
          aiGenerated: false,
        },
      })

      logger.info(
        {
          workspaceId: message.workspaceId,
          messageId: dbMessage.id,
          externalId: twilioMessage.sid,
        },
        'SMS sent successfully'
      )

      await auditService.log({
        workspaceId: message.workspaceId,
        action: 'sms.send',
        resource: 'message',
        resourceId: dbMessage.id,
        success: true,
      })

      return {
        success: true,
        messageId: dbMessage.id,
        externalId: twilioMessage.sid,
        channel: 'sms',
        status: this.mapTwilioStatus(twilioMessage.status),
        timestamp: new Date(),
        metadata: {
          from: fromNumber,
          deliveryTimeMs: Date.now() - startTime,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      logger.error(
        { error, workspaceId: message.workspaceId, to: message.to },
        'Failed to send SMS'
      )

      await auditService.log({
        workspaceId: message.workspaceId,
        action: 'sms.send',
        resource: 'message',
        success: false,
        errorMessage,
      })

      return {
        success: false,
        channel: 'sms',
        status: 'failed',
        timestamp: new Date(),
        error: errorMessage,
      }
    }
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSms(
    workspaceId: string,
    recipients: Array<{ to: string; leadId?: string; variables?: Record<string, string> }>,
    content: string,
    templateId?: string
  ): Promise<MessageDeliveryResult[]> {
    const results: MessageDeliveryResult[] = []

    for (const recipient of recipients) {
      const result = await this.sendSms({
        workspaceId,
        leadId: recipient.leadId,
        channel: 'sms',
        to: recipient.to,
        content,
        templateId,
        templateVariables: recipient.variables,
      })
      results.push(result)

      // Rate limiting delay (10 messages per second max for Twilio)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return results
  }

  /**
   * Handle incoming SMS webhook
   */
  async handleIncomingSms(
    from: string,
    to: string,
    body: string,
    messageSid: string
  ): Promise<void> {
    try {
      // Find workspace by phone number
      const subaccount = await prisma.twilioSubaccount.findFirst({
        where: { phoneNumber: to },
      })

      const workspaceId = subaccount?.workspaceId

      if (!workspaceId) {
        logger.warn({ to }, 'No workspace found for SMS recipient')
        return
      }

      // Find or create lead
      let lead = await prisma.lead.findFirst({
        where: { workspaceId, phone: from },
      })

      if (!lead) {
        lead = await prisma.lead.create({
          data: {
            workspaceId,
            name: `Lead from ${from}`,
            phone: from,
            source: 'phone', // SMS comes through phone source
            status: 'new',
            priority: 'medium',
          },
        })

        logger.info(
          { workspaceId, leadId: lead.id, phone: from },
          'New lead created from SMS'
        )
      }

      // Store incoming message
      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'sms',
          direction: 'inbound',
          content: body,
          metadata: {
            externalId: messageSid,
            from,
            to,
          },
        },
      })

      // Create activity log
      await prisma.activityLog.create({
        data: {
          workspaceId,
          leadId: lead.id,
          actionType: 'sms_received',
          description: `SMS received from ${from}`,
          metadata: { preview: body.substring(0, 100) },
        },
      })

      logger.info(
        { workspaceId, leadId: lead.id, messageSid },
        'Incoming SMS processed'
      )
    } catch (error) {
      logger.error({ error, from, to }, 'Failed to process incoming SMS')
      throw error
    }
  }

  /**
   * Update message status from webhook
   */
  async updateMessageStatus(
    messageSid: string,
    status: string,
    errorCode?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          channel: 'sms',
          metadata: {
            path: ['externalId'],
            equals: messageSid,
          },
        },
      })

      if (!message) {
        logger.warn({ messageSid }, 'Message not found for status update')
        return
      }

      const currentMetadata = (message.metadata as Record<string, unknown>) || {}
      
      await prisma.message.update({
        where: { id: message.id },
        data: {
          metadata: {
            ...currentMetadata,
            status: this.mapTwilioStatus(status),
            lastStatusUpdate: new Date().toISOString(),
            ...(errorCode && { errorCode }),
            ...(errorMessage && { errorMessage }),
          },
        },
      })

      // Track delivery analytics
      await this.trackDeliveryMetric(
        message.workspaceId,
        this.mapTwilioStatus(status)
      )

      logger.info({ messageSid, status }, 'SMS status updated')
    } catch (error) {
      logger.error({ error, messageSid }, 'Failed to update SMS status')
    }
  }

  /**
   * Map Twilio status to unified status
   */
  private mapTwilioStatus(twilioStatus: string): MessageStatus {
    const statusMap: Record<string, MessageStatus> = {
      queued: 'queued',
      sending: 'queued',
      sent: 'sent',
      delivered: 'delivered',
      read: 'read',
      failed: 'failed',
      undelivered: 'failed',
    }
    return statusMap[twilioStatus] || 'pending'
  }

  /**
   * Process template with variables
   */
  private processTemplate(
    template: string,
    variables: Record<string, string>
  ): string {
    let processed = template
    for (const [key, value] of Object.entries(variables)) {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    return processed
  }

  /**
   * Track delivery metrics for analytics
   */
  private async trackDeliveryMetric(
    workspaceId: string,
    status: MessageStatus
  ): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'sms_delivery_status',
          description: `SMS status: ${status}`,
          metadata: { status, channel: 'sms' },
        },
      })
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to track SMS delivery metric')
    }
  }

  /**
   * Get SMS templates for a workspace
   */
  async getTemplates(workspaceId: string): Promise<MessageTemplate[]> {
    // Templates would typically be stored in database
    // For now, return default templates
    return [
      {
        id: 'sms-welcome',
        name: 'Welcome Message',
        channel: 'sms',
        content: 'Hi {{name}}! Welcome to {{studio_name}}. Reply with any questions!',
        variables: ['name', 'studio_name'],
        active: true,
      },
      {
        id: 'sms-appointment-reminder',
        name: 'Appointment Reminder',
        channel: 'sms',
        content: 'Reminder: Your appointment at {{studio_name}} is {{date}} at {{time}}. Reply C to confirm or R to reschedule.',
        variables: ['studio_name', 'date', 'time'],
        active: true,
      },
      {
        id: 'sms-followup',
        name: 'Follow-up',
        channel: 'sms',
        content: 'Hi {{name}}, we noticed you haven\'t visited recently. We\'d love to have you back! Any questions?',
        variables: ['name'],
        active: true,
      },
    ]
  }

  /**
   * Check if SMS is enabled for a workspace
   */
  async isEnabled(workspaceId: string): Promise<boolean> {
    const subaccount = await prisma.twilioSubaccount.findUnique({
      where: { workspaceId },
    })
    return !!(subaccount && subaccount.phoneNumber && subaccount.status === 'active')
  }
}

export const smsService = new SmsService()
