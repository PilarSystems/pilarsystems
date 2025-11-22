/**
 * WhatsApp Coach Autopilot Processors
 * 
 * Handles coach.* events for automated WhatsApp coaching
 */

import { EventProcessor, AutopilotEvent, EventResult } from '../event-bus'
import { JobProcessor, AutopilotJob, JobResult } from '../job-queue'
import { prisma } from '@/lib/prisma'
import { whatsappAdapter } from '@/lib/integrations/whatsapp-adapter'
import { aiRouter } from '@/lib/ai/multi-tenant-router'
import { DistributedLockManager } from '../distributed-lock-manager'
import { rateLimiter } from '../rate-limiter'
import { policyEngine } from '@/lib/operator/policy-engine'

const lockManager = new DistributedLockManager()

/**
 * Coach Message Received Event Processor
 * Handles inbound WhatsApp messages from leads
 */
class CoachMessageReceivedProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'coach.message_received'
  }

  getHandlerName(): string {
    return 'CoachMessageReceivedProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { leadId, message, from } = event.payload

    try {
      const result = await lockManager.withLock(
        `conversation:${workspaceId}:${leadId}`,
        workspaceId,
        async () => {
          const lead = await prisma.lead.findUnique({
            where: { id: leadId }
          })

          if (!lead || !lead.phone) {
            return { success: false, error: 'Lead not found or missing phone' }
          }

          const currentMetadata = (lead.metadata as any) || {}
          const conversationState = currentMetadata.conversationState || {
            state: 'idle',
            lastMessageAt: null,
            messageCount: 0,
            nextActionAt: null
          }

          conversationState.state = 'processing'
          conversationState.lastMessageAt = new Date().toISOString()
          conversationState.messageCount = (conversationState.messageCount || 0) + 1

          await prisma.lead.update({
            where: { id: leadId },
            data: {
              metadata: {
                ...currentMetadata,
                conversationState
              }
            }
          })

          const hasTokenBudget = await rateLimiter.checkBudget(
            workspaceId,
            'tokens',
            500
          )

          if (!hasTokenBudget) {
            return {
              success: false,
              error: 'Token budget exceeded',
              reschedule: new Date(Date.now() + 60000)
            }
          }

          await rateLimiter.consumeBudget(workspaceId, 'tokens', 500)

          let aiResponse
          try {
            aiResponse = await aiRouter.route({
              workspaceId,
              prompt: message,
              systemPrompt: `You are a fitness coach assistant. Respond helpfully and motivationally to: ${message}`,
              maxTokens: 500,
              metadata: { leadId, conversationType: 'coach' }
            })
          } catch (error: any) {
            return { 
              success: false, 
              error: error.message || 'AI routing failed',
              reschedule: new Date(Date.now() + 5000)
            }
          }

          const sendResult = await whatsappAdapter.sendMessage(
            workspaceId,
            from,
            aiResponse.content
          )

          if (!sendResult.ok) {
            return {
              success: false,
              error: sendResult.error,
              reschedule: new Date(Date.now() + 5000)
            }
          }

          conversationState.state = 'idle'
          conversationState.nextActionAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

          await prisma.lead.update({
            where: { id: leadId },
            data: {
              metadata: {
                ...currentMetadata,
                conversationState
              }
            }
          })

          return { success: true, result: { messageId: sendResult.data?.messageId } }
        }
      )

      if (!result) {
        return {
          success: false,
          error: 'Failed to acquire lock',
          reschedule: new Date(Date.now() + 2000)
        }
      }

      return result
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Coach Lead Qualified Event Processor
 * Triggers follow-up sequence when lead is qualified
 */
class CoachLeadQualifiedProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'coach.lead_qualified'
  }

  getHandlerName(): string {
    return 'CoachLeadQualifiedProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { leadId, qualificationScore } = event.payload

    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      })

      if (!lead || !lead.phone) {
        return { success: false, error: 'Lead not found or missing phone' }
      }

      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: 'qualified',
          metadata: {
            ...(lead.metadata as any),
            qualificationScore,
            qualifiedAt: new Date().toISOString()
          }
        }
      })

      const followupMessage = qualificationScore > 80
        ? 'Great! You seem highly motivated. Let me schedule your first session.'
        : 'Thanks for your interest! Let me help you get started with a trial session.'

      const sendResult = await whatsappAdapter.sendMessage(
        workspaceId,
        lead.phone,
        followupMessage
      )

      if (!sendResult.ok) {
        return {
          success: false,
          error: sendResult.error,
          reschedule: new Date(Date.now() + 5000)
        }
      }

      return { success: true, result: { leadId, messageId: sendResult.data?.messageId } }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Coach Follow-up Due Job Processor
 * Sends scheduled follow-up messages
 */
class CoachFollowupDueProcessor implements JobProcessor {
  canHandle(jobType: string): boolean {
    return jobType === 'coach.followup_due'
  }

  getProcessorName(): string {
    return 'CoachFollowupDueProcessor'
  }

  async process(job: AutopilotJob): Promise<JobResult> {
    const { workspaceId } = job
    const { leadId, message } = job.payload

    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      })

      if (!lead || !lead.phone) {
        return { success: false, error: 'Lead not found or missing phone' }
      }

      const hasMessageBudget = await rateLimiter.checkBudget(
        workspaceId,
        'messages',
        1
      )

      if (!hasMessageBudget) {
        return {
          success: false,
          error: 'Message budget exceeded',
          reschedule: new Date(Date.now() + 60000)
        }
      }

      const sendResult = await whatsappAdapter.sendMessage(
        workspaceId,
        lead.phone,
        message || 'Hi! Just checking in on your fitness journey. How are you doing?'
      )

      if (!sendResult.ok) {
        return {
          success: false,
          error: sendResult.error,
          reschedule: new Date(Date.now() + 5000)
        }
      }

      await prisma.conversationState.upsert({
        where: {
          workspaceId_leadId: { workspaceId, leadId }
        },
        create: {
          workspaceId,
          leadId,
          state: 'waiting_response',
          lastMessageAt: new Date(),
          nextActionAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
        },
        update: {
          state: 'waiting_response',
          lastMessageAt: new Date(),
          nextActionAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
        }
      })

      return { success: true, result: { messageId: sendResult.data?.messageId } }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

export const coachProcessors = {
  events: [
    new CoachMessageReceivedProcessor(),
    new CoachLeadQualifiedProcessor()
  ],
  jobs: [
    new CoachFollowupDueProcessor()
  ]
}
