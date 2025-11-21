/**
 * Rate Limiter
 * 
 * Per-workspace rate limiting with budget enforcement
 * Supports Redis (fast path) and Database (fallback)
 */

import { prisma } from '@/lib/db'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

export type ResourceType = 'messages' | 'tokens' | 'api_calls' | 'events' | 'jobs'

export interface BudgetConfig {
  messages: { daily: number; hourly: number }
  tokens: { daily: number; hourly: number }
  apiCalls: { daily: number; hourly: number }
  events: { daily: number; hourly: number }
  jobs: { daily: number; hourly: number }
}

export interface WorkspaceBudget {
  workspaceId: string
  dailyMessages: number
  dailyTokens: number
  dailyApiCalls: number
  dailyEvents: number
  dailyJobs: number
  resetAt: Date
  overagePolicy: 'queue' | 'drop' | 'degrade'
}

const DEFAULT_BUDGET: BudgetConfig = {
  messages: { daily: 1000, hourly: 100 },
  tokens: { daily: 100000, hourly: 10000 },
  apiCalls: { daily: 10000, hourly: 1000 },
  events: { daily: 1000, hourly: 100 },
  jobs: { daily: 500, hourly: 50 }
}

export class RateLimiter {
  /**
   * Check if workspace has budget for resource
   */
  async checkBudget(
    workspaceId: string,
    resource: ResourceType,
    amount: number = 1
  ): Promise<boolean> {
    const budget = await this.getBudget(workspaceId)
    const consumed = await this.getConsumed(workspaceId, resource, 'daily')

    const limit = this.getLimit(budget, resource, 'daily')
    return consumed + amount <= limit
  }

  /**
   * Consume budget for resource
   */
  async consumeBudget(
    workspaceId: string,
    resource: ResourceType,
    amount: number = 1
  ): Promise<boolean> {
    const hasbudget = await this.checkBudget(workspaceId, resource, amount)
    if (!hasbudget) return false

    await this.incrementConsumed(workspaceId, resource, amount, 'daily')
    await this.incrementConsumed(workspaceId, resource, amount, 'hourly')

    return true
  }

  /**
   * Get remaining budget
   */
  async getRemainingBudget(
    workspaceId: string,
    resource: ResourceType,
    period: 'daily' | 'hourly' = 'daily'
  ): Promise<number> {
    const budget = await this.getBudget(workspaceId)
    const consumed = await this.getConsumed(workspaceId, resource, period)
    const limit = this.getLimit(budget, resource, period)

    return Math.max(0, limit - consumed)
  }

  /**
   * Get workspace budget configuration
   */
  private async getBudget(workspaceId: string): Promise<WorkspaceBudget> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true }
    })

    if (!workspace?.studioInfo) {
      return this.getDefaultBudget(workspaceId)
    }

    const studioInfo = workspace.studioInfo as any
    const operatorConfig = studioInfo.operatorConfig

    if (!operatorConfig?.budgets) {
      return this.getDefaultBudget(workspaceId)
    }

    return {
      workspaceId,
      dailyMessages: operatorConfig.budgets.dailyMessages || DEFAULT_BUDGET.messages.daily,
      dailyTokens: operatorConfig.budgets.dailyTokens || DEFAULT_BUDGET.tokens.daily,
      dailyApiCalls: operatorConfig.budgets.dailyApiCalls || DEFAULT_BUDGET.apiCalls.daily,
      dailyEvents: operatorConfig.budgets.dailyEvents || DEFAULT_BUDGET.events.daily,
      dailyJobs: operatorConfig.budgets.dailyJobs || DEFAULT_BUDGET.jobs.daily,
      resetAt: new Date(operatorConfig.budgets.resetAt || this.getNextMidnight()),
      overagePolicy: operatorConfig.budgets.overagePolicy || 'queue'
    }
  }

  /**
   * Get default budget
   */
  private getDefaultBudget(workspaceId: string): WorkspaceBudget {
    return {
      workspaceId,
      dailyMessages: DEFAULT_BUDGET.messages.daily,
      dailyTokens: DEFAULT_BUDGET.tokens.daily,
      dailyApiCalls: DEFAULT_BUDGET.apiCalls.daily,
      dailyEvents: DEFAULT_BUDGET.events.daily,
      dailyJobs: DEFAULT_BUDGET.jobs.daily,
      resetAt: this.getNextMidnight(),
      overagePolicy: 'queue'
    }
  }

  /**
   * Get consumed amount from Redis or Database
   */
  private async getConsumed(
    workspaceId: string,
    resource: ResourceType,
    period: 'daily' | 'hourly'
  ): Promise<number> {
    const key = this.getKey(workspaceId, resource, period)

    if (redis) {
      try {
        const value = await redis.get(key)
        return value ? Number(value) : 0
      } catch (error) {
        console.warn('Redis get failed, falling back to database:', error)
      }
    }

    const since = period === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 60 * 60 * 1000)

    const count = await prisma.activityLog.count({
      where: {
        workspaceId,
        actionType: `budget.${resource}`,
        createdAt: { gte: since }
      }
    })

    return count
  }

  /**
   * Increment consumed amount
   */
  private async incrementConsumed(
    workspaceId: string,
    resource: ResourceType,
    amount: number,
    period: 'daily' | 'hourly'
  ): Promise<void> {
    const key = this.getKey(workspaceId, resource, period)
    const ttl = period === 'daily' ? 24 * 60 * 60 : 60 * 60

    if (redis) {
      try {
        await redis.incrby(key, amount)
        await redis.expire(key, ttl)
        return
      } catch (error) {
        console.warn('Redis increment failed, falling back to database:', error)
      }
    }

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: `budget.${resource}`,
        description: `Consumed ${amount} ${resource}`,
        metadata: { amount, period }
      }
    })
  }

  /**
   * Reset budgets for all workspaces (called daily at midnight)
   */
  async resetBudgets(): Promise<number> {
    if (!redis) {
      return 0
    }

    const workspaces = await prisma.workspace.findMany({
      select: { id: true }
    })

    let resetCount = 0

    for (const workspace of workspaces) {
      for (const resource of ['messages', 'tokens', 'api_calls', 'events', 'jobs'] as ResourceType[]) {
        const key = this.getKey(workspace.id, resource, 'daily')
        try {
          await redis.del(key)
          resetCount++
        } catch (error) {
          console.error(`Failed to reset budget for ${workspace.id}/${resource}:`, error)
        }
      }
    }

    return resetCount
  }

  /**
   * Get budget statistics for workspace
   */
  async getStats(workspaceId: string) {
    const budget = await this.getBudget(workspaceId)

    const stats = {
      messages: {
        limit: budget.dailyMessages,
        consumed: await this.getConsumed(workspaceId, 'messages', 'daily'),
        remaining: await this.getRemainingBudget(workspaceId, 'messages', 'daily')
      },
      tokens: {
        limit: budget.dailyTokens,
        consumed: await this.getConsumed(workspaceId, 'tokens', 'daily'),
        remaining: await this.getRemainingBudget(workspaceId, 'tokens', 'daily')
      },
      apiCalls: {
        limit: budget.dailyApiCalls,
        consumed: await this.getConsumed(workspaceId, 'api_calls', 'daily'),
        remaining: await this.getRemainingBudget(workspaceId, 'api_calls', 'daily')
      },
      events: {
        limit: budget.dailyEvents,
        consumed: await this.getConsumed(workspaceId, 'events', 'daily'),
        remaining: await this.getRemainingBudget(workspaceId, 'events', 'daily')
      },
      jobs: {
        limit: budget.dailyJobs,
        consumed: await this.getConsumed(workspaceId, 'jobs', 'daily'),
        remaining: await this.getRemainingBudget(workspaceId, 'jobs', 'daily')
      },
      resetAt: budget.resetAt,
      overagePolicy: budget.overagePolicy
    }

    return stats
  }

  /**
   * Get rate limit key
   */
  private getKey(workspaceId: string, resource: ResourceType, period: 'daily' | 'hourly'): string {
    return `budget:${workspaceId}:${resource}:${period}`
  }

  /**
   * Get limit for resource
   */
  private getLimit(budget: WorkspaceBudget, resource: ResourceType, period: 'daily' | 'hourly'): number {
    const dailyLimits = {
      messages: budget.dailyMessages,
      tokens: budget.dailyTokens,
      api_calls: budget.dailyApiCalls,
      events: budget.dailyEvents,
      jobs: budget.dailyJobs
    }

    if (period === 'daily') {
      return dailyLimits[resource]
    }

    return Math.floor(dailyLimits[resource] / 20)
  }

  /**
   * Get next midnight UTC
   */
  private getNextMidnight(): Date {
    const tomorrow = new Date()
    tomorrow.setUTCHours(24, 0, 0, 0)
    return tomorrow
  }
}

export const rateLimiter = new RateLimiter()
