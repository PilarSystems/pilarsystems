export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const configSchema = z.object({
  workspaceId: z.string().uuid(),
  targetAudience: z.string(),
  goal: z.string(),
  frequency: z.string(),
  timeWindow: z.object({
    start: z.string(),
    end: z.string(),
  }),
  tone: z.string(),
  language: z.string(),
  enabled: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = configSchema.parse(body)

    await prisma.workspace.update({
      where: { id: data.workspaceId },
      data: {
        studioInfo: {
          whatsappCoach: {
            targetAudience: data.targetAudience,
            goal: data.goal,
            frequency: data.frequency,
            timeWindow: data.timeWindow,
            tone: data.tone,
            language: data.language,
            enabled: data.enabled ?? false,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    })

    logger.info({ workspaceId: data.workspaceId }, 'WhatsApp coach config saved')

    const workspace = await prisma.workspace.findUnique({
      where: { id: data.workspaceId },
      select: { studioInfo: true },
    })

    const coachEnabled = (workspace?.studioInfo as any)?.whatsappCoach?.enabled

    if (coachEnabled) {
      try {
        const leads = await prisma.lead.findMany({
          where: {
            workspaceId: data.workspaceId,
            status: {
              in: ['new', 'contacted', 'qualified'],
            },
          },
          take: 100,
        })

        const timeWindow = data.timeWindow || { start: '09:00', end: '18:00' }
        const [startHour, startMinute] = timeWindow.start.split(':').map(Number)
        
        const nextScheduledAt = new Date()
        nextScheduledAt.setHours(startHour, startMinute, 0, 0)
        
        if (nextScheduledAt < new Date()) {
          nextScheduledAt.setDate(nextScheduledAt.getDate() + 1)
        }

        for (const lead of leads) {
          const existingFollowup = await prisma.followup.findFirst({
            where: {
              workspaceId: data.workspaceId,
              leadId: lead.id,
              type: 'whatsapp',
              status: 'pending',
            },
          })

          if (!existingFollowup && lead.phone) {
            await prisma.followup.create({
              data: {
                workspaceId: data.workspaceId,
                leadId: lead.id,
                type: 'whatsapp',
                status: 'pending',
                scheduledAt: nextScheduledAt,
                content: 'WhatsApp Coach message (AI-generated)',
              },
            })
          }
        }

        logger.info(
          { workspaceId: data.workspaceId, leadsCount: leads.length },
          'Initial followups created for WhatsApp Coach'
        )
      } catch (error) {
        logger.error({ error, workspaceId: data.workspaceId }, 'Failed to create initial followups')
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save WhatsApp coach config')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const config = (workspace.studioInfo as any)?.whatsappCoach || null

    return NextResponse.json({ config })
  } catch (error) {
    logger.error({ error }, 'Failed to get WhatsApp coach config')
    return NextResponse.json({ error: 'Failed to get configuration' }, { status: 500 })
  }
}
