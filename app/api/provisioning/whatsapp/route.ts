export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { whatsappAutomationService } from '@/services/whatsapp/automation'
import { jobQueue } from '@/lib/queue'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const provisionSchema = z.object({
  workspaceId: z.string().uuid(),
  wabaId: z.string(),
  phoneNumberId: z.string(),
  phoneNumber: z.string(),
  accessToken: z.string(),
  systemUserId: z.string().optional(),
})

/**
 * POST /api/provisioning/whatsapp
 * Provision WhatsApp Business API for a workspace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = provisionSchema.parse(body)

    logger.info({ workspaceId: data.workspaceId }, 'Starting WhatsApp provisioning')

    const jobId = await jobQueue.enqueue(data.workspaceId, 'whatsapp_setup')

    try {
      await jobQueue.updateProgress(jobId, 10, 'in_progress')

      await whatsappAutomationService.provisionWhatsApp({
        workspaceId: data.workspaceId,
        wabaId: data.wabaId,
        phoneNumberId: data.phoneNumberId,
        phoneNumber: data.phoneNumber,
        accessToken: data.accessToken,
        systemUserId: data.systemUserId,
      })

      await jobQueue.updateProgress(jobId, 100)

      await jobQueue.complete(jobId, {
        phoneNumber: data.phoneNumber,
        phoneNumberId: data.phoneNumberId,
      })

      return NextResponse.json({
        success: true,
        jobId,
        data: {
          phoneNumber: data.phoneNumber,
          phoneNumberId: data.phoneNumberId,
        },
      })
    } catch (error) {
      await jobQueue.fail(jobId, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  } catch (error) {
    logger.error({ error }, 'WhatsApp provisioning failed')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Provisioning failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/provisioning/whatsapp?workspaceId=xxx
 * Get WhatsApp provisioning status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const status = await whatsappAutomationService.getIntegrationStatus(workspaceId)

    if (!status) {
      return NextResponse.json({ provisioned: false })
    }

    return NextResponse.json({
      provisioned: true,
      ...status,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get WhatsApp status')
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
