import { prisma } from '@/lib/prisma'
import { Redis } from '@upstash/redis'

const redis = process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN
  ? new Redis({
      url: process.env.RATE_LIMIT_REDIS_URL,
      token: process.env.RATE_LIMIT_REDIS_TOKEN,
    })
  : null

const LOCK_TTL_SECONDS = 30

export async function acquireConversationLock(
  workspaceId: string,
  leadId: string,
  processId: string
): Promise<boolean> {
  if (redis) {
    const lockKey = `conversation:lock:${workspaceId}:${leadId}`
    const acquired = await redis.set(lockKey, processId, {
      ex: LOCK_TTL_SECONDS,
      nx: true
    })
    return acquired === 'OK'
  }

  try {
    const state = await prisma.conversationState.upsert({
      where: {
        workspaceId_leadId: {
          workspaceId,
          leadId
        }
      },
      create: {
        workspaceId,
        leadId,
        state: 'processing',
        lockedAt: new Date(),
        lockedBy: processId
      },
      update: {
        state: 'processing',
        lockedAt: new Date(),
        lockedBy: processId
      }
    })

    const lockAge = state.lockedAt ? Date.now() - state.lockedAt.getTime() : 0
    if (lockAge > LOCK_TTL_SECONDS * 1000 && state.lockedBy !== processId) {
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to acquire conversation lock:', error)
    return false
  }
}

export async function releaseConversationLock(
  workspaceId: string,
  leadId: string,
  processId: string
): Promise<void> {
  if (redis) {
    const lockKey = `conversation:lock:${workspaceId}:${leadId}`
    const currentLock = await redis.get(lockKey)
    
    if (currentLock === processId) {
      await redis.del(lockKey)
    }
    return
  }

  try {
    await prisma.conversationState.updateMany({
      where: {
        workspaceId,
        leadId,
        lockedBy: processId
      },
      data: {
        state: 'idle',
        lockedAt: null,
        lockedBy: null
      }
    })
  } catch (error) {
    console.error('Failed to release conversation lock:', error)
  }
}
