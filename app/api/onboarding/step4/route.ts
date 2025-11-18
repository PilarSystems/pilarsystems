export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt } from '@/lib/encryption'
import { z } from 'zod'

const step4Schema = z.object({
  userId: z.string(),
  twilioAccountSid: z.string().optional(),
  twilioAuthToken: z.string().optional(),
  twilioPhoneNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step4Schema.parse(body)

    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: data.userId },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (data.twilioAccountSid && data.twilioAuthToken && data.twilioPhoneNumber) {
      await prisma.integration.upsert({
        where: {
          workspaceId_type: {
            workspaceId: workspace.id,
            type: 'phone',
          },
        },
        create: {
          workspaceId: workspace.id,
          type: 'phone',
          config: encrypt(JSON.stringify({
            accountSid: data.twilioAccountSid,
            authToken: data.twilioAuthToken,
            phoneNumber: data.twilioPhoneNumber,
          })),
          status: 'active',
        },
        update: {
          config: encrypt(JSON.stringify({
            accountSid: data.twilioAccountSid,
            authToken: data.twilioAuthToken,
            phoneNumber: data.twilioPhoneNumber,
          })),
          status: 'active',
        },
      })
    }

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 4,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 4,
        completed: true,
        data: { step4: { configured: !!data.twilioAccountSid } },
      },
      update: {
        completed: true,
        data: { step4: { configured: !!data.twilioAccountSid } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 4')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
