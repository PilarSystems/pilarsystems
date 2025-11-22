export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { processWhatsAppMessage } from '@/services/ai/whatsapp-ai'
import { logger } from '@/lib/logger'
import { WhatsAppWebhookPayload } from '@/types'
import { processWebhookWithIdempotency } from '@/lib/queue/webhook-processor'
import { resolveTenantFromWebhook } from '@/lib/tenant/with-tenant'
import { enqueueWebhook, checkRateLimit } from '@/lib/queue/webhook-queue'
import { eventBus } from '@/lib/autopilot/event-bus'
import { prisma } from '@/lib/prisma'
import '@/lib/autopilot/registry'

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid verification' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json()

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

            let lead = await prisma.lead.findFirst({
              where: {
                workspaceId,
                phone: message.from,
              },
            })

            if (!lead) {
              lead = await prisma.lead.create({
                data: {
                  workspaceId,
                  phone: message.from,
                  name: message.from,
                  status: 'new',
                  source: 'whatsapp',
                },
              })
            }

            await eventBus.createEvent({
              workspaceId,
              type: 'coach.message_received',
              payload: {
                leadId: lead.id,
                message: message.text.body,
                from: message.from,
                messageId: message.id,
              },
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
