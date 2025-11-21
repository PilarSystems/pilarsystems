/**
 * Upstash Redis Adapter with Graceful Degradation
 * 
 * This adapter provides a typed interface for Redis operations with automatic
 * fallback when Upstash is not configured. Uses dynamic imports to avoid
 * build-time dependency on @upstash packages.
 */

// Internal interfaces to avoid direct type imports
interface RedisLike {
  get(key: string): Promise<any>
  set(key: string, value: any, options?: any): Promise<any>
  setex(key: string, seconds: number, value: string): Promise<any>
  del(...keys: string[]): Promise<number>
  lpush(key: string, ...values: string[]): Promise<number>
  rpop(key: string): Promise<string | null>
  llen(key: string): Promise<number>
}

interface RateLimiterLike {
  limit(identifier: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }>
}

interface QueueAdapter {
  enqueueWebhook(workspaceId: string, source: string, payload: any): Promise<void>
  dequeueWebhook(workspaceId: string, source: string): Promise<any | null>
  getQueueLength(workspaceId: string, source: string): Promise<number>
}

interface RateLimitAdapter {
  checkRateLimit(workspaceId: string, resource: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }>
}

// Singleton instances
let queueInstance: QueueAdapter | null = null
let rateLimitInstance: RateLimitAdapter | null = null

/**
 * Upstash-based Queue Implementation
 */
class UpstashQueueAdapter implements QueueAdapter {
  private redis: RedisLike

  constructor(redis: RedisLike) {
    this.redis = redis
  }

  async enqueueWebhook(workspaceId: string, source: string, payload: any): Promise<void> {
    const queueKey = `webhook:queue:${workspaceId}:${source}`
    const job = {
      id: `${source}:${Date.now()}:${Math.random()}`,
      workspaceId,
      source,
      payload,
      enqueuedAt: new Date().toISOString()
    }
    await this.redis.lpush(queueKey, JSON.stringify(job))
  }

  async dequeueWebhook(workspaceId: string, source: string): Promise<any | null> {
    const queueKey = `webhook:queue:${workspaceId}:${source}`
    const job = await this.redis.rpop(queueKey)
    if (!job) return null
    return typeof job === 'string' ? JSON.parse(job) : job
  }

  async getQueueLength(workspaceId: string, source: string): Promise<number> {
    const queueKey = `webhook:queue:${workspaceId}:${source}`
    return await this.redis.llen(queueKey) || 0
  }
}

/**
 * No-op Queue Implementation (when Redis not configured)
 */
class NoopQueueAdapter implements QueueAdapter {
  async enqueueWebhook(): Promise<void> {
    console.warn('Redis not configured, webhook queue disabled')
  }

  async dequeueWebhook(): Promise<null> {
    return null
  }

  async getQueueLength(): Promise<number> {
    return 0
  }
}

/**
 * Upstash-based Rate Limiter Implementation
 */
class UpstashRateLimitAdapter implements RateLimitAdapter {
  private redis: RedisLike
  private limiters = new Map<string, RateLimiterLike>()

  constructor(redis: RedisLike) {
    this.redis = redis
  }

  private async getRateLimiter(workspaceId: string, resource: string): Promise<RateLimiterLike | null> {
    const key = `${workspaceId}:${resource}`
    
    if (!this.limiters.has(key)) {
      try {
        // Dynamic import of Ratelimit class
        const { Ratelimit } = await import('@upstash/ratelimit')
        
        const limiter = new Ratelimit({
          redis: this.redis as any,
          limiter: Ratelimit.slidingWindow(10, '10 s'),
          analytics: true,
          prefix: `ratelimit:${resource}`
        })
        
        this.limiters.set(key, limiter)
      } catch (error) {
        console.error('Failed to create rate limiter:', error)
        return null
      }
    }

    return this.limiters.get(key) || null
  }

  async checkRateLimit(workspaceId: string, resource: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }> {
    const limiter = await this.getRateLimiter(workspaceId, resource)
    
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
}

/**
 * No-op Rate Limiter Implementation (when Redis not configured)
 */
class NoopRateLimitAdapter implements RateLimitAdapter {
  async checkRateLimit(): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }> {
    return { success: true, limit: 0, remaining: 0, reset: 0 }
  }
}

/**
 * Initialize Upstash Redis with dynamic import
 */
async function initializeUpstash(): Promise<RedisLike | null> {
  const url = process.env.RATE_LIMIT_REDIS_URL
  const token = process.env.RATE_LIMIT_REDIS_TOKEN

  if (!url || !token) {
    console.info('Upstash Redis not configured (RATE_LIMIT_REDIS_URL or RATE_LIMIT_REDIS_TOKEN missing)')
    return null
  }

  try {
    // Dynamic import to avoid build-time dependency
    const { Redis } = await import('@upstash/redis')
    
    const redis = new Redis({
      url,
      token
    })

    return redis as RedisLike
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error)
    return null
  }
}

/**
 * Get Queue Adapter (singleton)
 */
export async function getQueueAdapter(): Promise<QueueAdapter> {
  if (queueInstance) {
    return queueInstance
  }

  const redis = await initializeUpstash()
  
  if (redis) {
    queueInstance = new UpstashQueueAdapter(redis)
    console.info('Upstash Queue Adapter initialized')
  } else {
    queueInstance = new NoopQueueAdapter()
    console.info('Noop Queue Adapter initialized (Redis not configured)')
  }

  return queueInstance
}

/**
 * Get Rate Limit Adapter (singleton)
 */
export async function getRateLimitAdapter(): Promise<RateLimitAdapter> {
  if (rateLimitInstance) {
    return rateLimitInstance
  }

  const redis = await initializeUpstash()
  
  if (redis) {
    rateLimitInstance = new UpstashRateLimitAdapter(redis)
    console.info('Upstash Rate Limit Adapter initialized')
  } else {
    rateLimitInstance = new NoopRateLimitAdapter()
    console.info('Noop Rate Limit Adapter initialized (Redis not configured)')
  }

  return rateLimitInstance
}

// Export convenience functions
export async function enqueueWebhook(workspaceId: string, source: string, payload: any): Promise<void> {
  const adapter = await getQueueAdapter()
  return adapter.enqueueWebhook(workspaceId, source, payload)
}

export async function dequeueWebhook(workspaceId: string, source: string): Promise<any | null> {
  const adapter = await getQueueAdapter()
  return adapter.dequeueWebhook(workspaceId, source)
}

export async function getQueueLength(workspaceId: string, source: string): Promise<number> {
  const adapter = await getQueueAdapter()
  return adapter.getQueueLength(workspaceId, source)
}

export async function checkRateLimit(workspaceId: string, resource: string): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const adapter = await getRateLimitAdapter()
  return adapter.checkRateLimit(workspaceId, resource)
}
