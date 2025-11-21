/**
 * PILAR AUTOPILOT v5.0 - Operator Runtime
 * 
 * Central orchestrator for autonomous system operations
 * Event-driven with deterministic policy engine
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { acquireLock } from '@/lib/autopilot/locks'
import { getWorkspaceHealth } from '@/lib/autopilot/health'
import { runProvisioning } from '@/lib/autopilot/provisioning-orchestrator'
import { processWorkspaceFollowups } from '@/lib/autopilot/scheduler'

export interface OperatorSignal {
  type: 'health_degraded' | 'provisioning_needed' | 'followup_due' | 'webhook_failed' | 'integration_offline'
  workspaceId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  metadata: Record<string, any>
  timestamp: Date
}

export interface OperatorAction {
  type: 'run_provisioning' | 'retry_webhook' | 'send_followup' | 'notify_support' | 'restart_integration'
  workspaceId: string
  params: Record<string, any>
}

export interface OperatorResult {
  signalsProcessed: number
  actionsExecuted: number
  errors: number
  workspacesAffected: string[]
}

/**
 * Scan for signals across all workspaces
 */
export async function scanSignals(limit: number = 100): Promise<OperatorSignal[]> {
  const signals: OperatorSignal[] = []

  try {
    const workspaces = await prisma.workspace.findMany({
      take: limit,
      include: {
        provisioningJobs: {
          where: {
            status: 'failed',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    for (const workspace of workspaces) {
      const health = await getWorkspaceHealth(workspace.id)
      
      if (health.overall === 'degraded' || health.overall === 'unhealthy') {
        signals.push({
          type: 'health_degraded',
          workspaceId: workspace.id,
          severity: health.overall === 'unhealthy' ? 'critical' : 'high',
          metadata: { health },
          timestamp: new Date(),
        })
      }

      if (workspace.provisioningJobs.length > 0) {
        signals.push({
          type: 'provisioning_needed',
          workspaceId: workspace.id,
          severity: 'medium',
          metadata: { jobId: workspace.provisioningJobs[0].id },
          timestamp: new Date(),
        })
      }
    }

    const dueFollowups = await prisma.followup.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: new Date(),
        },
      },
      select: {
        workspaceId: true,
      },
      distinct: ['workspaceId'],
      take: limit,
    })

    for (const followup of dueFollowups) {
      signals.push({
        type: 'followup_due',
        workspaceId: followup.workspaceId,
        severity: 'low',
        metadata: {},
        timestamp: new Date(),
      })
    }

    logger.info({ signalCount: signals.length }, 'Operator signals scanned')
    return signals
  } catch (error: any) {
    logger.error({ error }, 'Failed to scan operator signals')
    return signals
  }
}

/**
 * Policy engine: Decide actions based on signals
 */
export function decideActions(signals: OperatorSignal[]): OperatorAction[] {
  const actions: OperatorAction[] = []

  for (const signal of signals) {
    switch (signal.type) {
      case 'health_degraded':
        if (signal.severity === 'critical' || signal.severity === 'high') {
          actions.push({
            type: 'run_provisioning',
            workspaceId: signal.workspaceId,
            params: { reason: 'health_degraded' },
          })
        }
        break

      case 'provisioning_needed':
        actions.push({
          type: 'run_provisioning',
          workspaceId: signal.workspaceId,
          params: { reason: 'retry_failed_job' },
        })
        break

      case 'followup_due':
        actions.push({
          type: 'send_followup',
          workspaceId: signal.workspaceId,
          params: {},
        })
        break

      case 'webhook_failed':
        actions.push({
          type: 'retry_webhook',
          workspaceId: signal.workspaceId,
          params: signal.metadata,
        })
        break

      case 'integration_offline':
        actions.push({
          type: 'restart_integration',
          workspaceId: signal.workspaceId,
          params: signal.metadata,
        })
        break
    }
  }

  return actions
}

/**
 * Execute actions with distributed locking
 */
export async function executeActions(actions: OperatorAction[]): Promise<OperatorResult> {
  const result: OperatorResult = {
    signalsProcessed: actions.length,
    actionsExecuted: 0,
    errors: 0,
    workspacesAffected: [],
  }

  for (const action of actions) {
    try {
      const lock = await acquireLock(action.workspaceId, 'operator', {
        ttlMs: 300000, // 5 minutes
        retryAttempts: 1,
      })

      if (!lock) {
        logger.warn({ workspaceId: action.workspaceId }, 'Failed to acquire operator lock, skipping')
        continue
      }

      try {
        await executeAction(action)
        result.actionsExecuted++
        
        if (!result.workspacesAffected.includes(action.workspaceId)) {
          result.workspacesAffected.push(action.workspaceId)
        }
      } finally {
        await lock.release()
      }
    } catch (error: any) {
      logger.error({ error, action }, 'Failed to execute operator action')
      result.errors++
    }
  }

  return result
}

/**
 * Execute a single action
 */
async function executeAction(action: OperatorAction): Promise<void> {
  logger.info({ action }, 'Executing operator action')

  switch (action.type) {
    case 'run_provisioning':
      await runProvisioning({
        workspaceId: action.workspaceId,
        source: 'operator',
        metadata: action.params,
      })
      break

    case 'send_followup':
      await processWorkspaceFollowups(action.workspaceId, 10)
      break

    case 'retry_webhook':
      logger.info({ action }, 'Webhook retry not yet implemented')
      break

    case 'restart_integration':
      logger.info({ action }, 'Integration restart not yet implemented')
      break

    case 'notify_support':
      logger.info({ action }, 'Support notification not yet implemented')
      break
  }

  await prisma.activityLog.create({
    data: {
      workspaceId: action.workspaceId,
      actionType: `operator_${action.type}`,
      description: `Operator executed: ${action.type}`,
      metadata: action.params,
    },
  })
}

/**
 * Main operator runtime loop
 */
export async function runOperator(options: {
  maxSignals?: number
  maxActions?: number
} = {}): Promise<OperatorResult> {
  const { maxSignals = 100, maxActions = 50 } = options

  try {
    logger.info('Operator runtime starting')

    const signals = await scanSignals(maxSignals)

    const actions = decideActions(signals).slice(0, maxActions)

    const result = await executeActions(actions)

    logger.info({ result }, 'Operator runtime completed')
    return result
  } catch (error: any) {
    logger.error({ error }, 'Operator runtime failed')
    return {
      signalsProcessed: 0,
      actionsExecuted: 0,
      errors: 1,
      workspacesAffected: [],
    }
  }
}
