export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { processWhatsAppMessage } from '@/services/ai/whatsapp-ai'
import { logger } from '@/lib/logger'
import { WhatsAppWebhookPayload } from '@/types'
import { processWebhookWithIdempotency } from '@/lib/queue/webhook-processor'
import { resolveTenantFromWebhook } from '@/lib/tenant/with-tenant'
import { enqueueWebhook, checkRateLimit } from '@/lib/queue/webhook-queue'
import crypto from 'crypto'

function validateWhatsAppSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature) {
    return false
  }

  const appSecret = process.env.WHATSAPP_APP_SECRET

  if (!appSecret) {
    logger.warn('WHATSAPP_APP_SECRET not configured, skipping signature validation')
    return true
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body)
      .digest('hex')

    const providedSignature = signature.replace('sha256=', '')
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(providedSignature)
    )
  } catch (error) {
    logger.error({ error }, 'WhatsApp signature validation error')
    return false
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid verification' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    const isValid = validateWhatsAppSignature(body, signature)
    if (!isValid) {
      logger.warn('Invalid WhatsApp signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const payload: WhatsAppWebhookPayload = JSON.parse(body)

    logger.info({ payload }, 'Received WhatsApp webhook')

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.value.messages) {
          for (const message of change.value.messages) {
            const phoneNumberId = change.value.metadata.phone_number_id
            const workspaceId = await resolveTenantFromWebhook('whatsapp', phoneNumberId)

            if (!workspaceId) {
              logger.warn(
                { phoneNumberId },
                'No workspace found for WhatsApp phone number'
              )
              continue
            }

            const rateLimit = await checkRateLimit(workspaceId, 'whatsapp_inbound')
            if (!rateLimit.success) {
              logger.warn(
                { workspaceId, remaining: rateLimit.remaining },
                'WhatsApp rate limit exceeded'
              )
              continue
            }

            await enqueueWebhook(workspaceId, 'whatsapp', {
              message,
              phoneNumberId,
              from: message.from
            })

            await processWebhookWithIdempotency(
              'whatsapp',
              message.id,
              workspaceId,
              message,
              async () => {
                await processWhatsAppMessage(
                  workspaceId,
                  message.from,
                  message.text.body
                )
              }
            )
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'WhatsApp webhook error')
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
