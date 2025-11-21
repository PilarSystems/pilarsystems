export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { processMissedCall } from '@/services/ai/phone-ai'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { TwilioWebhookPayload } from '@/types'
import { processWebhookWithIdempotency } from '@/lib/queue/webhook-processor'
import { resolveTenantFromWebhook } from '@/lib/tenant/with-tenant'
import { enqueueWebhook } from '@/lib/queue/webhook-queue'
import twilio from 'twilio'

function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

async function validateTwilioSignature(
  request: NextRequest,
  body: Record<string, string>
): Promise<boolean> {
  const signature = request.headers.get('x-twilio-signature')
  if (!signature) {
    return false
  }

  const url = request.url
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!authToken) {
    logger.warn('TWILIO_AUTH_TOKEN not configured, skipping signature validation')
    return true
  }

  try {
    return twilio.validateRequest(authToken, signature, url, body)
  } catch (error) {
    logger.error({ error }, 'Twilio signature validation error')
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    const isValid = await validateTwilioSignature(request, body)
    if (!isValid) {
      logger.warn('Invalid Twilio signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }
    
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

    const normalizedTo = normalizePhoneNumber(payload.To)
    const workspaceId = await resolveTenantFromWebhook('twilio', normalizedTo)

    if (!workspaceId) {
      logger.warn({ phoneNumber: payload.To }, 'No workspace found for Twilio phone number')
      return NextResponse.json({ success: true })
    }

    await enqueueWebhook(workspaceId, 'twilio', payload)

    const result = await processWebhookWithIdempotency(
      'twilio',
      payload.CallSid,
      workspaceId,
      payload,
      async () => {
        if (payload.CallStatus === 'no-answer' || payload.CallStatus === 'busy') {
          await processMissedCall(
            workspaceId,
            payload.From,
            payload.CallSid,
            payload.RecordingUrl,
            payload.TranscriptionText
          )
        }
      }
    )

    return NextResponse.json({ success: true, processed: result.processed })
  } catch (error) {
    logger.error({ error }, 'Twilio webhook error')
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
