export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const completeSchema = z.object({
  userId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = completeSchema.parse(body)

    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: userId },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    for (let step = 1; step <= 7; step++) {
      await prisma.wizardProgress.upsert({
        where: {
          workspaceId_step: {
            workspaceId: workspace.id,
            step,
          },
        },
        create: {
          workspaceId: workspace.id,
          step,
          completed: true,
          data: {},
        },
        update: {
          completed: true,
        },
      })
    }

    await prisma.aiRule.createMany({
      data: [
        {
          workspaceId: workspace.id,
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
          workspaceId: workspace.id,
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
          workspaceId: workspace.id,
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

    await prisma.activityLog.create({
      data: {
        workspaceId: workspace.id,
        actionType: 'onboarding_completed',
        description: 'User completed onboarding wizard',
        metadata: {
          userId,
          completedAt: new Date().toISOString(),
        },
      },
    })

    logger.info({ workspaceId: workspace.id, userId }, 'Onboarding completed')

    try {
      const { enqueueProvisioning } = await import('@/lib/autopilot/provisioning-queue')
      await enqueueProvisioning(workspace.id, {
        source: 'onboarding',
        metadata: {
          userId,
        },
      })
      logger.info({ workspaceId: workspace.id }, 'Autopilot provisioning enqueued from onboarding')
    } catch (error) {
      logger.error({ error, workspaceId: workspace.id }, 'Failed to enqueue autopilot provisioning')
    }

    return NextResponse.json({ success: true, workspaceId: workspace.id })
  } catch (error) {
    logger.error({ error }, 'Failed to complete onboarding')
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
