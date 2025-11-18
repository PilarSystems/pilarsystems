import { NextRequest, NextResponse } from 'next/server'
import { processWhatsAppMessage } from '@/services/ai/whatsapp-ai'
import { logger } from '@/lib/logger'
import { WhatsAppWebhookPayload } from '@/types'

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
            const workspaceId = 'placeholder-workspace-id'

            await processWhatsAppMessage(
              workspaceId,
              message.from,
              message.text.body
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
