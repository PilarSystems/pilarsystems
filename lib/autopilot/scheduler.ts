/**
 * PILAR AUTOPILOT - WhatsApp Coach Scheduler
 * 
 * Processes due WhatsApp Coach followups and sends AI-generated messages
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { whatsappAdapter } from '@/lib/integrations/whatsapp-adapter'
import { openaiAdapter } from '@/lib/integrations/openai-adapter'
import { acquireLock } from './locks'

export interface SchedulerResult {
  processed: number
  sent: number
  failed: number
  skipped: number
}

/**
 * Process due followups for a workspace
 */
export async function processWorkspaceFollowups(
  workspaceId: string,
  limit: number = 10
): Promise<SchedulerResult> {
  const result: SchedulerResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
  }

  try {
    const lock = await acquireLock(workspaceId, 'scheduler', {
      ttlMs: 120000, // 2 minutes
      retryAttempts: 1,
    })

    if (!lock) {
      logger.warn({ workspaceId }, 'Failed to acquire scheduler lock, workspace busy')
      return result
    }

    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { studioInfo: true },
      })

      const coachConfig = (workspace?.studioInfo as any)?.whatsappCoach

      if (!coachConfig || !coachConfig.enabled) {
        logger.debug({ workspaceId }, 'WhatsApp Coach not enabled for workspace')
        return result
      }

      const dueFollowups = await prisma.followup.findMany({
        where: {
          workspaceId,
          type: 'whatsapp',
          status: 'pending',
          scheduledAt: {
            lte: new Date(),
          },
        },
        include: {
          lead: true,
        },
        take: limit,
        orderBy: {
          scheduledAt: 'asc',
        },
      })

      logger.info(
        { workspaceId, count: dueFollowups.length },
        'Processing due WhatsApp Coach followups'
      )

      for (const followup of dueFollowups) {
        result.processed++

        try {
          const lastMessages = await prisma.message.findMany({
            where: {
              workspaceId,
              leadId: followup.leadId,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          })

          const messageHistory = lastMessages
            .reverse()
            .map((m) => `${m.direction === 'inbound' ? 'Lead' : 'Coach'}: ${m.content}`)

          const aiResult = await openaiAdapter.generateCoachMessage({
            tone: coachConfig.tone || 'motivierend und freundlich',
            goal: coachConfig.goal || 'Regelmäßiges Training',
            lastMessages: messageHistory,
            language: coachConfig.language || 'DE',
            leadName: followup.lead?.name,
            targetAudience: coachConfig.targetAudience,
          })

          if (!aiResult.ok || !aiResult.data?.text) {
            logger.error(
              { workspaceId, followupId: followup.id, error: aiResult.error },
              'Failed to generate AI message'
            )
            result.failed++
            continue
          }

          const sendResult = await whatsappAdapter.sendMessage(
            workspaceId,
            followup.lead?.phone || '',
            aiResult.data.text
          )

          if (!sendResult.ok) {
            logger.error(
              { workspaceId, followupId: followup.id, error: sendResult.error },
              'Failed to send WhatsApp message'
            )
            result.failed++

            await prisma.followup.update({
              where: { id: followup.id },
              data: {
                status: 'failed',
                completedAt: new Date(),
              },
            })
            continue
          }

          await prisma.message.create({
            data: {
              workspaceId,
              leadId: followup.leadId,
              direction: 'outbound',
              channel: 'whatsapp',
              content: aiResult.data.text,
              status: 'sent',
              externalId: sendResult.data?.messageId,
            },
          })

          await prisma.followup.update({
            where: { id: followup.id },
            data: {
              status: 'sent',
              completedAt: new Date(),
            },
          })

          result.sent++

          await scheduleNextFollowup(workspaceId, followup.leadId, coachConfig)

          logger.info(
            { workspaceId, followupId: followup.id, leadId: followup.leadId },
            'WhatsApp Coach message sent successfully'
          )
        } catch (error: any) {
          logger.error(
            { error, workspaceId, followupId: followup.id },
            'Error processing followup'
          )
          result.failed++
        }
      }

      return result
    } finally {
      await lock.release()
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Error in processWorkspaceFollowups')
    return result
  }
}

/**
 * Schedule next followup for a lead based on frequency
 */
async function scheduleNextFollowup(
  workspaceId: string,
  leadId: string,
  coachConfig: any
): Promise<void> {
  try {
    const frequency = coachConfig.frequency || 'weekly'
    const timeWindow = coachConfig.timeWindow || { start: '09:00', end: '18:00' }

    let hoursToAdd = 168 // weekly (7 days)
    if (frequency === 'daily') {
      hoursToAdd = 24
    } else if (frequency === '3x_week') {
      hoursToAdd = 56 // ~2.3 days
    }

    const nextScheduledAt = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000)

    const [startHour, startMinute] = timeWindow.start.split(':').map(Number)
    nextScheduledAt.setHours(startHour, startMinute, 0, 0)

    await prisma.followup.create({
      data: {
        workspaceId,
        leadId,
        type: 'whatsapp',
        status: 'pending',
        scheduledAt: nextScheduledAt,
        content: 'WhatsApp Coach message (AI-generated)',
      },
    })

    logger.debug(
      { workspaceId, leadId, nextScheduledAt },
      'Next followup scheduled'
    )
  } catch (error: any) {
    logger.error({ error, workspaceId, leadId }, 'Failed to schedule next followup')
  }
}

/**
 * Process all workspaces with due followups
 */
export async function processAllWorkspaces(
  maxWorkspaces: number = 50
): Promise<{ workspacesProcessed: number; totalResults: SchedulerResult }> {
  try {
    const workspacesWithDueFollowups = await prisma.followup.findMany({
      where: {
        type: 'whatsapp',
        status: 'pending',
        scheduledAt: {
          lte: new Date(),
        },
      },
      select: {
        workspaceId: true,
      },
      distinct: ['workspaceId'],
      take: maxWorkspaces,
    })

    const uniqueWorkspaces = [
      ...new Set(workspacesWithDueFollowups.map((f) => f.workspaceId)),
    ]

    logger.info(
      { count: uniqueWorkspaces.length },
      'Processing workspaces with due followups'
    )

    const totalResults: SchedulerResult = {
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
    }

    for (const workspaceId of uniqueWorkspaces) {
      const result = await processWorkspaceFollowups(workspaceId)
      totalResults.processed += result.processed
      totalResults.sent += result.sent
      totalResults.failed += result.failed
      totalResults.skipped += result.skipped
    }

    return {
      workspacesProcessed: uniqueWorkspaces.length,
      totalResults,
    }
  } catch (error: any) {
    logger.error({ error }, 'Error in processAllWorkspaces')
    throw error
  }
}
