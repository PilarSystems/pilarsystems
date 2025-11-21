/**
 * Analytics Cache Adapter with Graceful Degradation
 */

interface RedisLike {
  get(key: string): Promise<any>
  setex(key: string, seconds: number, value: string): Promise<any>
  del(...keys: string[]): Promise<number>
}

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

let redisInstance: RedisLike | null = null

async function getRedis(): Promise<RedisLike | null> {
  if (redisInstance !== null) {
    return redisInstance
  }

  const url = process.env.RATE_LIMIT_REDIS_URL
  const token = process.env.RATE_LIMIT_REDIS_TOKEN

  if (!url || !token) {
    redisInstance = null
    return null
  }

  try {
    const { Redis } = await import('@upstash/redis')
    redisInstance = new Redis({ url, token }) as RedisLike
    return redisInstance
  } catch (error) {
    console.error('Failed to initialize Redis for analytics cache:', error)
    redisInstance = null
    return null
  }
}

export async function getCachedAnalytics(workspaceId: string): Promise<AnalyticsCache | null> {
  const redis = await getRedis()
  if (!redis) return null

  try {
    const key = `analytics:${workspaceId}:dashboard`
    const cached = await redis.get(key)
    
    if (!cached) return null

    const data = typeof cached === 'string' ? JSON.parse(cached) : cached
    return data as AnalyticsCache
  } catch (error) {
    console.error('Failed to get cached analytics:', error)
    return null
  }
}

export async function setCachedAnalytics(
  workspaceId: string,
  data: Omit<AnalyticsCache, 'cachedAt'>,
  ttlSeconds: number = 300
): Promise<void> {
  const redis = await getRedis()
  if (!redis) return

  try {
    const key = `analytics:${workspaceId}:dashboard`
    const cacheData: AnalyticsCache = {
      ...data,
      cachedAt: new Date().toISOString()
    }
    
    await redis.setex(key, ttlSeconds, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Failed to cache analytics:', error)
  }
}

export async function invalidateAnalyticsCache(workspaceId: string): Promise<void> {
  const redis = await getRedis()
  if (!redis) return

  try {
    const key = `analytics:${workspaceId}:dashboard`
    await redis.del(key)
  } catch (error) {
    console.error('Failed to invalidate analytics cache:', error)
  }
}
