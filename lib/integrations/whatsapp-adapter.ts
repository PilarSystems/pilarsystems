/**
 * PILAR AUTOPILOT - WhatsApp Adapter
 * 
 * Handles WhatsApp Cloud API integration for sending messages
 * Gracefully degrades when ENV not configured
 */

import { IWhatsAppAdapter, IAdapterResult } from './base'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { withRetry } from '@/lib/autopilot/self-healing'

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

class WhatsAppAdapter implements IWhatsAppAdapter {
  private isConfigured(): boolean {
    return !!(WHATSAPP_API_TOKEN && WHATSAPP_PHONE_NUMBER_ID)
  }

  async sendMessage(
    workspaceId: string,
    to: string,
    text: string
  ): Promise<
    IAdapterResult<{
      messageId: string
    }>
  > {
    if (!this.isConfigured()) {
      logger.warn({ workspaceId }, 'WhatsApp not configured, skipping message send')
      return {
        ok: false,
        error: 'WhatsApp not configured',
        code: 'INTEGRATION_OFFLINE',
      }
    }

    try {
      const integration = await prisma.whatsAppIntegration.findUnique({
        where: { workspaceId },
      })

      if (!integration || !integration.phoneNumberId || !integration.accessToken) {
        logger.warn({ workspaceId }, 'WhatsApp integration not found for workspace')
        return {
          ok: false,
          error: 'WhatsApp integration not configured for this workspace',
          code: 'CONFIGURATION_ERROR',
        }
      }

      const cleanTo = to.replace(/[^0-9]/g, '')

      const response = await withRetry(async () => {
        const res = await fetch(
          `https://graph.facebook.com/v17.0/${integration.phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${integration.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanTo,
              type: 'text',
              text: {
                body: text,
              },
            }),
          }
        )

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(
            `WhatsApp API error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
          )
        }

        return await res.json()
      })

      logger.info(
        {
          workspaceId,
          to: cleanTo,
          messageId: response.messages?.[0]?.id,
        },
        'WhatsApp message sent'
      )

      return {
        ok: true,
        data: {
          messageId: response.messages?.[0]?.id || 'unknown',
        },
      }
    } catch (error: any) {
      logger.error({ error, workspaceId, to }, 'Failed to send WhatsApp message')
      return {
        ok: false,
        error: error.message || 'Failed to send message',
        code: error.code || 'WEBHOOK_ERROR',
      }
    }
  }

  verifyWebhook(
    token: string,
    mode: string,
    challenge: string
  ): IAdapterResult<{ challenge: string }> {
    if (!WHATSAPP_VERIFY_TOKEN) {
      logger.warn('WhatsApp verify token not configured')
      return {
        ok: false,
        error: 'WhatsApp verify token not configured',
        code: 'CONFIGURATION_ERROR',
      }
    }

    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      logger.info('WhatsApp webhook verified successfully')
      return {
        ok: true,
        data: { challenge },
      }
    }

    logger.warn({ mode, tokenMatch: token === WHATSAPP_VERIFY_TOKEN }, 'WhatsApp webhook verification failed')
    return {
      ok: false,
      error: 'Webhook verification failed',
      code: 'THIRD_PARTY_AUTH_FAILED',
    }
  }

  async getStatus(
    workspaceId: string
  ): Promise<
    IAdapterResult<{
      connected: boolean
      phoneNumberId?: string
    }>
  > {
    try {
      const integration = await prisma.whatsAppIntegration.findUnique({
        where: { workspaceId },
      })

      if (!integration) {
        return {
          ok: true,
          data: {
            connected: false,
          },
        }
      }

      return {
        ok: true,
        data: {
          connected: !!(integration.phoneNumberId && integration.accessToken),
          phoneNumberId: integration.phoneNumberId || undefined,
        },
      }
    } catch (error: any) {
      logger.error({ error, workspaceId }, 'Failed to get WhatsApp status')
      return {
        ok: false,
        error: error.message || 'Failed to get status',
      }
    }
  }
}

export const whatsappAdapter = new WhatsAppAdapter()
