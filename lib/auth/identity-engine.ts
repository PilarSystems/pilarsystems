/**
 * Identity Engine
 * 
 * Multi-tenant identity layer with API keys, OAuth, and service tokens
 * Provides secure access control for all AI modules
 */

import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { Redis } from '@upstash/redis'

const prisma = new PrismaClient()

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

export type TokenType = 'api_key' | 'service_token' | 'oauth_token' | 'session_token'
export type TokenScope = 'read' | 'write' | 'admin' | 'operator' | 'webhook'

export interface ApiToken {
  id: string
  workspaceId: string
  type: TokenType
  token: string
  name: string
  scopes: TokenScope[]
  expiresAt?: Date
  lastUsedAt?: Date
  createdAt: Date
  metadata?: Record<string, any>
}

export interface TokenValidationResult {
  valid: boolean
  workspaceId?: string
  scopes?: TokenScope[]
  reason?: string
  rateLimit?: {
    remaining: number
    resetAt: Date
  }
}

export class IdentityEngine {
  /**
   * Generate new API key
   */
  async generateApiKey(
    workspaceId: string,
    name: string,
    scopes: TokenScope[],
    expiresInDays?: number
  ): Promise<{ token: string; apiKey: ApiToken }> {
    const token = `pk_${this.generateSecureToken(32)}`
    const hashedToken = this.hashToken(token)

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined

    const apiKey = await prisma.apiToken.create({
      data: {
        workspaceId,
        type: 'api_key',
        token: hashedToken,
        name,
        scopes: scopes.join(','),
        expiresAt
      }
    })

    return {
      token,
      apiKey: this.formatApiToken(apiKey)
    }
  }

  /**
   * Generate service token (for internal services)
   */
  async generateServiceToken(
    workspaceId: string,
    serviceName: string,
    scopes: TokenScope[]
  ): Promise<{ token: string; serviceToken: ApiToken }> {
    const token = `sk_${this.generateSecureToken(32)}`
    const hashedToken = this.hashToken(token)

    const serviceToken = await prisma.apiToken.create({
      data: {
        workspaceId,
        type: 'service_token',
        token: hashedToken,
        name: serviceName,
        scopes: scopes.join(',')
      }
    })

    return {
      token,
      serviceToken: this.formatApiToken(serviceToken)
    }
  }

  /**
   * Validate token and check permissions
   */
  async validateToken(
    token: string,
    requiredScope?: TokenScope
  ): Promise<TokenValidationResult> {
    const hashedToken = this.hashToken(token)

    if (redis) {
      const cached = await this.getCachedValidation(hashedToken)
      if (cached) {
        if (requiredScope && !cached.scopes?.includes(requiredScope)) {
          return {
            valid: false,
            reason: `Missing required scope: ${requiredScope}`
          }
        }
        return cached
      }
    }

    const apiToken = await prisma.apiToken.findUnique({
      where: { token: hashedToken }
    })

    if (!apiToken) {
      return { valid: false, reason: 'Invalid token' }
    }

    if (apiToken.expiresAt && apiToken.expiresAt < new Date()) {
      return { valid: false, reason: 'Token expired' }
    }

    const scopes = apiToken.scopes.split(',') as TokenScope[]

    if (requiredScope && !scopes.includes(requiredScope)) {
      return {
        valid: false,
        reason: `Missing required scope: ${requiredScope}`
      }
    }

    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() }
    })

    const result: TokenValidationResult = {
      valid: true,
      workspaceId: apiToken.workspaceId,
      scopes
    }

    if (redis) {
      await this.cacheValidation(hashedToken, result)
    }

    return result
  }

  /**
   * Revoke token
   */
  async revokeToken(tokenId: string, workspaceId: string): Promise<void> {
    const apiToken = await prisma.apiToken.findFirst({
      where: { id: tokenId, workspaceId }
    })

    if (!apiToken) {
      throw new Error('Token not found')
    }

    await prisma.apiToken.delete({
      where: { id: tokenId }
    })

    if (redis) {
      await redis.del(`token:${apiToken.token}`)
    }
  }

  /**
   * List tokens for workspace
   */
  async listTokens(workspaceId: string, type?: TokenType): Promise<ApiToken[]> {
    const tokens = await prisma.apiToken.findMany({
      where: {
        workspaceId,
        ...(type && { type })
      },
      orderBy: { createdAt: 'desc' }
    })

    return tokens.map(t => this.formatApiToken(t))
  }

  /**
   * Rotate token (generate new, revoke old)
   */
  async rotateToken(
    tokenId: string,
    workspaceId: string
  ): Promise<{ token: string; apiKey: ApiToken }> {
    const oldToken = await prisma.apiToken.findFirst({
      where: { id: tokenId, workspaceId }
    })

    if (!oldToken) {
      throw new Error('Token not found')
    }

    const scopes = oldToken.scopes.split(',') as TokenScope[]
    const expiresInDays = oldToken.expiresAt
      ? Math.ceil((oldToken.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      : undefined

    let result: { token: string; apiKey: ApiToken }
    if (oldToken.type === 'service_token') {
      const serviceResult = await this.generateServiceToken(workspaceId, oldToken.name, scopes)
      result = { token: serviceResult.token, apiKey: serviceResult.serviceToken }
    } else {
      result = await this.generateApiKey(workspaceId, oldToken.name, scopes, expiresInDays)
    }

    await this.revokeToken(tokenId, workspaceId)

    return result
  }

  /**
   * Check rate limit for token
   */
  async checkRateLimit(
    workspaceId: string,
    limit: number = 100,
    windowSeconds: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    if (!redis) {
      return {
        allowed: true,
        remaining: limit,
        resetAt: new Date(Date.now() + windowSeconds * 1000)
      }
    }

    const key = `ratelimit:${workspaceId}:${Math.floor(Date.now() / (windowSeconds * 1000))}`
    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }

    const allowed = current <= limit
    const remaining = Math.max(0, limit - current)
    const resetAt = new Date(Math.ceil(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000)

    return { allowed, remaining, resetAt }
  }

  /**
   * Generate secure random token
   */
  private generateSecureToken(length: number): string {
    return crypto.randomBytes(length).toString('base64url')
  }

  /**
   * Hash token for storage
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Format API token for response
   */
  private formatApiToken(token: any): ApiToken {
    return {
      id: token.id,
      workspaceId: token.workspaceId,
      type: token.type,
      token: '***', // Never expose raw token
      name: token.name,
      scopes: token.scopes.split(',') as TokenScope[],
      expiresAt: token.expiresAt,
      lastUsedAt: token.lastUsedAt,
      createdAt: token.createdAt,
      metadata: token.metadata
    }
  }

  /**
   * Cache validation result
   */
  private async cacheValidation(
    hashedToken: string,
    result: TokenValidationResult
  ): Promise<void> {
    if (!redis) return

    await redis.setex(
      `token:${hashedToken}`,
      300, // 5 minutes
      JSON.stringify(result)
    )
  }

  /**
   * Get cached validation result
   */
  private async getCachedValidation(
    hashedToken: string
  ): Promise<TokenValidationResult | null> {
    if (!redis) return null

    const cached = await redis.get(`token:${hashedToken}`)
    if (!cached) return null

    return JSON.parse(cached as string)
  }
}

export const identityEngine = new IdentityEngine()
