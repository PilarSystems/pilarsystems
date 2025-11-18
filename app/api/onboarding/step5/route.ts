export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt } from '@/lib/encryption'
import { z } from 'zod'

const step5Schema = z.object({
  userId: z.string(),
  whatsappApiToken: z.string().optional(),
  whatsappPhoneNumberId: z.string().optional(),
  whatsappBusinessAccountId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step5Schema.parse(body)

    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: data.userId },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (data.whatsappApiToken && data.whatsappPhoneNumberId && data.whatsappBusinessAccountId) {
      await prisma.integration.upsert({
        where: {
          workspaceId_type: {
            workspaceId: workspace.id,
            type: 'whatsapp',
          },
        },
        create: {
          workspaceId: workspace.id,
          type: 'whatsapp',
          config: encrypt(JSON.stringify({
            apiToken: data.whatsappApiToken,
            phoneNumberId: data.whatsappPhoneNumberId,
            businessAccountId: data.whatsappBusinessAccountId,
          })),
          status: 'active',
        },
        update: {
          config: encrypt(JSON.stringify({
            apiToken: data.whatsappApiToken,
            phoneNumberId: data.whatsappPhoneNumberId,
            businessAccountId: data.whatsappBusinessAccountId,
          })),
          status: 'active',
        },
      })
    }

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 5,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 5,
        completed: true,
        data: { step5: { configured: !!data.whatsappApiToken } },
      },
      update: {
        completed: true,
        data: { step5: { configured: !!data.whatsappApiToken } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 5')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
