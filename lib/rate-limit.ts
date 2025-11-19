import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const createNoOpRateLimiter = (): Ratelimit => ({
  limit: async () => ({ 
    success: true, 
    limit: 0, 
    remaining: 0, 
    reset: 0, 
    pending: Promise.resolve() 
  })
} as any as Ratelimit)

let redis: Redis | null = null
if (process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN) {
  redis = new Redis({
    url: process.env.RATE_LIMIT_REDIS_URL,
    token: process.env.RATE_LIMIT_REDIS_TOKEN,
  })
} else {
  console.warn('Rate limiting disabled: RATE_LIMIT_REDIS_URL or RATE_LIMIT_REDIS_TOKEN not set')
}

export const ratelimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: 'pilarsystems:general',
    })
  : createNoOpRateLimiter()

export const userRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, '1 h'),
      analytics: true,
      prefix: 'pilarsystems:user',
    })
  : createNoOpRateLimiter()

export const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'pilarsystems:auth',
    })
  : createNoOpRateLimiter()

export const webhookRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '10 s'),
      analytics: true,
      prefix: 'pilarsystems:webhook',
    })
  : createNoOpRateLimiter()

export const leadRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
      prefix: 'pilarsystems:lead',
    })
  : createNoOpRateLimiter()
