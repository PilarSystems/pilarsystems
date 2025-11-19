/**
 * Affiliate system utilities
 * GDPR-compliant tracking and commission calculation
 */

import crypto from 'crypto'
import { getConfig } from './config/env'
import { logger } from './logger'

/**
 * Generate a unique affiliate code
 */
export function generateAffiliateCode(name: string): string {
  const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const random = crypto.randomBytes(4).toString('hex')
  return `${sanitized.substring(0, 8)}-${random}`
}

/**
 * Hash IP address for GDPR-compliant tracking
 * Uses HMAC with ENCRYPTION_KEY to create a consistent hash
 */
export function hashIP(ip: string, userAgent: string = ''): string {
  const config = getConfig()
  
  if (!config.encryptionKey) {
    logger.warn('ENCRYPTION_KEY not set - using fallback hash')
    return crypto.createHash('sha256').update(ip + userAgent).digest('hex')
  }

  const date = new Date().toISOString().split('T')[0]
  const data = `${ip}|${userAgent}|${date}`
  
  return crypto
    .createHmac('sha256', config.encryptionKey)
    .update(data)
    .digest('hex')
}

/**
 * Calculate commission for a conversion
 */
export function calculateCommission(
  setupFeeAmount: number,
  recurringAmount: number,
  commissionSetupPercent: number,
  commissionRecurringPercent: number
): {
  commissionSetup: number
  commissionRecurring: number
  totalCommission: number
} {
  const commissionSetup = (setupFeeAmount * commissionSetupPercent) / 100
  const commissionRecurring = (recurringAmount * commissionRecurringPercent) / 100
  const totalCommission = commissionSetup + commissionRecurring

  return {
    commissionSetup: Math.round(commissionSetup * 100) / 100,
    commissionRecurring: Math.round(commissionRecurring * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
  }
}

/**
 * Validate affiliate code format
 */
export function isValidAffiliateCode(code: string): boolean {
  return /^[a-z0-9]{3,12}-[a-z0-9]{4,8}$/.test(code)
}

/**
 * Get affiliate ref from cookie or URL
 */
export function getAffiliateRef(
  cookies: Record<string, string>,
  urlRef?: string
): string | null {
  if (urlRef && isValidAffiliateCode(urlRef)) {
    return urlRef
  }

  const cookieRef = cookies['pilar_ref']
  if (cookieRef && isValidAffiliateCode(cookieRef)) {
    return cookieRef
  }

  return null
}

/**
 * Set affiliate ref cookie (client-side helper)
 */
export function setAffiliateRefCookie(code: string, days: number = 30): void {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `pilar_ref=${code}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

/**
 * Get affiliate ref from cookie (client-side helper)
 */
export function getAffiliateRefFromCookie(): string | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(/pilar_ref=([^;]+)/)
  return match ? match[1] : null
}
