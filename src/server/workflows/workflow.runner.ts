/**
 * Workflow Runner
 * 
 * Executes workflows based on triggers and conditions.
 */

import { orchestrate } from '../orchestrator/orchestrator.service'
import { Channel, Intent } from '../orchestrator/orchestrator.types'
import {
  Workflow,
  WorkflowContext,
  WorkflowRunResult,
  WorkflowCondition,
  WorkflowAction,
  TriggerType,
  ConditionType,
  ActionType,
} from './workflow.types'
import {
  createExecution,
  updateExecution,
  incrementWorkflowRun,
  getWorkflowsByTrigger,
} from './workflow.service'

export async function runWorkflowsForTrigger(
  tenantId: string,
  triggerType: TriggerType,
  triggerData: any
): Promise<WorkflowRunResult[]> {
  const workflows = getWorkflowsByTrigger(tenantId, triggerType)
  
  const results: WorkflowRunResult[] = []
  
  for (const workflow of workflows) {
    try {
      const result = await runWorkflow(workflow, triggerData)
      results.push(result)
    } catch (error) {
      console.error(`[Workflow] Error running workflow ${workflow.id}:`, error)
      results.push({
        success: false,
        executionId: '',
        actionsExecuted: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: {},
      })
    }
  }
  
  return results
}

export async function runWorkflow(
  workflow: Workflow,
  triggerData: any
): Promise<WorkflowRunResult> {
  const execution = createExecution(workflow.tenantId, workflow.id, triggerData)
  
  try {
    updateExecution(workflow.tenantId, execution.id, {
      status: 'running',
    })

    const context: WorkflowContext = {
      tenantId: workflow.tenantId,
      workflowId: workflow.id,
      executionId: execution.id,
      trigger: {
        type: workflow.trigger.type,
        data: triggerData,
      },
      variables: {},
      results: {},
    }

    const conditionsMet = await evaluateConditions(workflow.conditions, context)
    
    if (!conditionsMet) {
      updateExecution(workflow.tenantId, execution.id, {
        status: 'completed',
        completedAt: new Date(),
        context: {
          results: { conditionsMet: false },
        },
      })
      
      incrementWorkflowRun(workflow.tenantId, workflow.id, true)
      
      return {
        success: true,
        executionId: execution.id,
        actionsExecuted: 0,
        results: { conditionsMet: false },
      }
    }

    let actionsExecuted = 0
    const actionResults: Record<string, any> = {}

    for (const action of workflow.actions) {
      try {
        const result = await executeAction(action, context)
        actionResults[action.id] = result
        context.results[action.id] = result
        actionsExecuted++
      } catch (error) {
        console.error(`[Workflow] Error executing action ${action.id}:`, error)
        actionResults[action.id] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    }

    updateExecution(workflow.tenantId, execution.id, {
      status: 'completed',
      completedAt: new Date(),
      context: {
        results: actionResults,
      },
    })
    
    incrementWorkflowRun(workflow.tenantId, workflow.id, true)

    return {
      success: true,
      executionId: execution.id,
      actionsExecuted,
      results: actionResults,
    }
  } catch (error) {
    console.error(`[Workflow] Error running workflow ${workflow.id}:`, error)
    
    updateExecution(workflow.tenantId, execution.id, {
      status: 'failed',
      completedAt: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    incrementWorkflowRun(workflow.tenantId, workflow.id, false)

    return {
      success: false,
      executionId: execution.id,
      actionsExecuted: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: {},
    }
  }
}

async function evaluateConditions(
  conditions: WorkflowCondition[],
  context: WorkflowContext
): Promise<boolean> {
  if (conditions.length === 0) {
    return true
  }

  for (const condition of conditions) {
    const result = await evaluateCondition(condition, context)
    if (!result) {
      return false
    }
  }

  return true
}

async function evaluateCondition(
  condition: WorkflowCondition,
  context: WorkflowContext
): Promise<boolean> {
  const { type, operator, value, field } = condition

  let actualValue: any

  switch (type) {
    case ConditionType.KEYWORD_MATCH:
      actualValue = context.trigger.data.content || context.trigger.data.text || ''
      break

    case ConditionType.INTENT_MATCH:
      actualValue = context.trigger.data.intent
      break

    case ConditionType.SENDER_MATCH:
      actualValue = context.trigger.data.from || context.trigger.data.sender
      break

    case ConditionType.TIME_RANGE:
      actualValue = new Date().getHours()
      break

    case ConditionType.DAY_OF_WEEK:
      actualValue = new Date().getDay()
      break

    case ConditionType.CONFIDENCE_THRESHOLD:
      actualValue = context.trigger.data.intentConfidence || 0
      break

    case ConditionType.CHANNEL_MATCH:
      actualValue = context.trigger.data.channel
      break

    case ConditionType.CUSTOM_FIELD:
      if (field) {
        actualValue = context.trigger.data[field]
      }
      break

    default:
      return false
  }

  return compareValues(actualValue, operator, value)
}

function compareValues(
  actualValue: any,
  operator: string,
  expectedValue: any
): boolean {
  switch (operator) {
    case 'equals':
      return actualValue === expectedValue

    case 'contains':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
        return actualValue.toLowerCase().includes(expectedValue.toLowerCase())
      }
      return false

    case 'starts_with':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
        return actualValue.toLowerCase().startsWith(expectedValue.toLowerCase())
      }
      return false

    case 'ends_with':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
        return actualValue.toLowerCase().endsWith(expectedValue.toLowerCase())
      }
      return false

    case 'greater_than':
      return Number(actualValue) > Number(expectedValue)

    case 'less_than':
      return Number(actualValue) < Number(expectedValue)

    case 'in':
      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(actualValue)
      }
      return false

    case 'not_in':
      if (Array.isArray(expectedValue)) {
        return !expectedValue.includes(actualValue)
      }
      return true

    default:
      return false
  }
}

async function executeAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { type, config } = action

  switch (type) {
    case ActionType.SEND_MESSAGE:
    case ActionType.SEND_WHATSAPP:
    case ActionType.SEND_EMAIL:
    case ActionType.SEND_SMS:
      return await executeSendMessageAction(action, context)

    case ActionType.ASK_AI:
      return await executeAskAIAction(action, context)

    case ActionType.GENERATE_WORKOUT_PLAN:
      return await executeGenerateWorkoutPlanAction(action, context)

    case ActionType.SCHEDULE_FOLLOW_UP:
      return await executeScheduleFollowUpAction(action, context)

    case ActionType.CREATE_LEAD:
      return await executeCreateLeadAction(action, context)

    case ActionType.UPDATE_LEAD:
      return await executeUpdateLeadAction(action, context)

    case ActionType.CALL_WEBHOOK:
      return await executeCallWebhookAction(action, context)

    case ActionType.WAIT:
      return await executeWaitAction(action, context)

    case ActionType.BRANCH:
      return await executeBranchAction(action, context)

    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

async function executeSendMessageAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { message, channel, recipient } = action.config

  console.log(`[Workflow] Send message action:`, {
    channel,
    recipient,
    message: message?.substring(0, 50),
  })

  return {
    success: true,
    action: 'send_message',
    channel,
    recipient,
    messageSent: true,
  }
}

async function executeAskAIAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { prompt, channel } = action.config

  const result = await orchestrate({
    channel: (channel as Channel) || Channel.WEB,
    payload: {
      text: prompt || context.trigger.data.content || context.trigger.data.text,
      from: context.trigger.data.from || 'workflow',
    },
    timestamp: new Date(),
    tenantId: context.tenantId,
  })

  return {
    success: true,
    action: 'ask_ai',
    intent: result.intent.intent,
    confidence: result.intent.confidence,
    response: result.response?.content,
  }
}

async function executeGenerateWorkoutPlanAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const result = await orchestrate({
    channel: Channel.WEB,
    payload: {
      text: 'Erstelle einen personalisierten Trainingsplan',
      from: context.trigger.data.from || 'workflow',
    },
    timestamp: new Date(),
    tenantId: context.tenantId,
  })

  return {
    success: true,
    action: 'generate_workout_plan',
    plan: result.response?.content,
  }
}

async function executeScheduleFollowUpAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { delay, message } = action.config

  console.log(`[Workflow] Schedule follow-up:`, {
    delay,
    message: message?.substring(0, 50),
  })

  return {
    success: true,
    action: 'schedule_follow_up',
    scheduledAt: new Date(Date.now() + (delay || 0)),
  }
}

async function executeCreateLeadAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { name, email, phone, source } = action.config

  console.log(`[Workflow] Create lead:`, {
    name,
    email,
    phone,
    source,
  })

  return {
    success: true,
    action: 'create_lead',
    leadId: `lead-${Date.now()}`,
  }
}

async function executeUpdateLeadAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { leadId, updates } = action.config

  console.log(`[Workflow] Update lead:`, {
    leadId,
    updates,
  })

  return {
    success: true,
    action: 'update_lead',
    leadId,
  }
}

async function executeCallWebhookAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { webhookUrl, method = 'POST', headers = {}, body } = action.config

  if (!webhookUrl) {
    return {
      success: false,
      action: 'call_webhook',
      error: 'Webhook URL is required',
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    return {
      success: true,
      action: 'call_webhook',
      status: response.status,
      data,
    }
  } catch (error) {
    return {
      success: false,
      action: 'call_webhook',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function executeWaitAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { delay = 0 } = action.config

  await new Promise(resolve => setTimeout(resolve, delay))

  return {
    success: true,
    action: 'wait',
    delay,
  }
}

async function executeBranchAction(
  action: WorkflowAction,
  context: WorkflowContext
): Promise<any> {
  const { conditions, nextActionId } = action.config

  if (conditions && conditions.length > 0) {
    const conditionsMet = await evaluateConditions(conditions, context)
    
    return {
      success: true,
      action: 'branch',
      conditionsMet,
      nextActionId: conditionsMet ? nextActionId : null,
    }
  }

  return {
    success: true,
    action: 'branch',
    nextActionId,
  }
}
