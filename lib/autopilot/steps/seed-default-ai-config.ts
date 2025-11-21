/**
 * PILAR AUTOPILOT - Step 6: Seed Default AI Config
 * 
 * Seeds default AI rules and WhatsApp Coach config (idempotent)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { StepResult } from './ensure-subscription'

export async function seedDefaultAiConfig(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 6: Seeding default AI config')

    await prisma.aiRule.createMany({
      data: [
        {
          workspaceId,
          ruleType: 'classification',
          conditions: {
            keywords: ['probetraining', 'termin', 'anmelden', 'membership', 'vertrag'],
          },
          actions: {
            classify: 'A',
            priority: 'high',
          },
          active: true,
        },
        {
          workspaceId,
          ruleType: 'followup',
          conditions: {
            trigger: 'call_missed',
          },
          actions: {
            sendWhatsApp: true,
            scheduleFollowup: 24,
          },
          active: true,
        },
        {
          workspaceId,
          ruleType: 'auto_reply',
          conditions: {
            trigger: 'message_received',
          },
          actions: {
            autoReply: true,
          },
          active: true,
        },
      ],
      skipDuplicates: true,
    })

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true },
    })

    const currentStudioInfo = (workspace?.studioInfo as any) || {}

    if (!currentStudioInfo.whatsappCoach) {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          studioInfo: {
            ...currentStudioInfo,
            whatsappCoach: {
              targetAudience: 'Fitnessstudio-Mitglieder',
              goal: 'Regelmäßiges Training und Motivation',
              frequency: 'weekly',
              timeWindow: {
                start: '09:00',
                end: '18:00',
              },
              tone: 'motivierend und freundlich',
              language: 'DE',
              enabled: false, // User must explicitly enable
            },
          },
        },
      })

      logger.info({ workspaceId }, 'Default WhatsApp Coach config seeded')
    }

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'ai_config_seeded',
        description: 'Default AI configuration seeded',
        metadata: {
          aiRulesCount: 3,
          whatsappCoachConfigured: true,
        },
      },
    })

    logger.info({ workspaceId }, 'Default AI config seeded')

    return {
      name: 'seed_default_ai_config',
      status: 'completed',
      details: 'Default AI rules and WhatsApp Coach config seeded',
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to seed default AI config')
    return {
      name: 'seed_default_ai_config',
      status: 'failed',
      details: 'Failed to seed AI config',
      error: error.message,
    }
  }
}
