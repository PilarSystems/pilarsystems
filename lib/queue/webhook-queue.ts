import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN
  ? new Redis({
      url: process.env.RATE_LIMIT_REDIS_URL,
      token: process.env.RATE_LIMIT_REDIS_TOKEN,
    })
  : null

export async function enqueueWebhook(
  workspaceId: string,
  source: string,
  payload: any
): Promise<void> {
  if (!redis) {
    console.warn('Redis not configured, processing webhook synchronously')
    return
  }

  const queueKey = `webhook:queue:${workspaceId}:${source}`
  const job = {
    id: `${source}:${Date.now()}:${Math.random()}`,
    workspaceId,
    source,
    payload,
    enqueuedAt: new Date().toISOString()
  }

  await redis.lpush(queueKey, JSON.stringify(job))
}

export async function dequeueWebhook(
  workspaceId: string,
  source: string
): Promise<any | null> {
  if (!redis) {
    return null
  }

  const queueKey = `webhook:queue:${workspaceId}:${source}`
  const job = await redis.rpop(queueKey)

  if (!job) {
    return null
  }

  return typeof job === 'string' ? JSON.parse(job) : job
}

export async function getQueueLength(
  workspaceId: string,
  source: string
): Promise<number> {
  if (!redis) {
    return 0
  }

  const queueKey = `webhook:queue:${workspaceId}:${source}`
  return await redis.llen(queueKey) || 0
}

const rateLimiters = new Map<string, Ratelimit>()

export function getRateLimiter(workspaceId: string, resource: string): Ratelimit | null {
  if (!redis) {
    return null
  }

  const key = `${workspaceId}:${resource}`
  
  if (!rateLimiters.has(key)) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: `ratelimit:${resource}`
    })
    rateLimiters.set(key, limiter)
  }

  return rateLimiters.get(key)!
}

export async function checkRateLimit(
  workspaceId: string,
  resource: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = getRateLimiter(workspaceId, resource)
  
  if (!limiter) {
    return { success: true, limit: 0, remaining: 0, reset: 0 }
  }

  const result = await limiter.limit(workspaceId)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset
  }
}
