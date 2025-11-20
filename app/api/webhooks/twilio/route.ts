export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { processMissedCall } from '@/services/ai/phone-ai'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { TwilioWebhookPayload } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const payload: TwilioWebhookPayload = {
      CallSid: formData.get('CallSid') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      CallStatus: formData.get('CallStatus') as string,
      Direction: formData.get('Direction') as string,
      RecordingUrl: formData.get('RecordingUrl') as string | undefined,
      TranscriptionText: formData.get('TranscriptionText') as string | undefined,
    }

    logger.info({ payload }, 'Received Twilio webhook')

    const integration = await prisma.integration.findFirst({
      where: {
        type: 'phone',
        status: 'active',
      },
      include: {
        workspace: true,
      },
    })

    if (!integration) {
      logger.warn({ phoneNumber: payload.To }, 'No active phone integration found')
      return NextResponse.json({ success: true })
    }

    const workspace = integration.workspace

    if (payload.CallStatus === 'no-answer' || payload.CallStatus === 'busy') {
      await processMissedCall(
        workspace.id,
        payload.From,
        payload.CallSid,
        payload.RecordingUrl,
        payload.TranscriptionText
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Twilio webhook error')
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
