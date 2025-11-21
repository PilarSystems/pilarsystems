/**
 * Central configuration and feature flags
 * All environment variable access should go through this module
 */

import { logger } from '@/lib/logger'

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
  
  affiliatesEnabled: boolean
  affiliateAutoApprove: boolean
  affiliateCommissionSetup: number // percentage
  affiliateCommissionRecurring: number // percentage
  
  contactEmailEnabled: boolean
  smtpHost: string | null
  smtpPort: number | null
  smtpUser: string | null
  smtpPass: string | null
  smtpFrom: string | null
  contactTo: string | null
  
  analyticsEnabled: boolean
  plausibleDomain: string | null
  
  adminEmails: string[]
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
  
  logger.warn('NEXT_PUBLIC_APP_URL not set in production - using placeholder')
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
  
  const affiliatesEnabled = getEnv('AFFILIATES_ENABLED') === 'true'
  const affiliateAutoApprove = getEnv('AFFILIATE_AUTO_APPROVE') !== 'false' // default true
  const affiliateCommissionSetup = parseInt(getEnv('AFFILIATE_COMMISSION_SETUP') || '10', 10)
  const affiliateCommissionRecurring = parseInt(getEnv('AFFILIATE_COMMISSION_RECURRING') || '10', 10)
  
  const smtpHost = getEnv('SMTP_HOST')
  const smtpPort = getEnv('SMTP_PORT') ? parseInt(getEnv('SMTP_PORT')!, 10) : null
  const smtpUser = getEnv('SMTP_USER')
  const smtpPass = getEnv('SMTP_PASS')
  const smtpFrom = getEnv('SMTP_FROM') || 'PILAR SYSTEMS <no-reply@pilarsystems.com>'
  const contactTo = getEnv('CONTACT_TO')
  const contactEmailEnabled = !!smtpHost && !!smtpPort && !!smtpUser && !!smtpPass && !!contactTo
  
  const analyticsEnabled = getEnv('ANALYTICS_ENABLED') === 'true'
  const plausibleDomain = getEnv('PLAUSIBLE_DOMAIN')
  
  const adminEmailsStr = getEnv('ADMIN_EMAILS') || ''
  const adminEmails = adminEmailsStr.split(',').map(e => e.trim()).filter(Boolean)
  
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
    affiliatesEnabled,
    affiliateAutoApprove,
    affiliateCommissionSetup,
    affiliateCommissionRecurring,
    contactEmailEnabled,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    contactTo,
    analyticsEnabled,
    plausibleDomain,
    adminEmails,
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
    affiliatesEnabled: config.affiliatesEnabled,
    analyticsEnabled: config.analyticsEnabled,
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
