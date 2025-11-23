/**
 * Workflow Types
 * 
 * TypeScript types for the Studio Automations (Workflow Engine).
 */

import { Channel, Intent, Module } from '../orchestrator/orchestrator.types'

export enum TriggerType {
  VOICE_CALL = 'voice_call',
  WHATSAPP_MESSAGE = 'whatsapp_message',
  EMAIL_RECEIVED = 'email_received',
  WEB_CHAT = 'web_chat',
  SMS_RECEIVED = 'sms_received',
  INTENT_DETECTED = 'intent_detected',
  TIME_BASED = 'time_based',
  MISSED_CALL = 'missed_call',
  LEAD_CREATED = 'lead_created',
  BOOKING_CREATED = 'booking_created',
}

export enum ConditionType {
  KEYWORD_MATCH = 'keyword_match',
  INTENT_MATCH = 'intent_match',
  SENDER_MATCH = 'sender_match',
  TIME_RANGE = 'time_range',
  DAY_OF_WEEK = 'day_of_week',
  CONFIDENCE_THRESHOLD = 'confidence_threshold',
  CHANNEL_MATCH = 'channel_match',
  CUSTOM_FIELD = 'custom_field',
}

export enum ActionType {
  SEND_MESSAGE = 'send_message',
  SEND_WHATSAPP = 'send_whatsapp',
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  ASK_AI = 'ask_ai',
  GENERATE_WORKOUT_PLAN = 'generate_workout_plan',
  SCHEDULE_FOLLOW_UP = 'schedule_follow_up',
  CREATE_LEAD = 'create_lead',
  UPDATE_LEAD = 'update_lead',
  CALL_WEBHOOK = 'call_webhook',
  WAIT = 'wait',
  BRANCH = 'branch',
}

export interface WorkflowTrigger {
  type: TriggerType
  config: {
    channel?: Channel
    intent?: Intent
    schedule?: string
    event?: string
    [key: string]: any
  }
}

export interface WorkflowCondition {
  type: ConditionType
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
  field?: string
}

export interface WorkflowAction {
  id: string
  type: ActionType
  config: {
    message?: string
    channel?: Channel
    recipient?: string
    prompt?: string
    webhookUrl?: string
    delay?: number
    nextActionId?: string
    conditions?: WorkflowCondition[]
    [key: string]: any
  }
  nextActionId?: string | null
}

export interface Workflow {
  id: string
  tenantId: string
  name: string
  description?: string
  enabled: boolean
  trigger: WorkflowTrigger
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  createdAt: Date
  updatedAt: Date
  lastRunAt?: Date
  runCount: number
  successCount: number
  errorCount: number
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  tenantId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  error?: string
  context: {
    trigger: any
    variables: Record<string, any>
    results: Record<string, any>
  }
}

export interface WorkflowContext {
  tenantId: string
  workflowId: string
  executionId: string
  trigger: {
    type: TriggerType
    data: any
  }
  variables: Record<string, any>
  results: Record<string, any>
}

export interface WorkflowRunResult {
  success: boolean
  executionId: string
  actionsExecuted: number
  error?: string
  results: Record<string, any>
}
