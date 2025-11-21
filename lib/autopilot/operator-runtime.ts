/**
 * Automated Operator Runtime
 * 
 * Orchestrates all autopilot operations with health monitoring and self-healing
 * Runs continuously to ensure all workspaces are healthy and operational
 */

import { PrismaClient } from '@prisma/client'
import { PolicyEngine } from '../operator/policy-engine'
import { eventBus } from './event-bus'
import { jobQueue } from './job-queue'
import { DistributedLockManager } from './distributed-lock-manager'

const distributedLockManager = new DistributedLockManager()

const prisma = new PrismaClient()
const policyEngine = new PolicyEngine()

export interface OperatorStatus {
  running: boolean
  lastRun: Date
  nextRun: Date
  workspacesProcessed: number
  errors: number
  avgProcessingTime: number
}

export interface WorkspaceHealth {
  workspaceId: string
  healthScore: number
  status: 'healthy' | 'degraded' | 'critical'
  issues: HealthIssue[]
  lastCheck: Date
}

export interface HealthIssue {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  autoRemediable: boolean
  remediationAction?: string
}

export class AutomatedOperatorRuntime {
  private running = false
  private lastRun: Date | null = null
  private stats = {
    workspacesProcessed: 0,
    errors: 0,
    totalProcessingTime: 0
  }

  /**
   * Start operator runtime
   */
  async start(): Promise<void> {
    if (this.running) {
      console.log('Operator already running')
      return
    }

    this.running = true
    console.log('Operator runtime started')

    await this.runCycle()
  }

  /**
   * Stop operator runtime
   */
  async stop(): Promise<void> {
    this.running = false
    console.log('Operator runtime stopped')
  }

  /**
   * Run single operator cycle
   */
  async runCycle(): Promise<void> {
    const startTime = Date.now()
    this.lastRun = new Date()

    try {
      const workspaces = await prisma.workspace.findMany({
        where: {
          subscription: {
            status: 'active'
          }
        },
        select: {
          id: true,
          studioInfo: true
        }
      })

      console.log(`Processing ${workspaces.length} workspaces`)

      for (const workspace of workspaces) {
        try {
          await this.processWorkspace(workspace.id)
          this.stats.workspacesProcessed++
        } catch (error) {
          console.error(`Error processing workspace ${workspace.id}:`, error)
          this.stats.errors++
        }
      }

      const processingTime = Date.now() - startTime
      this.stats.totalProcessingTime += processingTime

      console.log(`Operator cycle complete: ${workspaces.length} workspaces in ${processingTime}ms`)
    } catch (error) {
      console.error('Error in operator cycle:', error)
      this.stats.errors++
    }
  }

  /**
   * Process single workspace
   */
  private async processWorkspace(workspaceId: string): Promise<void> {
    const lock = await distributedLockManager.acquireLock(
      `operator:${workspaceId}`,
      workspaceId,
      60000 // 1 minute TTL
    )

    if (!lock) {
      console.log(`Workspace ${workspaceId} already locked, skipping`)
      return
    }

    try {
      const health = await this.checkWorkspaceHealth(workspaceId)

      if (health.issues.length > 0) {
        await this.remediateIssues(workspaceId, health.issues)
      }

      await this.runScheduledTasks(workspaceId)

      await this.processPendingJobs(workspaceId)

      await eventBus.createEvent({
        workspaceId,
        type: 'health.webhook_check',
        payload: {
          healthScore: health.healthScore,
          status: health.status,
          issuesCount: health.issues.length
        }
      })
    } finally {
      await lock.release()
    }
  }

  /**
   * Check workspace health
   */
  private async checkWorkspaceHealth(workspaceId: string): Promise<WorkspaceHealth> {
    const issues: HealthIssue[] = []

    const healthScore = await policyEngine.getHealthScore(workspaceId)

    const integrations = await prisma.integration.findMany({
      where: { workspaceId }
    })

    for (const integration of integrations) {
      if (integration.status === 'error') {
        issues.push({
          type: 'integration_error',
          severity: 'high',
          description: `Integration ${integration.type} is in error state`,
          autoRemediable: true,
          remediationAction: 'retry_integration'
        })
      }
    }

    const failedJobs = await prisma.autopilotJob.count({
      where: {
        workspaceId,
        status: 'failed',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    if (failedJobs > 10) {
      issues.push({
        type: 'high_job_failure_rate',
        severity: 'critical',
        description: `${failedJobs} jobs failed in last 24 hours`,
        autoRemediable: false
      })
    }

    const staleEvents = await prisma.autopilotEvent.count({
      where: {
        workspaceId,
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000) // Older than 1 hour
        }
      }
    })

    if (staleEvents > 0) {
      issues.push({
        type: 'stale_events',
        severity: 'medium',
        description: `${staleEvents} events pending for over 1 hour`,
        autoRemediable: true,
        remediationAction: 'retry_events'
      })
    }

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy'
    if (healthScore < 50) status = 'critical'
    else if (healthScore < 70) status = 'degraded'

    return {
      workspaceId,
      healthScore,
      status,
      issues,
      lastCheck: new Date()
    }
  }

  /**
   * Remediate health issues
   */
  private async remediateIssues(
    workspaceId: string,
    issues: HealthIssue[]
  ): Promise<void> {
    for (const issue of issues) {
      if (!issue.autoRemediable || !issue.remediationAction) {
        continue
      }

      try {
        switch (issue.remediationAction) {
          case 'retry_integration':
            await this.retryIntegration(workspaceId)
            break
          case 'retry_events':
            await this.retryStaleEvents(workspaceId)
            break
          case 'clear_queue':
            await this.clearStaleJobs(workspaceId)
            break
          default:
            console.log(`Unknown remediation action: ${issue.remediationAction}`)
        }

        await eventBus.createEvent({
          workspaceId,
          type: 'health.integration_check',
          payload: {
            issueType: issue.type,
            action: issue.remediationAction
          }
        })
      } catch (error) {
        console.error(`Error remediating issue ${issue.type}:`, error)
      }
    }
  }

  /**
   * Retry failed integrations
   */
  private async retryIntegration(workspaceId: string): Promise<void> {
    const integrations = await prisma.integration.findMany({
      where: {
        workspaceId,
        status: 'error'
      }
    })

    for (const integration of integrations) {
      await prisma.integration.update({
        where: { id: integration.id },
        data: { status: 'inactive' }
      })
    }
  }

  /**
   * Retry stale events
   */
  private async retryStaleEvents(workspaceId: string): Promise<void> {
    const staleEvents = await prisma.autopilotEvent.findMany({
      where: {
        workspaceId,
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000)
        }
      },
      take: 10 // Limit to 10 at a time
    })

    for (const event of staleEvents) {
      await prisma.autopilotEvent.update({
        where: { id: event.id },
        data: {
          status: 'pending',
          attempts: 0
        }
      })
    }
  }

  /**
   * Clear stale jobs
   */
  private async clearStaleJobs(workspaceId: string): Promise<void> {
    await prisma.autopilotJob.updateMany({
      where: {
        workspaceId,
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      data: {
        status: 'failed',
        error: 'Job timed out after 24 hours'
      }
    })
  }

  /**
   * Run scheduled tasks for workspace
   */
  private async runScheduledTasks(workspaceId: string): Promise<void> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true }
    })

    const studioInfo = workspace?.studioInfo as any
    const operatorConfig = studioInfo?.operatorConfig || {}

    if (operatorConfig.scheduledTasks?.enabled === false) {
      return
    }

    const lastHealthCheck = operatorConfig.lastHealthCheck
      ? new Date(operatorConfig.lastHealthCheck)
      : new Date(0)

    const hoursSinceLastCheck = (Date.now() - lastHealthCheck.getTime()) / (1000 * 60 * 60)

    if (hoursSinceLastCheck >= 24) {
      await jobQueue.enqueue({
        workspaceId,
        type: 'health_check',
        payload: {},
        priority: 5
      })
    }
  }

  /**
   * Process pending jobs for workspace
   */
  private async processPendingJobs(workspaceId: string): Promise<void> {
    try {
      await jobQueue.processPendingJobs(5, `operator-${workspaceId}`)
    } catch (error) {
      console.error(`Error processing jobs for workspace ${workspaceId}:`, error)
    }
  }

  /**
   * Get operator status
   */
  getStatus(): OperatorStatus {
    return {
      running: this.running,
      lastRun: this.lastRun || new Date(0),
      nextRun: new Date(Date.now() + 60 * 60 * 1000), // Next hour
      workspacesProcessed: this.stats.workspacesProcessed,
      errors: this.stats.errors,
      avgProcessingTime: this.stats.workspacesProcessed > 0
        ? this.stats.totalProcessingTime / this.stats.workspacesProcessed
        : 0
    }
  }
}

export const operatorRuntime = new AutomatedOperatorRuntime()
