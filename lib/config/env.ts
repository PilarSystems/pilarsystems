/**
 * Central configuration and feature flags
 * All environment variable access should go through this module
 */

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test'
  appUrl: string
  
  databaseUrl: string | null
  
  nextAuthSecret: string | null
  supabaseUrl: string | null
  supabaseAnonKey: string | null
  supabaseServiceKey: string | null
  
  encryptionKey: string | null
  encryptionReady: boolean
  
  stripeSecretKey: string | null
  stripeWebhookSecret: string | null
  stripeEnabled: boolean
  
  twilioAccountSid: string | null
  twilioAuthToken: string | null
  twilioEnabled: boolean
  
  openaiApiKey: string | null
  openaiEnabled: boolean
  
  elevenlabsApiKey: string | null
  elevenlabsEnabled: boolean
  
  whatsappEnabled: boolean
  
  emailEnabled: boolean
  
  googleClientId: string | null
  googleClientSecret: string | null
  googleEnabled: boolean
  
  n8nWebhookUrl: string | null
  n8nEnabled: boolean
  
  upstashRedisUrl: string | null
  upstashRedisToken: string | null
  rateLimitingEnabled: boolean
}

function getEnv(key: string): string | null {
  return process.env[key] || null
}

function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  console.warn('NEXT_PUBLIC_APP_URL not set in production - using placeholder')
  return 'https://app.pilarsystems.com'
}

/**
 * Get application configuration
 * This function is safe to call even if environment variables are missing
 */
export function getConfig(): AppConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as AppConfig['nodeEnv']
  
  const appUrl = getAppUrl()
  
  const databaseUrl = getEnv('DATABASE_URL')
  
  const nextAuthSecret = getEnv('NEXTAUTH_SECRET')
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  
  const encryptionKey = getEnv('ENCRYPTION_KEY')
  const encryptionReady = !!encryptionKey && encryptionKey.length === 64
  
  const stripeSecretKey = getEnv('STRIPE_SECRET_KEY')
  const stripeWebhookSecret = getEnv('STRIPE_WEBHOOK_SECRET')
  const stripeEnabled = !!stripeSecretKey && !!stripeWebhookSecret
  
  const twilioAccountSid = getEnv('TWILIO_ACCOUNT_SID')
  const twilioAuthToken = getEnv('TWILIO_AUTH_TOKEN')
  const twilioEnabled = !!twilioAccountSid && !!twilioAuthToken
  
  const openaiApiKey = getEnv('OPENAI_API_KEY')
  const openaiEnabled = !!openaiApiKey
  
  const elevenlabsApiKey = getEnv('ELEVENLABS_API_KEY')
  const elevenlabsEnabled = !!elevenlabsApiKey
  
  const whatsappEnabled = true // Always available, configured per tenant
  
  const emailEnabled = true // Always available, configured per tenant
  
  const googleClientId = getEnv('GOOGLE_CLIENT_ID')
  const googleClientSecret = getEnv('GOOGLE_CLIENT_SECRET')
  const googleEnabled = !!googleClientId && !!googleClientSecret
  
  const n8nWebhookUrl = getEnv('N8N_WEBHOOK_URL')
  const n8nEnabled = !!n8nWebhookUrl
  
  const upstashRedisUrl = getEnv('UPSTASH_REDIS_REST_URL')
  const upstashRedisToken = getEnv('UPSTASH_REDIS_REST_TOKEN')
  const rateLimitingEnabled = !!upstashRedisUrl && !!upstashRedisToken
  
  return {
    nodeEnv,
    appUrl,
    databaseUrl,
    nextAuthSecret,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    encryptionKey,
    encryptionReady,
    stripeSecretKey,
    stripeWebhookSecret,
    stripeEnabled,
    twilioAccountSid,
    twilioAuthToken,
    twilioEnabled,
    openaiApiKey,
    openaiEnabled,
    elevenlabsApiKey,
    elevenlabsEnabled,
    whatsappEnabled,
    emailEnabled,
    googleClientId,
    googleClientSecret,
    googleEnabled,
    n8nWebhookUrl,
    n8nEnabled,
    upstashRedisUrl,
    upstashRedisToken,
    rateLimitingEnabled,
  }
}

/**
 * Get public feature flags (safe to expose to client)
 */
export function getPublicFeatureFlags() {
  const config = getConfig()
  
  return {
    twilioAutoProvisioningEnabled: config.twilioEnabled,
    stripeEnabled: config.stripeEnabled,
    openaiEnabled: config.openaiEnabled,
    elevenlabsEnabled: config.elevenlabsEnabled,
    whatsappEnabled: config.whatsappEnabled,
    emailEnabled: config.emailEnabled,
    googleCalendarEnabled: config.googleEnabled,
    n8nEnabled: config.n8nEnabled,
    encryptionReady: config.encryptionReady,
  }
}

let configInstance: AppConfig | null = null

/**
 * Get cached config instance
 */
export function getCachedConfig(): AppConfig {
  if (!configInstance) {
    configInstance = getConfig()
  }
  return configInstance
}
