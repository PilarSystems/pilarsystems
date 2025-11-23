/**
 * WhatsApp Cloud API Client
 * 
 * Client for WhatsApp Business Cloud API (Graph API v18.0)
 */

import {
  WhatsAppTenantConfig,
  WhatsAppTextMessage,
  WhatsAppTemplateMessage,
  WhatsAppMediaMessage,
  WhatsAppAPIResponse,
  WhatsAppAPIError,
  MessageSendResult,
} from './whatsapp.types'

const WHATSAPP_API_BASE_URL = 'https://graph.facebook.com/v18.0'

/**
 * WhatsApp Cloud API Client
 */
export class WhatsAppAPIClient {
  private baseUrl: string

  constructor(baseUrl: string = WHATSAPP_API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Send text message
   */
  async sendTextMessage(
    config: WhatsAppTenantConfig,
    to: string,
    text: string,
    previewUrl: boolean = false
  ): Promise<MessageSendResult> {
    const message: WhatsAppTextMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: previewUrl,
        body: text,
      },
    }

    return this.sendMessage(config, message)
  }

  /**
   * Send template message
   */
  async sendTemplateMessage(
    config: WhatsAppTenantConfig,
    to: string,
    templateName: string,
    languageCode: string = 'de',
    components?: any[]
  ): Promise<MessageSendResult> {
    const message: WhatsAppTemplateMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components,
      },
    }

    return this.sendMessage(config, message)
  }

  /**
   * Send media message (STUB)
   */
  async sendMediaMessage(
    config: WhatsAppTenantConfig,
    to: string,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    mediaUrl: string,
    caption?: string,
    filename?: string
  ): Promise<MessageSendResult> {
    console.log(`[WHATSAPP API STUB] Sending ${mediaType} to ${to}: ${mediaUrl}`)

    const message: WhatsAppMediaMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: mediaType,
    }

    if (mediaType === 'image') {
      message.image = { link: mediaUrl, caption }
    } else if (mediaType === 'video') {
      message.video = { link: mediaUrl, caption }
    } else if (mediaType === 'audio') {
      message.audio = { link: mediaUrl }
    } else if (mediaType === 'document') {
      message.document = { link: mediaUrl, caption, filename }
    }

    return this.sendMessage(config, message)
  }

  /**
   * Send message to WhatsApp Cloud API
   */
  private async sendMessage(
    config: WhatsAppTenantConfig,
    message: WhatsAppTextMessage | WhatsAppTemplateMessage | WhatsAppMediaMessage
  ): Promise<MessageSendResult> {
    const url = `${this.baseUrl}/${config.phoneNumberId}/messages`

    try {
      console.log(`[WHATSAPP API] Sending message to ${message.to}`)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        const error: WhatsAppAPIError = await response.json()
        console.error('[WHATSAPP API] Error:', error)

        return {
          success: false,
          error: error.error.message,
          details: error,
        }
      }

      const result: WhatsAppAPIResponse = await response.json()
      console.log(`[WHATSAPP API] Message sent successfully: ${result.messages[0].id}`)

      return {
        success: true,
        messageId: result.messages[0].id,
      }

    } catch (error) {
      console.error('[WHATSAPP API] Error sending message:', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get media URL
   * 
   * Retrieves the URL for a media file by its ID
   */
  async getMediaUrl(
    config: WhatsAppTenantConfig,
    mediaId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const url = `${this.baseUrl}/${mediaId}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
        },
      })

      if (!response.ok) {
        const error: WhatsAppAPIError = await response.json()
        return {
          success: false,
          error: error.error.message,
        }
      }

      const result = await response.json()
      return {
        success: true,
        url: result.url,
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(
    config: WhatsAppTenantConfig,
    messageId: string
  ): Promise<{ success: boolean; error?: string }> {
    const url = `${this.baseUrl}/${config.phoneNumberId}/messages`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        }),
      })

      if (!response.ok) {
        const error: WhatsAppAPIError = await response.json()
        return {
          success: false,
          error: error.error.message,
        }
      }

      return { success: true }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

let apiClientInstance: WhatsAppAPIClient | null = null

/**
 * Get WhatsApp API client instance
 */
export function getWhatsAppAPIClient(): WhatsAppAPIClient {
  if (!apiClientInstance) {
    apiClientInstance = new WhatsAppAPIClient()
  }
  return apiClientInstance
}
