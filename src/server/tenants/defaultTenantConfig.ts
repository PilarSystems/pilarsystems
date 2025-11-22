/**
 * Default Tenant Configuration
 * 
 * Default values for new tenant setup
 */

export interface DefaultTenantConfig {
  language: string
  timezone: string
  currency: string

  voice: {
    model: string
    voice: string
    temperature: number
    maxDuration: number
    silenceTimeout: number
    interruptible: boolean
  }

  whatsapp: {
    autoReply: boolean
    responseDelay: number
    maxMessageLength: number
  }

  personality: {
    tone: string
    style: string
    formality: string
  }

  studioRules: string[]

  openingMessages: {
    voice: string
    whatsapp: string
    email: string
  }

  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }

  features: {
    voiceAgent: boolean
    whatsappAgent: boolean
    emailAgent: boolean
    trainingPlans: boolean
    leadClassification: boolean
    autoFollowup: boolean
  }
}

/**
 * Default configuration for new tenants
 */
export const DEFAULT_TENANT_CONFIG: DefaultTenantConfig = {
  language: 'de',
  timezone: 'Europe/Berlin',
  currency: 'EUR',

  voice: {
    model: 'tts-1',
    voice: 'alloy',
    temperature: 0.7,
    maxDuration: 300, // 5 minutes
    silenceTimeout: 10, // 10 seconds
    interruptible: true,
  },

  whatsapp: {
    autoReply: true,
    responseDelay: 2000, // 2 seconds
    maxMessageLength: 4096,
  },

  personality: {
    tone: 'friendly',
    style: 'professional',
    formality: 'informal', // Du-Form in German
  },

  studioRules: [
    'Sei immer freundlich und hilfsbereit',
    'Antworte auf Deutsch',
    'Verwende die Du-Form',
    'Sei motivierend und positiv',
    'Gib konkrete Informationen',
    'Frage nach, wenn etwas unklar ist',
    'Biete Probetraining an',
    'Erwähne unsere Öffnungszeiten bei Bedarf',
  ],

  openingMessages: {
    voice: 'Willkommen bei PILAR SYSTEMS. Wie kann ich Ihnen heute helfen?',
    whatsapp: 'Hey! 👋 Willkommen bei unserem Fitnessstudio. Wie kann ich dir helfen?',
    email: 'Vielen Dank für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.',
  },

  businessHours: {
    monday: { open: '06:00', close: '22:00', closed: false },
    tuesday: { open: '06:00', close: '22:00', closed: false },
    wednesday: { open: '06:00', close: '22:00', closed: false },
    thursday: { open: '06:00', close: '22:00', closed: false },
    friday: { open: '06:00', close: '22:00', closed: false },
    saturday: { open: '08:00', close: '20:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: false },
  },

  features: {
    voiceAgent: true,
    whatsappAgent: true,
    emailAgent: true,
    trainingPlans: true,
    leadClassification: true,
    autoFollowup: true,
  },
}

/**
 * Get default config with custom overrides
 */
export function getDefaultConfig(overrides?: Partial<DefaultTenantConfig>): DefaultTenantConfig {
  return {
    ...DEFAULT_TENANT_CONFIG,
    ...overrides,
  }
}
