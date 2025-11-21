/**
 * Integration Adapters with Graceful Degradation
 * 
 * All optional integrations (Twilio, WhatsApp, ElevenLabs, n8n, Google)
 * should be accessed through these adapters to ensure graceful degradation
 * when environment variables are not configured.
 */

import { getCachedConfig } from '@/lib/config/env'

export interface IntegrationStatus {
  available: boolean
  reason?: string
}

/**
 * Check if Twilio integration is available
 */
export function isTwilioAvailable(): IntegrationStatus {
  const config = getCachedConfig()
  const hasCredentials = !!(
    config.twilioAccountSid &&
    config.twilioAuthToken
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
  const config = getCachedConfig()
  const hasCredentials = config.whatsappEnabled
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'WhatsApp-Integration nicht konfiguriert'
  }
}

/**
 * Check if ElevenLabs integration is available
 */
export function isElevenLabsAvailable(): IntegrationStatus {
  const config = getCachedConfig()
  const hasCredentials = config.elevenlabsEnabled
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'ElevenLabs API-Key nicht konfiguriert'
  }
}

/**
 * Check if n8n integration is available
 */
export function isN8nAvailable(): IntegrationStatus {
  const config = getCachedConfig()
  const hasCredentials = config.n8nEnabled
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'n8n-Integration nicht konfiguriert'
  }
}

/**
 * Check if Google Calendar integration is available
 */
export function isGoogleCalendarAvailable(): IntegrationStatus {
  const config = getCachedConfig()
  const hasCredentials = config.googleEnabled
  
  return {
    available: hasCredentials,
    reason: hasCredentials ? undefined : 'Google Calendar nicht konfiguriert'
  }
}

/**
 * Check if email/SMTP integration is available
 */
export function isEmailAvailable(): IntegrationStatus {
  const config = getCachedConfig()
  const hasCredentials = config.contactEmailEnabled
  
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
