/**
 * PILAR AUTOPILOT - Distributed Locking
 * 
 * Provides workspace-level locking to prevent concurrent provisioning/scheduler runs
 * Uses Upstash Redis (primary) with DB fallback (graceful degradation)
 */

import { Redis } from '@upstash/redis'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const redis =
  process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN
    ? new Redis({
        url: process.env.RATE_LIMIT_REDIS_URL,
        token: process.env.RATE_LIMIT_REDIS_TOKEN,
      })
    : null

export interface LockOptions {
  ttlMs?: number
  retryAttempts?: number
  retryDelayMs?: number
}

const DEFAULT_LOCK_OPTIONS: Required<LockOptions> = {
  ttlMs: 60000, // 1 minute
  retryAttempts: 3,
  retryDelayMs: 1000,
}

/**
 * Acquire a distributed lock using Redis (SET NX with TTL)
 */
async function acquireLockRedis(
  key: string,
  ttlMs: number
): Promise<boolean> {
  if (!redis) {
    return false
  }

  try {
    const lockValue = `${Date.now()}-${Math.random()}`
    const result = await redis.set(key, lockValue, {
      nx: true, // Only set if not exists
      px: ttlMs, // TTL in milliseconds
    })

    return result === 'OK'
  } catch (error) {
    logger.error({ error, key }, 'Redis lock acquisition failed')
    return false
  }
}

/**
 * Release a distributed lock using Redis
 */
async function releaseLockRedis(key: string): Promise<void> {
  if (!redis) {
    return
  }

  try {
    await redis.del(key)
  } catch (error) {
    logger.error({ error, key }, 'Redis lock release failed')
  }
}

/**
 * Acquire a lock using database (fallback)
 */
async function acquireLockDB(
  workspaceId: string,
  scope: string,
  ttlMs: number
): Promise<boolean> {
  try {
    const lockKey = `${workspaceId}:${scope}`
    const expiresAt = new Date(Date.now() + ttlMs)

    const result = await prisma.distributedLock.upsert({
      where: { lockKey },
      create: {
        lockKey,
        workspaceId,
        scope,
        expiresAt,
        acquiredAt: new Date(),
      },
      update: {
        expiresAt: {
          set: expiresAt,
        },
        acquiredAt: {
          set: new Date(),
        },
      },
    })

    const now = new Date()
    return result.acquiredAt >= new Date(now.getTime() - 1000) // Within last second
  } catch (error) {
    logger.error({ error, workspaceId, scope }, 'DB lock acquisition failed')
    return false
  }
}

/**
 * Release a lock using database (fallback)
 */
async function releaseLockDB(workspaceId: string, scope: string): Promise<void> {
  try {
    const lockKey = `${workspaceId}:${scope}`
    await prisma.distributedLock.delete({
      where: { lockKey },
    })
  } catch (error) {
    logger.debug({ error, workspaceId, scope }, 'DB lock release failed (may be expired)')
  }
}

/**
 * Acquire a distributed lock for a workspace + scope
 * 
 * @param workspaceId - Workspace ID
 * @param scope - Lock scope (e.g., 'provisioning', 'scheduler')
 * @param options - Lock options
 * @returns Lock handle with release function, or null if lock couldn't be acquired
 */
export async function acquireLock(
  workspaceId: string,
  scope: string,
  options: LockOptions = {}
): Promise<{ release: () => Promise<void> } | null> {
  const opts = { ...DEFAULT_LOCK_OPTIONS, ...options }
  const lockKey = `autopilot:lock:${workspaceId}:${scope}`

  for (let attempt = 0; attempt < opts.retryAttempts; attempt++) {
    if (redis) {
      const acquired = await acquireLockRedis(lockKey, opts.ttlMs)
      if (acquired) {
        logger.debug({ workspaceId, scope, method: 'redis' }, 'Lock acquired')
        return {
          release: async () => {
            await releaseLockRedis(lockKey)
            logger.debug({ workspaceId, scope, method: 'redis' }, 'Lock released')
          },
        }
      }
    } else {
      const acquired = await acquireLockDB(workspaceId, scope, opts.ttlMs)
      if (acquired) {
        logger.debug({ workspaceId, scope, method: 'db' }, 'Lock acquired')
        return {
          release: async () => {
            await releaseLockDB(workspaceId, scope)
            logger.debug({ workspaceId, scope, method: 'db' }, 'Lock released')
          },
        }
      }
    }

    if (attempt < opts.retryAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, opts.retryDelayMs))
    }
  }

  logger.warn(
    { workspaceId, scope, attempts: opts.retryAttempts },
    'Failed to acquire lock after retries'
  )
  return null
}

/**
 * Execute a function with a lock
 */
export async function withLock<T>(
  workspaceId: string,
  scope: string,
  fn: () => Promise<T>,
  options: LockOptions = {}
): Promise<T> {
  const lock = await acquireLock(workspaceId, scope, options)

  if (!lock) {
    throw new Error(`Failed to acquire lock for ${workspaceId}:${scope}`)
  }

  try {
    return await fn()
  } finally {
    await lock.release()
  }
}

/**
 * Check if a lock exists (for monitoring)
 */
export async function isLocked(workspaceId: string, scope: string): Promise<boolean> {
  const lockKey = `autopilot:lock:${workspaceId}:${scope}`

  if (redis) {
    try {
      const exists = await redis.exists(lockKey)
      return exists === 1
    } catch (error) {
      logger.error({ error, workspaceId, scope }, 'Failed to check Redis lock')
    }
  }

  try {
    const lock = await prisma.distributedLock.findUnique({
      where: { lockKey: `${workspaceId}:${scope}` },
    })
    return lock !== null && lock.expiresAt > new Date()
  } catch (error) {
    logger.error({ error, workspaceId, scope }, 'Failed to check DB lock')
    return false
  }
}
