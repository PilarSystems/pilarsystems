/**
 * PILAR AUTOPILOT - Health Monitoring
 * 
 * Aggregates workspace health from integrations, jobs, and webhooks
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { twilioAdapter } from '@/lib/integrations/twilio-adapter'
import { whatsappAdapter } from '@/lib/integrations/whatsapp-adapter'
import { emailAdapter } from '@/lib/integrations/email-adapter'

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  integrations: {
    twilio: IntegrationHealth
    whatsapp: IntegrationHealth
    email: IntegrationHealth
  }
  provisioning: {
    status: 'idle' | 'in_progress' | 'failed' | 'completed'
    lastJobId?: string
    lastJobStatus?: string
    lastJobProgress?: number
    lastJobError?: string
  }
  scheduler: {
    pendingFollowups: number
    lastProcessedAt?: Date
  }
  issues: HealthIssue[]
}

export interface IntegrationHealth {
  status: 'active' | 'inactive' | 'error'
  lastChecked: Date
  details?: string
  error?: string
}

export interface HealthIssue {
  severity: 'critical' | 'warning' | 'info'
  component: string
  message: string
  actionable: boolean
  action?: string
}

/**
 * Get comprehensive health status for a workspace
 */
export async function getWorkspaceHealth(workspaceId: string): Promise<HealthStatus> {
  try {
    const issues: HealthIssue[] = []

    const twilioHealth = await checkTwilioHealth(workspaceId)
    if (twilioHealth.status === 'error') {
      issues.push({
        severity: 'warning',
        component: 'twilio',
        message: twilioHealth.error || 'Twilio integration not working',
        actionable: true,
        action: 'Check Twilio credentials and run provisioning',
      })
    }

    const whatsappHealth = await checkWhatsAppHealth(workspaceId)
    if (whatsappHealth.status === 'error') {
      issues.push({
        severity: 'warning',
        component: 'whatsapp',
        message: whatsappHealth.error || 'WhatsApp integration not working',
        actionable: true,
        action: 'Check WhatsApp credentials and run provisioning',
      })
    }

    const emailHealth = await checkEmailHealth()
    if (emailHealth.status === 'error') {
      issues.push({
        severity: 'info',
        component: 'email',
        message: emailHealth.error || 'Email not configured',
        actionable: true,
        action: 'Configure SMTP settings',
      })
    }

    const provisioningStatus = await checkProvisioningStatus(workspaceId)
    if (provisioningStatus.status === 'failed') {
      issues.push({
        severity: 'critical',
        component: 'provisioning',
        message: provisioningStatus.lastJobError || 'Provisioning failed',
        actionable: true,
        action: 'Review error and re-run provisioning',
      })
    }

    const schedulerStatus = await checkSchedulerStatus(workspaceId)

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    const criticalIssues = issues.filter((i) => i.severity === 'critical')
    const warningIssues = issues.filter((i) => i.severity === 'warning')

    if (criticalIssues.length > 0) {
      overall = 'unhealthy'
    } else if (warningIssues.length > 0) {
      overall = 'degraded'
    }

    return {
      overall,
      integrations: {
        twilio: twilioHealth,
        whatsapp: whatsappHealth,
        email: emailHealth,
      },
      provisioning: provisioningStatus,
      scheduler: schedulerStatus,
      issues,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to get workspace health')
    throw error
  }
}

/**
 * Check Twilio integration health
 */
async function checkTwilioHealth(workspaceId: string): Promise<IntegrationHealth> {
  try {
    const result = await twilioAdapter.getStatus(workspaceId)

    if (!result.ok) {
      return {
        status: 'error',
        lastChecked: new Date(),
        error: result.error || 'Failed to check Twilio status',
      }
    }

    if (result.data?.active) {
      return {
        status: 'active',
        lastChecked: new Date(),
        details: `Phone: ${result.data.number}`,
      }
    }

    return {
      status: 'inactive',
      lastChecked: new Date(),
      details: 'Twilio not configured',
    }
  } catch (error: any) {
    return {
      status: 'error',
      lastChecked: new Date(),
      error: error.message,
    }
  }
}

/**
 * Check WhatsApp integration health
 */
async function checkWhatsAppHealth(workspaceId: string): Promise<IntegrationHealth> {
  try {
    const result = await whatsappAdapter.getStatus(workspaceId)

    if (!result.ok) {
      return {
        status: 'error',
        lastChecked: new Date(),
        error: result.error || 'Failed to check WhatsApp status',
      }
    }

    if (result.data?.connected) {
      return {
        status: 'active',
        lastChecked: new Date(),
        details: 'WhatsApp connected',
      }
    }

    return {
      status: 'inactive',
      lastChecked: new Date(),
      details: 'WhatsApp not configured',
    }
  } catch (error: any) {
    return {
      status: 'error',
      lastChecked: new Date(),
      error: error.message,
    }
  }
}

/**
 * Check Email integration health
 */
async function checkEmailHealth(): Promise<IntegrationHealth> {
  try {
    const result = await emailAdapter.getStatus()

    if (!result.ok) {
      return {
        status: 'error',
        lastChecked: new Date(),
        error: result.error || 'Failed to check email status',
      }
    }

    if (result.data?.configured) {
      return {
        status: 'active',
        lastChecked: new Date(),
        details: `Provider: ${result.data.provider}`,
      }
    }

    return {
      status: 'inactive',
      lastChecked: new Date(),
      details: 'Email not configured',
    }
  } catch (error: any) {
    return {
      status: 'error',
      lastChecked: new Date(),
      error: error.message,
    }
  }
}

/**
 * Check provisioning job status
 */
async function checkProvisioningStatus(workspaceId: string): Promise<{
  status: 'idle' | 'in_progress' | 'failed' | 'completed'
  lastJobId?: string
  lastJobStatus?: string
  lastJobProgress?: number
  lastJobError?: string
}> {
  try {
    const lastJob = await prisma.provisioningJob.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })

    if (!lastJob) {
      return { status: 'idle' }
    }

    return {
      status: lastJob.status as any,
      lastJobId: lastJob.id,
      lastJobStatus: lastJob.status,
      lastJobProgress: lastJob.progress,
      lastJobError: lastJob.error || undefined,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to check provisioning status')
    return { status: 'idle' }
  }
}

/**
 * Check scheduler status
 */
async function checkSchedulerStatus(workspaceId: string): Promise<{
  pendingFollowups: number
  lastProcessedAt?: Date
}> {
  try {
    const pendingCount = await prisma.followup.count({
      where: {
        workspaceId,
        type: 'whatsapp',
        status: 'pending',
      },
    })

    const lastProcessed = await prisma.followup.findFirst({
      where: {
        workspaceId,
        type: 'whatsapp',
        status: 'sent',
      },
      orderBy: { completedAt: 'desc' },
    })

    return {
      pendingFollowups: pendingCount,
      lastProcessedAt: lastProcessed?.completedAt || undefined,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to check scheduler status')
    return { pendingFollowups: 0 }
  }
}

/**
 * Get health summary for all workspaces (admin view)
 */
export async function getAllWorkspacesHealth(limit: number = 50): Promise<
  Array<{
    workspaceId: string
    workspaceName: string
    health: HealthStatus
  }>
> {
  try {
    const workspaces = await prisma.workspace.findMany({
      take: limit,
      select: {
        id: true,
        name: true,
      },
    })

    const healthStatuses = await Promise.all(
      workspaces.map(async (workspace) => ({
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        health: await getWorkspaceHealth(workspace.id),
      }))
    )

    return healthStatuses
  } catch (error: any) {
    logger.error({ error }, 'Failed to get all workspaces health')
    throw error
  }
}
