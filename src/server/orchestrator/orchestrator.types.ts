/**
 * Orchestrator Types
 * 
 * TypeScript types for the AI Orchestrator (KI-BRAIN).
 */

export enum Channel {
  WHATSAPP = 'whatsapp',
  VOICE = 'voice',
  EMAIL = 'email',
  WEB = 'web',
  SMS = 'sms',
}

export enum Intent {
  TRAINING_PLAN = 'training_plan',
  BOOKING = 'booking',
  GYM_BUDDY = 'gym_buddy',
  LEAD_QUALIFICATION = 'lead_qualification',
  VOICE_CALL = 'voice_call',
  GENERAL_QUESTION = 'general_question',
  FALLBACK = 'fallback',
}

export enum Module {
  TRAINING_PLAN_ENGINE = 'training_plan_engine',
  BOOKING_ENGINE = 'booking_engine',
  WHATSAPP_ENGINE = 'whatsapp_engine',
  VOICE_ENGINE = 'voice_engine',
  GENERAL_AI = 'general_ai',
}

export interface RawMessage {
  channel: Channel
  payload: any
  timestamp: Date
  tenantId?: string
  userId?: string
}

export interface NormalizedMessage {
  id: string
  channel: Channel
  content: string
  metadata: {
    tenantId?: string
    userId?: string
    userName?: string
    phoneNumber?: string
    email?: string
    timestamp: Date
    raw: any
  }
}

export interface IntentDetectionResult {
  intent: Intent
  confidence: number
  entities: Record<string, any>
  reasoning?: string
}

export interface AIContext {
  tenantId?: string
  tenant?: {
    name: string
    domain?: string
  }
  user?: {
    id?: string
    name?: string
    email?: string
    phoneNumber?: string
  }
  messageHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  intent: IntentDetectionResult
  additionalContext?: Record<string, any>
}

export interface RoutingDecision {
  module: Module
  intent: Intent
  params: Record<string, any>
}

export interface AIResponse {
  content: string
  metadata: {
    module: Module
    intent: Intent
    confidence: number
    processingTime: number
  }
  actions?: Array<{
    type: string
    params: Record<string, any>
  }>
  data?: any
}

export interface OrchestratorResult {
  success: boolean
  message: NormalizedMessage
  intent: IntentDetectionResult
  routing: RoutingDecision
  response: AIResponse
  error?: string
}
