export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt } from '@/lib/encryption'
import { z } from 'zod'


export const runtime = 'nodejs'

const step6Schema = z.object({
  userId: z.string(),
  email: z.object({
    emailUser: z.string().optional(),
    emailPassword: z.string().optional(),
    imapHost: z.string().optional(),
    imapPort: z.string().optional(),
    smtpHost: z.string().optional(),
    smtpPort: z.string().optional(),
  }),
  calendar: z.object({
    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step6Schema.parse(body)

    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: data.userId },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (data.email.emailUser && data.email.emailPassword) {
      await prisma.integration.upsert({
        where: {
          workspaceId_type: {
            workspaceId: workspace.id,
            type: 'email',
          },
        },
        create: {
          workspaceId: workspace.id,
          type: 'email',
          config: encrypt(JSON.stringify(data.email)),
          status: 'active',
        },
        update: {
          config: encrypt(JSON.stringify(data.email)),
          status: 'active',
        },
      })
    }

    if (data.calendar.googleClientId && data.calendar.googleClientSecret) {
      await prisma.integration.upsert({
        where: {
          workspaceId_type: {
            workspaceId: workspace.id,
            type: 'calendar',
          },
        },
        create: {
          workspaceId: workspace.id,
          type: 'calendar',
          config: encrypt(JSON.stringify(data.calendar)),
          status: 'active',
        },
        update: {
          config: encrypt(JSON.stringify(data.calendar)),
          status: 'active',
        },
      })
    }

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 6,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 6,
        completed: true,
        data: {
          step6: {
            emailConfigured: !!data.email.emailUser,
            calendarConfigured: !!data.calendar.googleClientId,
          },
        },
      },
      update: {
        completed: true,
        data: {
          step6: {
            emailConfigured: !!data.email.emailUser,
            calendarConfigured: !!data.calendar.googleClientId,
          },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 6')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
