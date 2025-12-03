/**
 * Analytics Cache Utilities
 * 
 * Redis-based caching for analytics data with TTL and invalidation support.
 * Part of Phase E performance optimization.
 */

import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

const redis = process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN
  ? new Redis({
      url: process.env.RATE_LIMIT_REDIS_URL,
      token: process.env.RATE_LIMIT_REDIS_TOKEN,
    })
  : null

// In-memory fallback cache when Redis is not available
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>()

export interface AnalyticsCache {
  totalLeads: number
  newLeadsThisWeek: number
  conversionRate: number
  avgResponseTime: number
  totalCalls: number
  totalMessages: number
  upcomingAppointments: number
  cachedAt: string
}

export interface ChannelAnalyticsCache {
  whatsapp: { sent: number; delivered: number; failed: number; responseRate: number }
  sms: { sent: number; delivered: number; failed: number; responseRate: number }
  email: { sent: number; delivered: number; failed: number; responseRate: number }
  cachedAt: string
}

export interface PerformanceCache {
  averageLatencyMs: number
  p95LatencyMs: number
  totalRequests: number
  errorRate: number
  cachedAt: string
}

/**
 * Generic cache getter with fallback to memory cache
 */
async function getFromCache<T>(key: string): Promise<T | null> {
  // Try Redis first
  if (redis) {
    try {
      const cached = await redis.get(key)
      if (cached) {
        return typeof cached === 'string' ? JSON.parse(cached) : cached as T
      }
    } catch (error) {
      logger.warn({ error, key }, 'Redis cache read failed, falling back to memory')
    }
  }

  // Fallback to memory cache
  const memoryCached = memoryCache.get(key)
  if (memoryCached && memoryCached.expiresAt > Date.now()) {
    return memoryCached.data as T
  }

  // Clean up expired memory cache entry
  if (memoryCached) {
    memoryCache.delete(key)
  }

  return null
}

/**
 * Generic cache setter with fallback to memory cache
 */
async function setInCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const serializedData = JSON.stringify(data)

  // Try Redis first
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, serializedData)
      return
    } catch (error) {
      logger.warn({ error, key }, 'Redis cache write failed, falling back to memory')
    }
  }

  // Fallback to memory cache
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })

  // Limit memory cache size (simple LRU would be better but this works for now)
  if (memoryCache.size > 1000) {
    const firstKey = memoryCache.keys().next().value
    if (firstKey) {
      memoryCache.delete(firstKey)
    }
  }
}

/**
 * Delete from cache
 */
async function deleteFromCache(key: string): Promise<void> {
  // Remove from memory cache
  memoryCache.delete(key)

  // Remove from Redis
  if (redis) {
    try {
      await redis.del(key)
    } catch (error) {
      logger.warn({ error, key }, 'Redis cache delete failed')
    }
  }
}

// =============================================================================
// Dashboard Analytics Cache
// =============================================================================

export async function getCachedAnalytics(workspaceId: string): Promise<AnalyticsCache | null> {
  const key = `analytics:${workspaceId}:dashboard`
  return getFromCache<AnalyticsCache>(key)
}

export async function setCachedAnalytics(
  workspaceId: string,
  data: Omit<AnalyticsCache, 'cachedAt'>,
  ttlSeconds: number = 300
): Promise<void> {
  const key = `analytics:${workspaceId}:dashboard`
  const cacheData: AnalyticsCache = {
    ...data,
    cachedAt: new Date().toISOString()
  }
  await setInCache(key, cacheData, ttlSeconds)
}

export async function invalidateAnalyticsCache(workspaceId: string): Promise<void> {
  const key = `analytics:${workspaceId}:dashboard`
  await deleteFromCache(key)
}

// =============================================================================
// Channel Analytics Cache
// =============================================================================

export async function getCachedChannelAnalytics(workspaceId: string): Promise<ChannelAnalyticsCache | null> {
  const key = `analytics:${workspaceId}:channels`
  return getFromCache<ChannelAnalyticsCache>(key)
}

export async function setCachedChannelAnalytics(
  workspaceId: string,
  data: Omit<ChannelAnalyticsCache, 'cachedAt'>,
  ttlSeconds: number = 300
): Promise<void> {
  const key = `analytics:${workspaceId}:channels`
  const cacheData: ChannelAnalyticsCache = {
    ...data,
    cachedAt: new Date().toISOString()
  }
  await setInCache(key, cacheData, ttlSeconds)
}

// =============================================================================
// Performance Cache
// =============================================================================

export async function getCachedPerformance(): Promise<PerformanceCache | null> {
  const key = 'analytics:global:performance'
  return getFromCache<PerformanceCache>(key)
}

export async function setCachedPerformance(
  data: Omit<PerformanceCache, 'cachedAt'>,
  ttlSeconds: number = 60
): Promise<void> {
  const key = 'analytics:global:performance'
  const cacheData: PerformanceCache = {
    ...data,
    cachedAt: new Date().toISOString()
  }
  await setInCache(key, cacheData, ttlSeconds)
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Invalidate all caches for a workspace
 */
export async function invalidateWorkspaceCaches(workspaceId: string): Promise<void> {
  await Promise.all([
    deleteFromCache(`analytics:${workspaceId}:dashboard`),
    deleteFromCache(`analytics:${workspaceId}:channels`),
  ])
}

/**
 * Get cache status for monitoring
 */
export function getCacheStatus(): { redis: boolean; memorySize: number } {
  return {
    redis: redis !== null,
    memorySize: memoryCache.size,
  }
}

/**
 * Clear memory cache (for testing)
 */
export function clearMemoryCache(): void {
  memoryCache.clear()
}
