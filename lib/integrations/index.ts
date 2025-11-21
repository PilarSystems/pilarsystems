/**
 * Integration Adapters with Graceful Degradation
 * 
 * All optional integrations (Twilio, WhatsApp, ElevenLabs, n8n, Google)
 * should be accessed through these adapters to ensure graceful degradation
 * when environment variables are not configured.
 */

import { env } from '@/lib/config/env'

export interface IntegrationStatus {
  available: boolean
  reason?: string
}

/**
 * Check if Twilio integration is available
 */
export function isTwilioAvailable(): IntegrationStatus {
  const hasCredentials = !!(
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    env.TWILIO_PHONE_NUMBER
  )
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'Twilio-Zugangsdaten nicht konfiguriert'
  }
}

/**
 * Check if WhatsApp integration is available
 */
export function isWhatsAppAvailable(): IntegrationStatus {
  const hasCredentials = !!(
    env.WHATSAPP_PHONE_NUMBER_ID &&
    env.WHATSAPP_ACCESS_TOKEN
  )
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'WhatsApp-Integration nicht konfiguriert'
  }
}

/**
 * Check if ElevenLabs integration is available
 */
export function isElevenLabsAvailable(): IntegrationStatus {
  const hasCredentials = !!env.ELEVENLABS_API_KEY
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'ElevenLabs API-Key nicht konfiguriert'
  }
}

/**
 * Check if n8n integration is available
 */
export function isN8nAvailable(): IntegrationStatus {
  const hasCredentials = !!(
    env.N8N_WEBHOOK_URL &&
    env.N8N_API_KEY
  )
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'n8n-Integration nicht konfiguriert'
  }
}

/**
 * Check if Google Calendar integration is available
 */
export function isGoogleCalendarAvailable(): IntegrationStatus {
  const hasCredentials = !!(
    env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET
  )
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'Google Calendar nicht konfiguriert'
  }
}

/**
 * Check if email/SMTP integration is available
 */
export function isEmailAvailable(): IntegrationStatus {
  const hasCredentials = !!(
    env.SMTP_HOST &&
    env.SMTP_USER &&
    env.SMTP_PASS
  )
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'E-Mail/SMTP nicht konfiguriert'
  }
}

/**
 * Get all integration statuses
 */
export function getAllIntegrationStatuses() {
  return {
    twilio: isTwilioAvailable(),
    whatsapp: isWhatsAppAvailable(),
    elevenlabs: isElevenLabsAvailable(),
    n8n: isN8nAvailable(),
    googleCalendar: isGoogleCalendarAvailable(),
    email: isEmailAvailable(),
  }
}
