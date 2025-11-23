/**
 * WhatsApp Engine Types
 * 
 * Type definitions for WhatsApp Cloud API integration
 */

/**
 * WhatsApp message types
 */
export enum WhatsAppMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  TEMPLATE = 'template',
  INTERACTIVE = 'interactive',
}

/**
 * WhatsApp webhook event types
 */
export enum WhatsAppEventType {
  MESSAGE = 'message',
  STATUS = 'status',
}

/**
 * Tenant WhatsApp configuration
 */
export interface WhatsAppTenantConfig {
  tenantId: string
  phoneNumberId: string
  accessToken: string
  businessAccountId?: string
  webhookVerifyToken?: string
}

/**
 * Incoming WhatsApp message
 */
export interface WhatsAppIncomingMessage {
  from: string
  id: string
  timestamp: string
  type: WhatsAppMessageType
  text?: {
    body: string
  }
  image?: {
    id: string
    mime_type: string
    sha256: string
    caption?: string
  }
  video?: {
    id: string
    mime_type: string
    sha256: string
    caption?: string
  }
  audio?: {
    id: string
    mime_type: string
    sha256: string
  }
  document?: {
    id: string
    mime_type: string
    sha256: string
    filename?: string
    caption?: string
  }
  context?: {
    from: string
    id: string
  }
}

/**
 * WhatsApp webhook payload
 */
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
        messages?: WhatsAppIncomingMessage[]
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

/**
 * Outgoing text message
 */
export interface WhatsAppTextMessage {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'text'
  text: {
    preview_url?: boolean
    body: string
  }
}

/**
 * Outgoing template message
 */
export interface WhatsAppTemplateMessage {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'template'
  template: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text?: string
        image?: { link: string }
        video?: { link: string }
        document?: { link: string; filename?: string }
      }>
    }>
  }
}

/**
 * Outgoing media message
 */
export interface WhatsAppMediaMessage {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'image' | 'video' | 'audio' | 'document'
  image?: {
    link?: string
    id?: string
    caption?: string
  }
  video?: {
    link?: string
    id?: string
    caption?: string
  }
  audio?: {
    link?: string
    id?: string
  }
  document?: {
    link?: string
    id?: string
    caption?: string
    filename?: string
  }
}

/**
 * WhatsApp API response
 */
export interface WhatsAppAPIResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

/**
 * WhatsApp API error
 */
export interface WhatsAppAPIError {
  error: {
    message: string
    type: string
    code: number
    error_subcode?: number
    fbtrace_id: string
  }
}

/**
 * Message send result
 */
export interface MessageSendResult {
  success: boolean
  messageId?: string
  error?: string
  details?: any
}

/**
 * Processed message result
 */
export interface ProcessedMessageResult {
  success: boolean
  messageId?: string
  response?: string
  error?: string
}
