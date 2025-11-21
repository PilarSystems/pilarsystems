import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

const redis = process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN
  ? new Redis({
      url: process.env.RATE_LIMIT_REDIS_URL,
      token: process.env.RATE_LIMIT_REDIS_TOKEN,
    })
  : null

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

export async function getCachedAnalytics(workspaceId: string): Promise<AnalyticsCache | null> {
  if (!redis) {
    return null
  }

  try {
    const key = `analytics:${workspaceId}:dashboard`
    const cached = await redis.get(key)
    
    if (!cached) {
      return null
    }

    const data = typeof cached === 'string' ? JSON.parse(cached) : cached
    return data as AnalyticsCache
  } catch (error) {
    logger.error({ error }, 'Failed to get cached analytics')
    return null
  }
}

export async function setCachedAnalytics(
  workspaceId: string,
  data: Omit<AnalyticsCache, 'cachedAt'>,
  ttlSeconds: number = 300
): Promise<void> {
  if (!redis) {
    return
  }

  try {
    const key = `analytics:${workspaceId}:dashboard`
    const cacheData: AnalyticsCache = {
      ...data,
      cachedAt: new Date().toISOString()
    }
    
    await redis.setex(key, ttlSeconds, JSON.stringify(cacheData))
  } catch (error) {
    logger.error({ error }, 'Failed to cache analytics')
  }
}

export async function invalidateAnalyticsCache(workspaceId: string): Promise<void> {
  if (!redis) {
    return
  }

  try {
    const key = `analytics:${workspaceId}:dashboard`
    await redis.del(key)
  } catch (error) {
    logger.error({ error }, 'Failed to invalidate analytics cache')
  }
}
