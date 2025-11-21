/**
 * Distributed Lock Manager
 * 
 * Provides distributed locking with Redis (primary) and Database (fallback)
 * Prevents concurrent operations across multiple processes
 */

import { prisma } from '@/lib/db'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

export interface Lock {
  key: string
  workspaceId: string
  ttlMs: number
  release(): Promise<void>
  extend(ttlMs: number): Promise<boolean>
}

class RedisLock implements Lock {
  constructor(
    public key: string,
    public workspaceId: string,
    public ttlMs: number,
    private redis: Redis
  ) {}

  async release(): Promise<void> {
    await this.redis.del(`lock:${this.key}`)
  }

  async extend(ttlMs: number): Promise<boolean> {
    const result = await this.redis.expire(`lock:${this.key}`, Math.floor(ttlMs / 1000))
    return result === 1
  }
}

class DatabaseLock implements Lock {
  constructor(
    public key: string,
    public workspaceId: string,
    public ttlMs: number,
    private lockId: string
  ) {}

  async release(): Promise<void> {
    await prisma.distributedLock.delete({
      where: { id: this.lockId }
    }).catch(() => {
    })
  }

  async extend(ttlMs: number): Promise<boolean> {
    try {
      await prisma.distributedLock.update({
        where: { id: this.lockId },
        data: {
          expiresAt: new Date(Date.now() + ttlMs)
        }
      })
      return true
    } catch (error) {
      return false
    }
  }
}

export class DistributedLockManager {
  /**
   * Acquire a distributed lock
   */
  async acquireLock(
    key: string,
    workspaceId: string,
    ttlMs: number = 30000,
    scope: string = 'autopilot'
  ): Promise<Lock | null> {
    if (redis) {
      try {
        const lockKey = `lock:${key}`
        const result = await redis.set(lockKey, workspaceId, {
          px: ttlMs,
          nx: true
        })

        if (result === 'OK') {
          return new RedisLock(key, workspaceId, ttlMs, redis)
        }
      } catch (error) {
        console.warn('Redis lock acquisition failed, falling back to database:', error)
      }
    }

    try {
      const lock = await prisma.distributedLock.create({
        data: {
          lockKey: key,
          workspaceId,
          scope,
          expiresAt: new Date(Date.now() + ttlMs)
        }
      })

      return new DatabaseLock(key, workspaceId, ttlMs, lock.id)
    } catch (error: any) {
      if (error.code === 'P2002') {
        return null
      }
      throw error
    }
  }

  /**
   * Try to acquire lock with retries
   */
  async acquireLockWithRetry(
    key: string,
    workspaceId: string,
    ttlMs: number = 30000,
    scope: string = 'autopilot',
    maxRetries: number = 3,
    retryDelayMs: number = 1000
  ): Promise<Lock | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const lock = await this.acquireLock(key, workspaceId, ttlMs, scope)
      if (lock) return lock

      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelayMs))
      }
    }

    return null
  }

  /**
   * Execute function with lock
   */
  async withLock<T>(
    key: string,
    workspaceId: string,
    fn: () => Promise<T>,
    ttlMs: number = 30000,
    scope: string = 'autopilot'
  ): Promise<T | null> {
    const lock = await this.acquireLock(key, workspaceId, ttlMs, scope)
    if (!lock) return null

    try {
      return await fn()
    } finally {
      await lock.release()
    }
  }

  /**
   * Clean up expired locks from database
   */
  async cleanupExpiredLocks(): Promise<number> {
    const result = await prisma.distributedLock.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })

    return result.count
  }

  /**
   * Check if lock exists
   */
  async isLocked(key: string): Promise<boolean> {
    if (redis) {
      try {
        const exists = await redis.exists(`lock:${key}`)
        if (exists) return true
      } catch (error) {
      }
    }

    const lock = await prisma.distributedLock.findUnique({
      where: { lockKey: key }
    })

    if (!lock) return false

    if (lock.expiresAt < new Date()) {
      await prisma.distributedLock.delete({
        where: { id: lock.id }
      }).catch(() => {})
      return false
    }

    return true
  }

  /**
   * Force release a lock (use with caution)
   */
  async forceRelease(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(`lock:${key}`)
      } catch (error) {
      }
    }

    await prisma.distributedLock.deleteMany({
      where: { lockKey: key }
    })
  }
}

export const lockManager = new DistributedLockManager()
