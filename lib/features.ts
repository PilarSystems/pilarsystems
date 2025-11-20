/**
 * Feature Flag System for PILAR SYSTEMS
 * 
 * Provides graceful degradation when external integrations are not configured.
 * When a feature is disabled or ENV vars are missing:
 * - UI shows "Deaktiviert – konfigurieren unter Einstellungen"
 * - API endpoints return 200 with informative response (no-op)
 * - No crashes or errors exposed to client
 * - Intent is recorded but external calls are skipped
 */

export interface FeatureFlags {
  openai: boolean
  elevenlabs: boolean
  
  twilio: boolean
  whatsapp: boolean
  
  google_calendar: boolean
  google_email: boolean
  
  n8n: boolean
  
  stripe: boolean
  
  database: boolean
}

/**
 * Check if a feature is enabled based on ENV variables
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    openai: !!(
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
    ),
    elevenlabs: !!(
      process.env.ELEVENLABS_API_KEY &&
      process.env.ELEVENLABS_API_KEY !== 'your-elevenlabs-api-key-here'
    ),
    
    twilio: !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid-here'
    ),
    whatsapp: !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_NUMBER &&
      process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid-here'
    ),
    
    google_calendar: !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here'
    ),
    google_email: !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here'
    ),
    
    n8n: !!(
      process.env.N8N_WEBHOOK_URL &&
      process.env.N8N_WEBHOOK_URL !== 'your-n8n-webhook-url-here'
    ),
    
    stripe: !!(
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_SECRET_KEY !== 'your-stripe-secret-key-here'
    ),
    
    database: !!(
      process.env.DATABASE_URL &&
      process.env.DATABASE_URL !== 'postgresql://user:pass@localhost:5432/db'
    ),
  }
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags()
  return flags[feature]
}

/**
 * Get user-friendly status message for a feature
 */
export function getFeatureStatus(feature: keyof FeatureFlags): {
  enabled: boolean
  message: string
  action?: string
} {
  const enabled = isFeatureEnabled(feature)
  
  if (enabled) {
    return {
      enabled: true,
      message: 'Aktiv',
    }
  }
  
  const messages: Record<keyof FeatureFlags, { message: string; action: string }> = {
    openai: {
      message: 'OpenAI nicht konfiguriert',
      action: 'Bitte OPENAI_API_KEY in den Einstellungen setzen',
    },
    elevenlabs: {
      message: 'ElevenLabs nicht konfiguriert',
      action: 'Bitte ELEVENLABS_API_KEY in den Einstellungen setzen',
    },
    twilio: {
      message: 'Twilio nicht konfiguriert',
      action: 'Bitte Twilio Credentials in den Einstellungen setzen',
    },
    whatsapp: {
      message: 'WhatsApp nicht konfiguriert',
      action: 'Bitte WhatsApp Business API in den Einstellungen aktivieren',
    },
    google_calendar: {
      message: 'Google Calendar nicht verbunden',
      action: 'Bitte Google Calendar in den Einstellungen verbinden',
    },
    google_email: {
      message: 'Google Email nicht verbunden',
      action: 'Bitte Google Email in den Einstellungen verbinden',
    },
    n8n: {
      message: 'n8n nicht konfiguriert',
      action: 'Bitte n8n Webhook URL in den Einstellungen setzen',
    },
    stripe: {
      message: 'Stripe nicht konfiguriert',
      action: 'Bitte Stripe Credentials in den Einstellungen setzen',
    },
    database: {
      message: 'Datenbank nicht verbunden',
      action: 'Bitte DATABASE_URL konfigurieren',
    },
  }
  
  return {
    enabled: false,
    ...messages[feature],
  }
}

/**
 * API Response helper for disabled features
 */
export function disabledFeatureResponse(feature: keyof FeatureFlags) {
  const status = getFeatureStatus(feature)
  
  return {
    success: false,
    disabled: true,
    message: status.message,
    action: status.action,
  }
}

/**
 * Check multiple features at once
 */
export function checkFeatures(features: (keyof FeatureFlags)[]): {
  allEnabled: boolean
  disabled: string[]
  messages: string[]
} {
  const disabled: string[] = []
  const messages: string[] = []
  
  for (const feature of features) {
    if (!isFeatureEnabled(feature)) {
      disabled.push(feature)
      const status = getFeatureStatus(feature)
      messages.push(status.message)
    }
  }
  
  return {
    allEnabled: disabled.length === 0,
    disabled,
    messages,
  }
}
