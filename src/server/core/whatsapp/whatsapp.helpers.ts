/**
 * WhatsApp Helper Functions
 */

import { WhatsAppTenantConfig, WhatsAppIncomingMessage } from './whatsapp.types'

/**
 * Get tenant configuration (STUB)
 * 
 * In production, this would fetch from database
 */
export async function getTenantConfig(tenantId: string): Promise<WhatsAppTenantConfig> {
  console.log(`[WHATSAPP HELPERS] Getting config for tenant: ${tenantId}`)

  return {
    tenantId,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'PHONE_NUMBER_ID_STUB',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'ACCESS_TOKEN_STUB',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    webhookVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'pilar_systems_verify_token',
  }
}

/**
 * Extract tenant ID from phone number or query params
 * 
 * In production, this would look up tenant by phone number in database
 */
export async function extractTenantId(
  phoneNumberId: string,
  queryParams?: Record<string, string>
): Promise<string | undefined> {
  if (queryParams?.tenantId) {
    return queryParams.tenantId
  }

  console.log(`[WHATSAPP HELPERS] Looking up tenant for phone number: ${phoneNumberId}`)

  return 'default'
}

/**
 * Format phone number
 * 
 * Ensures phone number is in correct format (without + or spaces)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Extract text from message
 */
export function extractMessageText(message: WhatsAppIncomingMessage): string | null {
  if (message.type === 'text' && message.text) {
    return message.text.body
  }

  if (message.type === 'image' && message.image?.caption) {
    return message.image.caption
  }

  if (message.type === 'video' && message.video?.caption) {
    return message.video.caption
  }

  if (message.type === 'document' && message.document?.caption) {
    return message.document.caption
  }

  return null
}

/**
 * Check if message is a reply
 */
export function isReply(message: WhatsAppIncomingMessage): boolean {
  return !!message.context
}

/**
 * Get replied message ID
 */
export function getRepliedMessageId(message: WhatsAppIncomingMessage): string | null {
  return message.context?.id || null
}

/**
 * Validate phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = formatPhoneNumber(phone)
  return cleaned.length >= 10 && cleaned.length <= 15
}

/**
 * Truncate text to WhatsApp limit
 * 
 * WhatsApp has a 4096 character limit for text messages
 */
export function truncateText(text: string, maxLength: number = 4096): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Split long text into multiple messages
 */
export function splitLongText(text: string, maxLength: number = 4096): string[] {
  if (text.length <= maxLength) {
    return [text]
  }

  const messages: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      messages.push(remaining)
      break
    }

    let splitIndex = remaining.lastIndexOf('.', maxLength)
    if (splitIndex === -1 || splitIndex < maxLength / 2) {
      splitIndex = remaining.lastIndexOf(' ', maxLength)
      if (splitIndex === -1 || splitIndex < maxLength / 2) {
        splitIndex = maxLength
      }
    }

    messages.push(remaining.substring(0, splitIndex + 1).trim())
    remaining = remaining.substring(splitIndex + 1).trim()
  }

  return messages
}

/**
 * Format error message for user
 */
export function formatErrorMessage(error: Error | string): string {
  const message = error instanceof Error ? error.message : error
  return `Entschuldigung, es ist ein Fehler aufgetreten: ${message}`
}

/**
 * Check if tenant has WhatsApp configured
 */
export async function isTenantConfigured(tenantId: string): Promise<boolean> {
  try {
    const config = await getTenantConfig(tenantId)
    return !!(config.phoneNumberId && config.accessToken)
  } catch {
    return false
  }
}
