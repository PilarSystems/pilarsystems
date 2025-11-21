/**
 * Operator Policy Engine
 * 
 * Evaluates workspace policies and determines allowed actions
 * Enforces budget limits, rate limits, and operational constraints
 */

import { PrismaClient } from '@prisma/client'
import { rateLimiter } from '@/lib/autopilot/rate-limiter'

const prisma = new PrismaClient()

export interface WorkspacePolicy {
  workspaceId: string
  enabled: boolean
  budgets: {
    dailyMessages: number
    dailyTokens: number
    dailyApiCalls: number
    dailyEvents: number
    dailyJobs: number
  }
  rateLimits: {
    messagesPerHour: number
    tokensPerHour: number
    apiCallsPerHour: number
  }
  features: {
    autoProvisioning: boolean
    autoHealing: boolean
    whatsappCoach: boolean
    aiRules: boolean
    webhookRetry: boolean
  }
  restrictions: {
    maxRetries: number
    maxConcurrentJobs: number
    maxQueueDepth: number
  }
  overagePolicy: 'queue' | 'drop' | 'degrade'
}

export interface PolicyDecision {
  allowed: boolean
  reason?: string
  degraded?: boolean
  queueUntil?: Date
}

export class PolicyEngine {
  /**
   * Get workspace policy
   */
  async getPolicy(workspaceId: string): Promise<WorkspacePolicy> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        studioInfo: true,
        subscription: {
          select: {
            plan: true,
            status: true
          }
        }
      }
    })

    if (!workspace) {
      throw new Error(`Workspace ${workspaceId} not found`)
    }

    const studioInfo = workspace.studioInfo as any
    const operatorConfig = studioInfo?.operatorConfig || {}

    const plan = workspace.subscription?.plan || 'BASIC'
    const defaults = this.getDefaultPolicyForPlan(plan)

    return {
      workspaceId,
      enabled: operatorConfig.enabled !== false,
      budgets: {
        dailyMessages: operatorConfig.budgets?.dailyMessages || defaults.budgets?.dailyMessages || 500,
        dailyTokens: operatorConfig.budgets?.dailyTokens || defaults.budgets?.dailyTokens || 50000,
        dailyApiCalls: operatorConfig.budgets?.dailyApiCalls || defaults.budgets?.dailyApiCalls || 5000,
        dailyEvents: operatorConfig.budgets?.dailyEvents || defaults.budgets?.dailyEvents || 500,
        dailyJobs: operatorConfig.budgets?.dailyJobs || defaults.budgets?.dailyJobs || 250
      },
      rateLimits: {
        messagesPerHour: operatorConfig.rateLimits?.messagesPerHour || defaults.rateLimits?.messagesPerHour || 50,
        tokensPerHour: operatorConfig.rateLimits?.tokensPerHour || defaults.rateLimits?.tokensPerHour || 5000,
        apiCallsPerHour: operatorConfig.rateLimits?.apiCallsPerHour || defaults.rateLimits?.apiCallsPerHour || 500
      },
      features: {
        autoProvisioning: operatorConfig.features?.autoProvisioning !== false,
        autoHealing: operatorConfig.features?.autoHealing !== false,
        whatsappCoach: operatorConfig.features?.whatsappCoach !== false,
        aiRules: operatorConfig.features?.aiRules !== false,
        webhookRetry: operatorConfig.features?.webhookRetry !== false
      },
      restrictions: {
        maxRetries: operatorConfig.restrictions?.maxRetries || 3,
        maxConcurrentJobs: operatorConfig.restrictions?.maxConcurrentJobs || 10,
        maxQueueDepth: operatorConfig.restrictions?.maxQueueDepth || 100
      },
      overagePolicy: operatorConfig.overagePolicy || defaults.overagePolicy || 'queue'
    }
  }

  /**
   * Check if action is allowed by policy
   */
  async checkAction(
    workspaceId: string,
    action: 'send_message' | 'call_api' | 'create_event' | 'create_job' | 'provision' | 'heal',
    metadata?: { tokens?: number; priority?: number }
  ): Promise<PolicyDecision> {
    const policy = await this.getPolicy(workspaceId)

    if (!policy.enabled) {
      return {
        allowed: false,
        reason: 'Operator disabled for workspace'
      }
    }

    const featureMap = {
      provision: 'autoProvisioning',
      heal: 'autoHealing'
    }

    const featureKey = featureMap[action as keyof typeof featureMap]
    if (featureKey && !policy.features[featureKey as keyof typeof policy.features]) {
      return {
        allowed: false,
        reason: `Feature ${featureKey} disabled for workspace`
      }
    }

    const resourceMap = {
      send_message: 'messages',
      call_api: 'api_calls',
      create_event: 'events',
      create_job: 'jobs'
    }

    const resource = resourceMap[action as keyof typeof resourceMap]
    if (resource) {
      const amount = action === 'call_api' && metadata?.tokens ? metadata.tokens : 1
      const hasbudget = await rateLimiter.checkBudget(
        workspaceId,
        resource as any,
        amount
      )

      if (!hasbudget) {
        if (policy.overagePolicy === 'drop') {
          return {
            allowed: false,
            reason: `Budget exceeded for ${resource}`
          }
        } else if (policy.overagePolicy === 'queue') {
          return {
            allowed: true,
            degraded: false,
            queueUntil: new Date(Date.now() + 60 * 60 * 1000), // Queue for 1 hour
            reason: `Budget exceeded, queuing action`
          }
        } else if (policy.overagePolicy === 'degrade') {
          return {
            allowed: true,
            degraded: true,
            reason: `Budget exceeded, degraded service`
          }
        }
      }
    }

    return { allowed: true }
  }

  /**
   * Enforce budget consumption
   */
  async enforceAction(
    workspaceId: string,
    action: 'send_message' | 'call_api' | 'create_event' | 'create_job',
    metadata?: { tokens?: number }
  ): Promise<void> {
    const resourceMap = {
      send_message: 'messages',
      call_api: 'api_calls',
      create_event: 'events',
      create_job: 'jobs'
    }

    const resource = resourceMap[action]
    if (resource) {
      const amount = action === 'call_api' && metadata?.tokens ? metadata.tokens : 1
      await rateLimiter.consumeBudget(workspaceId, resource as any, amount)
    }
  }

  /**
   * Get health score for workspace
   */
  async getHealthScore(workspaceId: string): Promise<number> {
    const [
      budgetStats,
      failedJobs,
      failedEvents,
      integrationStatus
    ] = await Promise.all([
      rateLimiter.getStats(workspaceId),
      this.getFailedJobsCount(workspaceId),
      this.getFailedEventsCount(workspaceId),
      this.getIntegrationHealth(workspaceId)
    ])

    let score = 100

    const budgetUtilization = (
      (budgetStats.messages.consumed / budgetStats.messages.limit) +
      (budgetStats.tokens.consumed / budgetStats.tokens.limit) +
      (budgetStats.apiCalls.consumed / budgetStats.apiCalls.limit)
    ) / 3

    if (budgetUtilization > 0.9) score -= 20
    else if (budgetUtilization > 0.7) score -= 10

    if (failedJobs > 10) score -= 20
    else if (failedJobs > 5) score -= 10

    if (failedEvents > 10) score -= 20
    else if (failedEvents > 5) score -= 10

    if (integrationStatus.failureRate > 0.5) score -= 30
    else if (integrationStatus.failureRate > 0.2) score -= 15

    return Math.max(0, score)
  }

  /**
   * Get default policy for subscription plan
   */
  private getDefaultPolicyForPlan(plan: string): Partial<WorkspacePolicy> {
    const policies = {
      BASIC: {
        budgets: {
          dailyMessages: 500,
          dailyTokens: 50000,
          dailyApiCalls: 5000,
          dailyEvents: 500,
          dailyJobs: 250
        },
        rateLimits: {
          messagesPerHour: 50,
          tokensPerHour: 5000,
          apiCallsPerHour: 500
        },
        overagePolicy: 'queue' as const
      },
      PRO: {
        budgets: {
          dailyMessages: 2000,
          dailyTokens: 200000,
          dailyApiCalls: 20000,
          dailyEvents: 2000,
          dailyJobs: 1000
        },
        rateLimits: {
          messagesPerHour: 200,
          tokensPerHour: 20000,
          apiCallsPerHour: 2000
        },
        overagePolicy: 'degrade' as const
      },
      ENTERPRISE: {
        budgets: {
          dailyMessages: 10000,
          dailyTokens: 1000000,
          dailyApiCalls: 100000,
          dailyEvents: 10000,
          dailyJobs: 5000
        },
        rateLimits: {
          messagesPerHour: 1000,
          tokensPerHour: 100000,
          apiCallsPerHour: 10000
        },
        overagePolicy: 'degrade' as const
      }
    }

    return policies[plan as keyof typeof policies] || policies.BASIC
  }

  /**
   * Get failed jobs count
   */
  private async getFailedJobsCount(workspaceId: string): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return prisma.autopilotJob.count({
      where: {
        workspaceId,
        status: 'failed',
        createdAt: { gte: oneDayAgo }
      }
    })
  }

  /**
   * Get failed events count
   */
  private async getFailedEventsCount(workspaceId: string): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return prisma.autopilotEvent.count({
      where: {
        workspaceId,
        status: 'failed',
        createdAt: { gte: oneDayAgo }
      }
    })
  }

  /**
   * Get integration health
   */
  private async getIntegrationHealth(workspaceId: string): Promise<{ failureRate: number }> {
    const integrations = await prisma.integration.findMany({
      where: { workspaceId },
      select: { status: true }
    })

    if (integrations.length === 0) {
      return { failureRate: 0 }
    }

    const failedCount = integrations.filter(i => i.status === 'error').length
    return { failureRate: failedCount / integrations.length }
  }
}

export const policyEngine = new PolicyEngine()
