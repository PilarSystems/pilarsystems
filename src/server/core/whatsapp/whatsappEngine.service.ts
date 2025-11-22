/**
 * WhatsApp Engine Service
 * 
 * Main service for handling WhatsApp messages and integrating with the orchestrator
 */

import { orchestrate } from '../../orchestrator/orchestrator.service'
import { Channel } from '../../orchestrator/orchestrator.types'
import { sendTextMessage, sendErrorMessage, markMessageAsRead } from './whatsapp.outgoing'
import {
  getTenantConfig,
  extractTenantId,
  extractMessageText,
  splitLongText,
} from './whatsapp.helpers'
import {
  WhatsAppWebhookPayload,
  WhatsAppIncomingMessage,
  ProcessedMessageResult,
} from './whatsapp.types'

/**
 * WhatsApp Engine Service
 */
export class WhatsAppEngineService {
  constructor() {
    console.log('[WHATSAPP ENGINE] Service initialized')
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(
    payload: WhatsAppWebhookPayload,
    queryParams?: Record<string, string>
  ): Promise<ProcessedMessageResult> {
    try {
      if (payload.object !== 'whatsapp_business_account') {
        return {
          success: false,
          error: 'Invalid webhook object type',
        }
      }

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { value } = change

            const tenantId = await extractTenantId(
              value.metadata.phone_number_id,
              queryParams
            )

            if (!tenantId) {
              console.error('[WHATSAPP ENGINE] Could not determine tenant ID')
              continue
            }

            if (value.messages && value.messages.length > 0) {
              for (const message of value.messages) {
                await this.processMessage(message, tenantId)
              }
            }

            if (value.statuses && value.statuses.length > 0) {
              for (const status of value.statuses) {
                console.log(`[WHATSAPP ENGINE] Status update: ${status.status} for message ${status.id}`)
              }
            }
          }
        }
      }

      return {
        success: true,
      }

    } catch (error) {
      console.error('[WHATSAPP ENGINE] Error processing webhook:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Process individual message
   */
  private async processMessage(
    message: WhatsAppIncomingMessage,
    tenantId: string
  ): Promise<void> {
    console.log(`[WHATSAPP ENGINE] Processing message ${message.id} from ${message.from}`)

    try {
      const config = await getTenantConfig(tenantId)

      await markMessageAsRead(config, message.id)

      const text = extractMessageText(message)

      if (!text) {
        console.log(`[WHATSAPP ENGINE] No text content in message ${message.id}`)
        return
      }

      const result = await orchestrate({
        channel: Channel.WHATSAPP,
        payload: {
          from: message.from,
          sender: message.from,
          text,
          messageId: message.id,
          timestamp: message.timestamp,
          type: message.type,
        },
        timestamp: new Date(parseInt(message.timestamp) * 1000),
        tenantId,
      })

      console.log(`[WHATSAPP ENGINE] Orchestrator response: "${result.response.content}"`)

      await this.sendResponse(config, message.from, result.response.content)

    } catch (error) {
      console.error('[WHATSAPP ENGINE] Error processing message:', error)

      try {
        const config = await getTenantConfig(tenantId)
        await sendErrorMessage(config, message.from)
      } catch (sendError) {
        console.error('[WHATSAPP ENGINE] Error sending error message:', sendError)
      }
    }
  }

  /**
   * Send response to user
   */
  private async sendResponse(
    config: any,
    to: string,
    text: string
  ): Promise<void> {
    const messages = splitLongText(text)

    for (const message of messages) {
      const result = await sendTextMessage(config, to, message)

      if (result.success) {
        console.log(`[WHATSAPP ENGINE] Sent message to ${to}: ${result.messageId}`)
      } else {
        console.error(`[WHATSAPP ENGINE] Failed to send message to ${to}: ${result.error}`)
      }

      if (messages.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  /**
   * Send message directly (for testing)
   */
  async sendMessage(
    tenantId: string,
    to: string,
    text: string
  ): Promise<ProcessedMessageResult> {
    try {
      const config = await getTenantConfig(tenantId)
      const result = await sendTextMessage(config, to, text)

      if (result.success) {
        return {
          success: true,
          messageId: result.messageId,
          response: text,
        }
      } else {
        return {
          success: false,
          error: result.error,
        }
      }

    } catch (error) {
      console.error('[WHATSAPP ENGINE] Error sending message:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Simulate incoming message (for testing)
   */
  async simulateIncomingMessage(
    tenantId: string,
    from: string,
    text: string
  ): Promise<ProcessedMessageResult> {
    console.log(`[WHATSAPP ENGINE] Simulating message from ${from}: "${text}"`)

    try {
      const result = await orchestrate({
        channel: Channel.WHATSAPP,
        payload: {
          from,
          sender: from,
          text,
          messageId: `sim_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'text',
        },
        timestamp: new Date(),
        tenantId,
      })

      console.log(`[WHATSAPP ENGINE] Orchestrator response: "${result.response.content}"`)

      return {
        success: true,
        response: result.response.content,
      }

    } catch (error) {
      console.error('[WHATSAPP ENGINE] Error simulating message:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

let whatsappEngineInstance: WhatsAppEngineService | null = null

/**
 * Get WhatsApp engine instance
 */
export function getWhatsAppEngine(): WhatsAppEngineService {
  if (!whatsappEngineInstance) {
    whatsappEngineInstance = new WhatsAppEngineService()
  }
  return whatsappEngineInstance
}
