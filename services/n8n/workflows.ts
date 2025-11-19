import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { auditService } from '@/lib/audit'
import axios from 'axios'

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1'
const N8N_API_KEY = process.env.N8N_API_KEY!

export interface WorkflowConfig {
  workspaceId: string
  workflowType: 'lead_followup' | 'missed_call' | 'whatsapp_reply' | 'email_reply' | 'calendar_reminder'
  name: string
}

/**
 * n8n Workflow Service
 * Handles tenant-aware workflow management
 * 
 * Note: This implementation uses a shared workflow approach with workspace filtering
 * rather than creating separate workflows per tenant (more scalable for 10k+ tenants)
 */
export class N8nWorkflowService {
  private apiClient: any

  constructor() {
    this.apiClient = axios.create({
      baseURL: N8N_API_URL,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    })
  }

  /**
   * Activate workflow for a workspace
   * Uses shared multi-tenant workflows with workspace-specific webhooks
   */
  async activateWorkflow(config: WorkflowConfig): Promise<void> {
    try {
      logger.info({ workspaceId: config.workspaceId, workflowType: config.workflowType }, 'Activating workflow')

      const existing = await prisma.n8nWorkflow.findFirst({
        where: {
          workspaceId: config.workspaceId,
          name: config.name,
        },
      })

      if (existing) {
        logger.info({ workspaceId: config.workspaceId }, 'Workflow already active')
        return
      }

      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/n8n/${config.workspaceId}/${config.workflowType}`

      const workflowId = `workflow_${config.workspaceId}_${config.workflowType}`

      await prisma.n8nWorkflow.create({
        data: {
          workspaceId: config.workspaceId,
          workflowId,
          name: config.name,
          webhookUrl,
          active: true,
          config: {
            type: config.workflowType,
            webhookUrl,
          },
        },
      })

      logger.info(
        { workspaceId: config.workspaceId, workflowId, webhookUrl },
        'Workflow activated'
      )

      await auditService.logProvisioning(
        config.workspaceId,
        'n8n.workflow.activate',
        'n8n_workflow',
        workflowId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to activate workflow')

      await auditService.logProvisioning(
        config.workspaceId,
        'n8n.workflow.activate',
        'n8n_workflow',
        '',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Trigger a workflow
   */
  async triggerWorkflow(
    workspaceId: string,
    workflowType: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      const workflow = await prisma.n8nWorkflow.findFirst({
        where: {
          workspaceId,
          config: {
            path: ['type'],
            equals: workflowType,
          },
          active: true,
        },
      })

      if (!workflow || !workflow.webhookUrl) {
        logger.warn({ workspaceId, workflowType }, 'No active workflow found')
        return
      }

      await axios.post(workflow.webhookUrl, {
        workspaceId,
        ...data,
      })

      logger.info({ workspaceId, workflowType }, 'Workflow triggered')
    } catch (error) {
      logger.error({ error, workspaceId, workflowType }, 'Failed to trigger workflow')
      throw error
    }
  }

  /**
   * Deactivate workflow
   */
  async deactivateWorkflow(workspaceId: string, workflowId: string): Promise<void> {
    try {
      await prisma.n8nWorkflow.update({
        where: { workflowId },
        data: { active: false },
      })

      logger.info({ workspaceId, workflowId }, 'Workflow deactivated')

      await auditService.logProvisioning(
        workspaceId,
        'n8n.workflow.deactivate',
        'n8n_workflow',
        workflowId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId, workflowId }, 'Failed to deactivate workflow')
      throw error
    }
  }

  /**
   * Get all workflows for a workspace
   */
  async getWorkspaceWorkflows(workspaceId: string) {
    return prisma.n8nWorkflow.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Create default workflows for a new workspace
   */
  async createDefaultWorkflows(workspaceId: string): Promise<void> {
    try {
      logger.info({ workspaceId }, 'Creating default workflows')

      const defaultWorkflows: WorkflowConfig[] = [
        {
          workspaceId,
          workflowType: 'lead_followup',
          name: 'Lead Follow-up Automation',
        },
        {
          workspaceId,
          workflowType: 'missed_call',
          name: 'Missed Call Handler',
        },
        {
          workspaceId,
          workflowType: 'whatsapp_reply',
          name: 'WhatsApp Auto-Reply',
        },
        {
          workspaceId,
          workflowType: 'email_reply',
          name: 'Email Auto-Reply',
        },
        {
          workspaceId,
          workflowType: 'calendar_reminder',
          name: 'Calendar Reminders',
        },
      ]

      for (const workflow of defaultWorkflows) {
        await this.activateWorkflow(workflow)
      }

      logger.info({ workspaceId, count: defaultWorkflows.length }, 'Default workflows created')
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to create default workflows')
      throw error
    }
  }
}

export const n8nWorkflowService = new N8nWorkflowService()
