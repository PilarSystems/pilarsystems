export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { twilioSubaccountService } from '@/services/twilio/subaccount'
import { twilioNumberProvisioner } from '@/services/twilio/number-provisioner'
import { jobQueue } from '@/lib/queue'
import { logger } from '@/lib/logger'
import { getCachedConfig } from '@/lib/config/env'
import { isFeatureEnabled, disabledFeatureResponse } from '@/lib/features'
import { z } from 'zod'

const provisionSchema = z.object({
  workspaceId: z.string().uuid(),
  workspaceName: z.string(),
  countryCode: z.string().length(2),
  areaCode: z.string().optional(),
  numberType: z.enum(['local', 'mobile', 'tollfree']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('twilio')) {
      logger.warn('Twilio provisioning requested but feature is disabled')
      return NextResponse.json(disabledFeatureResponse('twilio'), { status: 200 })
    }

    const config = getCachedConfig()
    if (!config.twilioEnabled) {
      logger.warn('Twilio auto-provisioning requested but master credentials not configured')
      return NextResponse.json(
        {
          error: 'Twilio auto-provisioning not available',
          code: 'FEATURE_DISABLED_TWILIO_MASTER',
          message: 'Phone AI auto-provisioning ist derzeit vom Admin nicht konfiguriert. Bitte verwende eine eigene Twilio-Nummer oder kontaktiere den Support.',
        },
        { status: 501 }
      )
    }

    const body = await request.json()
    const data = provisionSchema.parse(body)

    logger.info({ workspaceId: data.workspaceId }, 'Starting Twilio provisioning')

    const jobId = await jobQueue.enqueue(data.workspaceId, 'twilio_subaccount')

    try {
      await jobQueue.updateProgress(jobId, 10, 'in_progress')

      const subaccount = await twilioSubaccountService.createSubaccount({
        workspaceId: data.workspaceId,
        friendlyName: data.workspaceName,
      })

      await jobQueue.updateProgress(jobId, 50)

      const number = await twilioNumberProvisioner.provisionNumber({
        workspaceId: data.workspaceId,
        countryCode: data.countryCode,
        areaCode: data.areaCode,
        numberType: data.numberType || 'local',
      })

      await jobQueue.updateProgress(jobId, 100)

      await jobQueue.complete(jobId, {
        subaccountSid: subaccount.subaccountSid,
        phoneNumber: number.phoneNumber,
        phoneNumberSid: number.phoneNumberSid,
      })

      return NextResponse.json({
        success: true,
        jobId,
        data: {
          subaccountSid: subaccount.subaccountSid,
          phoneNumber: number.phoneNumber,
          phoneNumberSid: number.phoneNumberSid,
          capabilities: number.capabilities,
        },
      })
    } catch (error) {
      await jobQueue.fail(jobId, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  } catch (error) {
    logger.error({ error }, 'Twilio provisioning failed')

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const jobs = await jobQueue.getWorkspaceJobs(workspaceId, 'twilio_subaccount')
    const latestJob = jobs[0]

    if (!latestJob) {
      return NextResponse.json({ provisioned: false })
    }

    return NextResponse.json({
      provisioned: latestJob.status === 'completed',
      status: latestJob.status,
      progress: latestJob.progress,
      result: latestJob.result,
      error: latestJob.error,
      jobId: latestJob.id,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get provisioning status')
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
