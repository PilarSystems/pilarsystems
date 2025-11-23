/**
 * WhatsApp Outgoing Messages Layer
 * 
 * Clean interface for sending WhatsApp messages
 */

import { getWhatsAppAPIClient } from './whatsapp.api'
import { WhatsAppTenantConfig, MessageSendResult } from './whatsapp.types'

/**
 * Send text message
 */
export async function sendTextMessage(
  config: WhatsAppTenantConfig,
  to: string,
  text: string,
  previewUrl: boolean = false
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendTextMessage(config, to, text, previewUrl)
}

/**
 * Send template message
 */
export async function sendTemplateMessage(
  config: WhatsAppTenantConfig,
  to: string,
  templateName: string,
  languageCode: string = 'de',
  components?: any[]
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendTemplateMessage(config, to, templateName, languageCode, components)
}

/**
 * Send image message (STUB)
 */
export async function sendImageMessage(
  config: WhatsAppTenantConfig,
  to: string,
  imageUrl: string,
  caption?: string
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendMediaMessage(config, to, 'image', imageUrl, caption)
}

/**
 * Send video message (STUB)
 */
export async function sendVideoMessage(
  config: WhatsAppTenantConfig,
  to: string,
  videoUrl: string,
  caption?: string
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendMediaMessage(config, to, 'video', videoUrl, caption)
}

/**
 * Send audio message (STUB)
 */
export async function sendAudioMessage(
  config: WhatsAppTenantConfig,
  to: string,
  audioUrl: string
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendMediaMessage(config, to, 'audio', audioUrl)
}

/**
 * Send document message (STUB)
 */
export async function sendDocumentMessage(
  config: WhatsAppTenantConfig,
  to: string,
  documentUrl: string,
  filename?: string,
  caption?: string
): Promise<MessageSendResult> {
  const client = getWhatsAppAPIClient()
  return client.sendMediaMessage(config, to, 'document', documentUrl, caption, filename)
}

/**
 * Send welcome message
 */
export async function sendWelcomeMessage(
  config: WhatsAppTenantConfig,
  to: string,
  studioName: string = 'PILAR SYSTEMS'
): Promise<MessageSendResult> {
  const text = `Willkommen bei ${studioName}! 👋\n\nIch bin dein KI-Assistent und helfe dir gerne weiter.\n\nWie kann ich dir heute helfen?`
  return sendTextMessage(config, to, text)
}

/**
 * Send error message
 */
export async function sendErrorMessage(
  config: WhatsAppTenantConfig,
  to: string
): Promise<MessageSendResult> {
  const text = 'Entschuldigung, ich hatte Schwierigkeiten deine Nachricht zu verarbeiten. Bitte versuche es erneut oder kontaktiere uns direkt.'
  return sendTextMessage(config, to, text)
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  config: WhatsAppTenantConfig,
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  const client = getWhatsAppAPIClient()
  return client.markAsRead(config, messageId)
}
