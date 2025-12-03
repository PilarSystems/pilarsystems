/**
 * Multi-Channel Communication Types
 * Unified types for WhatsApp, SMS (Twilio), and Email communication
 */

export type ChannelType = 'whatsapp' | 'sms' | 'email'

export type MessageStatus = 
  | 'pending' 
  | 'queued' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed' 
  | 'bounced'

export type DeliveryPriority = 'high' | 'normal' | 'low'

/**
 * Unified message structure for all channels
 */
export interface UnifiedMessage {
  id?: string
  workspaceId: string
  leadId?: string
  channel: ChannelType
  to: string
  from?: string
  content: string
  subject?: string // For email
  html?: string // For email
  templateId?: string
  templateVariables?: Record<string, string>
  metadata?: Record<string, unknown>
  priority?: DeliveryPriority
  scheduledAt?: Date
}

/**
 * Message delivery result
 */
export interface MessageDeliveryResult {
  success: boolean
  messageId?: string
  externalId?: string
  channel: ChannelType
  status: MessageStatus
  timestamp: Date
  error?: string
  metadata?: Record<string, unknown>
}

/**
 * Channel sequence step for multi-step campaigns
 */
export interface SequenceStep {
  id: string
  order: number
  channel: ChannelType
  templateId?: string
  content?: string
  subject?: string // For email
  delayMinutes: number
  conditions?: SequenceCondition[]
}

/**
 * Conditions for sequence branching
 */
export interface SequenceCondition {
  type: 'message_status' | 'response_received' | 'time_elapsed' | 'lead_status'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: string
}

/**
 * Multi-channel sequence definition
 */
export interface ChannelSequence {
  id: string
  workspaceId: string
  name: string
  description?: string
  steps: SequenceStep[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Sequence execution state
 */
export interface SequenceExecution {
  id: string
  sequenceId: string
  workspaceId: string
  leadId: string
  currentStepIndex: number
  status: 'active' | 'completed' | 'paused' | 'cancelled' | 'failed'
  startedAt: Date
  completedAt?: Date
  lastStepAt?: Date
  nextStepAt?: Date
  metadata?: Record<string, unknown>
}

/**
 * Message analytics data
 */
export interface MessageAnalytics {
  workspaceId: string
  channel: ChannelType
  period: 'hour' | 'day' | 'week' | 'month'
  startDate: Date
  endDate: Date
  metrics: {
    sent: number
    delivered: number
    read: number
    failed: number
    bounced: number
    responseRate: number
    avgDeliveryTimeMs: number
  }
}

/**
 * Channel configuration for a workspace
 */
export interface ChannelConfig {
  workspaceId: string
  channel: ChannelType
  enabled: boolean
  defaultSender?: string
  rateLimit?: {
    maxPerMinute: number
    maxPerHour: number
    maxPerDay: number
  }
  templates?: MessageTemplate[]
}

/**
 * Message template definition
 */
export interface MessageTemplate {
  id: string
  name: string
  channel: ChannelType
  content: string
  subject?: string // For email
  variables: string[] // List of variable names like {{name}}, {{date}}
  active: boolean
}

/**
 * Communication preferences for a lead
 */
export interface CommunicationPreferences {
  leadId: string
  preferredChannel?: ChannelType
  optOutChannels: ChannelType[]
  quietHoursStart?: string // HH:MM format
  quietHoursEnd?: string // HH:MM format
  timezone?: string
}

/**
 * Webhook status update from external services
 */
export interface StatusWebhook {
  source: 'whatsapp' | 'twilio' | 'sendgrid' | 'mailgun'
  externalId: string
  status: MessageStatus
  timestamp: Date
  errorCode?: string
  errorMessage?: string
  metadata?: Record<string, unknown>
}
