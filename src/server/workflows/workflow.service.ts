/**
 * Workflow Service
 * 
 * Service for creating and managing workflows.
 */

import { v4 as uuidv4 } from 'uuid'
import { Workflow, WorkflowTrigger, WorkflowCondition, WorkflowAction, WorkflowExecution, TriggerType } from './workflow.types'
import { getWorkflowStore } from './workflow.store'

const workflowStore = getWorkflowStore()

export function createWorkflow(
  tenantId: string,
  name: string,
  trigger: WorkflowTrigger,
  conditions: WorkflowCondition[],
  actions: WorkflowAction[],
  options?: {
    description?: string
    enabled?: boolean
  }
): Workflow {
  const workflow: Workflow = {
    id: uuidv4(),
    tenantId,
    name,
    description: options?.description,
    enabled: options?.enabled ?? true,
    trigger,
    conditions,
    actions,
    createdAt: new Date(),
    updatedAt: new Date(),
    runCount: 0,
    successCount: 0,
    errorCount: 0,
  }

  workflowStore.append(workflow)
  return workflow
}

export function updateWorkflow(
  tenantId: string,
  workflowId: string,
  updates: {
    name?: string
    description?: string
    enabled?: boolean
    trigger?: WorkflowTrigger
    conditions?: WorkflowCondition[]
    actions?: WorkflowAction[]
  }
): Workflow | null {
  const workflow = workflowStore.getWorkflowById(tenantId, workflowId)
  
  if (!workflow) {
    return null
  }

  const updatedWorkflow: Workflow = {
    ...workflow,
    ...updates,
    updatedAt: new Date(),
  }

  workflowStore.updateWorkflow(updatedWorkflow)
  return updatedWorkflow
}

export function deleteWorkflow(tenantId: string, workflowId: string): boolean {
  return workflowStore.deleteWorkflow(tenantId, workflowId)
}

export function getWorkflow(tenantId: string, workflowId: string): Workflow | undefined {
  return workflowStore.getWorkflowById(tenantId, workflowId)
}

export function getWorkflows(tenantId: string, enabledOnly: boolean = false): Workflow[] {
  if (enabledOnly) {
    return workflowStore.getEnabledWorkflows(tenantId)
  }
  return workflowStore.getWorkflows(tenantId)
}

export function getWorkflowsByTrigger(tenantId: string, triggerType: TriggerType): Workflow[] {
  const workflows = workflowStore.getEnabledWorkflows(tenantId)
  return workflows.filter(w => w.trigger.type === triggerType)
}

export function createExecution(
  tenantId: string,
  workflowId: string,
  triggerData: any
): WorkflowExecution {
  const execution: WorkflowExecution = {
    id: uuidv4(),
    workflowId,
    tenantId,
    status: 'pending',
    startedAt: new Date(),
    context: {
      trigger: triggerData,
      variables: {},
      results: {},
    },
  }

  workflowStore.addExecution(execution)
  return execution
}

export function updateExecution(
  tenantId: string,
  executionId: string,
  updates: {
    status?: 'pending' | 'running' | 'completed' | 'failed'
    completedAt?: Date
    error?: string
    context?: {
      trigger?: any
      variables?: Record<string, any>
      results?: Record<string, any>
    }
  }
): WorkflowExecution | null {
  const execution = workflowStore.getExecutionById(tenantId, executionId)
  
  if (!execution) {
    return null
  }

  const updatedExecution: WorkflowExecution = {
    ...execution,
    ...updates,
    context: {
      ...execution.context,
      ...updates.context,
    },
  }

  workflowStore.updateExecution(updatedExecution)
  return updatedExecution
}

export function getExecution(tenantId: string, executionId: string): WorkflowExecution | undefined {
  return workflowStore.getExecutionById(tenantId, executionId)
}

export function getExecutions(tenantId: string, workflowId?: string): WorkflowExecution[] {
  return workflowStore.getExecutions(tenantId, workflowId)
}

export function incrementWorkflowRun(tenantId: string, workflowId: string, success: boolean): void {
  const workflow = workflowStore.getWorkflowById(tenantId, workflowId)
  
  if (!workflow) {
    return
  }

  const updatedWorkflow: Workflow = {
    ...workflow,
    runCount: workflow.runCount + 1,
    successCount: success ? workflow.successCount + 1 : workflow.successCount,
    errorCount: success ? workflow.errorCount : workflow.errorCount + 1,
    lastRunAt: new Date(),
  }

  workflowStore.updateWorkflow(updatedWorkflow)
}

export function getWorkflowStats(tenantId: string): {
  totalWorkflows: number
  enabledWorkflows: number
  totalExecutions: number
  successRate: number
} {
  const workflows = workflowStore.getWorkflows(tenantId)
  const enabledWorkflows = workflows.filter(w => w.enabled)
  const executions = workflowStore.getExecutions(tenantId)
  
  const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0)
  const totalSuccess = workflows.reduce((sum, w) => sum + w.successCount, 0)
  const successRate = totalRuns > 0 ? totalSuccess / totalRuns : 0

  return {
    totalWorkflows: workflows.length,
    enabledWorkflows: enabledWorkflows.length,
    totalExecutions: executions.length,
    successRate,
  }
}
