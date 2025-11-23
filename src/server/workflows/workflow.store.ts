/**
 * Workflow Store
 * 
 * In-memory store for workflows with tenant isolation.
 * For production, this should be replaced with Prisma database storage.
 */

import { Workflow, WorkflowExecution } from './workflow.types'

class WorkflowStore {
  private workflows: Map<string, Workflow[]> = new Map()
  private executions: Map<string, WorkflowExecution[]> = new Map()

  append(workflow: Workflow): void {
    const tenantWorkflows = this.workflows.get(workflow.tenantId) || []
    
    const existingIndex = tenantWorkflows.findIndex(w => w.id === workflow.id)
    if (existingIndex >= 0) {
      tenantWorkflows[existingIndex] = workflow
    } else {
      tenantWorkflows.push(workflow)
    }
    
    this.workflows.set(workflow.tenantId, tenantWorkflows)
  }

  getWorkflows(tenantId: string): Workflow[] {
    return this.workflows.get(tenantId) || []
  }

  getWorkflowById(tenantId: string, workflowId: string): Workflow | undefined {
    const tenantWorkflows = this.workflows.get(tenantId) || []
    return tenantWorkflows.find(w => w.id === workflowId)
  }

  deleteWorkflow(tenantId: string, workflowId: string): boolean {
    const tenantWorkflows = this.workflows.get(tenantId) || []
    const filteredWorkflows = tenantWorkflows.filter(w => w.id !== workflowId)
    
    if (filteredWorkflows.length < tenantWorkflows.length) {
      this.workflows.set(tenantId, filteredWorkflows)
      return true
    }
    
    return false
  }

  updateWorkflow(workflow: Workflow): boolean {
    const tenantWorkflows = this.workflows.get(workflow.tenantId) || []
    const index = tenantWorkflows.findIndex(w => w.id === workflow.id)
    
    if (index >= 0) {
      tenantWorkflows[index] = workflow
      this.workflows.set(workflow.tenantId, tenantWorkflows)
      return true
    }
    
    return false
  }

  getEnabledWorkflows(tenantId: string): Workflow[] {
    const tenantWorkflows = this.workflows.get(tenantId) || []
    return tenantWorkflows.filter(w => w.enabled)
  }

  addExecution(execution: WorkflowExecution): void {
    const tenantExecutions = this.executions.get(execution.tenantId) || []
    tenantExecutions.unshift(execution)
    
    if (tenantExecutions.length > 1000) {
      tenantExecutions.pop()
    }
    
    this.executions.set(execution.tenantId, tenantExecutions)
  }

  getExecutions(tenantId: string, workflowId?: string): WorkflowExecution[] {
    const tenantExecutions = this.executions.get(tenantId) || []
    
    if (workflowId) {
      return tenantExecutions.filter(e => e.workflowId === workflowId)
    }
    
    return tenantExecutions
  }

  getExecutionById(tenantId: string, executionId: string): WorkflowExecution | undefined {
    const tenantExecutions = this.executions.get(tenantId) || []
    return tenantExecutions.find(e => e.id === executionId)
  }

  updateExecution(execution: WorkflowExecution): boolean {
    const tenantExecutions = this.executions.get(execution.tenantId) || []
    const index = tenantExecutions.findIndex(e => e.id === execution.id)
    
    if (index >= 0) {
      tenantExecutions[index] = execution
      this.executions.set(execution.tenantId, tenantExecutions)
      return true
    }
    
    return false
  }

  clearWorkflows(tenantId: string): void {
    this.workflows.delete(tenantId)
  }

  clearExecutions(tenantId: string): void {
    this.executions.delete(tenantId)
  }

  getWorkflowCount(tenantId: string): number {
    return (this.workflows.get(tenantId) || []).length
  }

  getExecutionCount(tenantId: string): number {
    return (this.executions.get(tenantId) || []).length
  }

  getTenantIds(): string[] {
    return Array.from(this.workflows.keys())
  }
}

let workflowStoreInstance: WorkflowStore | null = null

export function getWorkflowStore(): WorkflowStore {
  if (!workflowStoreInstance) {
    workflowStoreInstance = new WorkflowStore()
  }
  return workflowStoreInstance
}
