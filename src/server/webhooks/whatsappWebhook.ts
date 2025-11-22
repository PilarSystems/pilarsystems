/**
 * WhatsApp Webhook Handler
 */

import { orchestrate } from '../orchestrator/orchestrator.service'
import { Channel } from '../orchestrator/orchestrator.types'

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text?: {
            body: string
          }
          type: string
        }>
      }
      field: string
    }>
  }>
}

async function extractTenantId(payload: WhatsAppWebhookPayload, queryParams?: Record<string, string>): Promise<string | undefined> {
  if (queryParams?.tenantId) {
    return queryParams.tenantId
  }
  return undefined
}

export async function processWhatsAppWebhook(
  payload: WhatsAppWebhookPayload,
  queryParams?: Record<string, string>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const tenantId = await extractTenantId(payload, queryParams)

    const entry = payload.entry?.[0]
    if (!entry) {
      return { success: false, error: 'No entry in payload' }
    }

    const change = entry.changes?.[0]
    if (!change || change.field !== 'messages') {
      return { success: true, message: 'Not a message event' }
    }

    const messages = change.value.messages
    if (!messages || messages.length === 0) {
      return { success: true, message: 'No messages in payload' }
    }

    const results = []
    for (const message of messages) {
      if (message.type !== 'text' || !message.text?.body) {
        continue
      }

      const contact = change.value.contacts?.[0]
      const senderName = contact?.profile?.name || 'Unknown'

      const result = await orchestrate({
        channel: Channel.WHATSAPP,
        payload: {
          from: message.from,
          message: {
            text: {
              body: message.text.body,
            },
          },
          profile: {
            name: senderName,
          },
          timestamp: message.timestamp,
          messageId: message.id,
        },
        timestamp: new Date(parseInt(message.timestamp) * 1000),
        tenantId,
      })

      results.push(result)
    }

    return {
      success: true,
      message: `Processed ${results.length} messages`,
    }
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function verifyWhatsAppWebhook(
  mode: string,
  token: string,
  challenge: string
): { success: boolean; challenge?: string; error?: string } {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'pilar_systems_verify_token'

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return {
      success: true,
      challenge,
    }
  }

  return {
    success: false,
    error: 'Invalid verify token',
  }
}

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[STUB] Sending WhatsApp message to ${to}: ${message}`)

  return {
    success: true,
    messageId: `msg_${Date.now()}`,
  }
}
