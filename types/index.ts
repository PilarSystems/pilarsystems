import { 
  User, 
  Workspace, 
  Subscription, 
  Lead, 
  Message, 
  CallLog, 
  CalendarEvent,
  Task,
  Followup,
  AiRule,
  ActivityLog,
  Integration,
  WizardProgress,
  Plan,
  SubscriptionStatus,
  LeadClassification,
  LeadStatus,
  LeadSource,
  Priority,
  MessageChannel,
  MessageDirection,
  CallDirection,
  CallStatus,
  FollowupStatus,
  CalendarEventType,
  EventStatus,
  RuleType,
  IntegrationType,
  IntegrationStatus,
  TaskStatus
} from '@prisma/client'

export type {
  User,
  Workspace,
  Subscription,
  Lead,
  Message,
  CallLog,
  CalendarEvent,
  Task,
  Followup,
  AiRule,
  ActivityLog,
  Integration,
  WizardProgress,
  Plan,
  SubscriptionStatus,
  LeadClassification,
  LeadStatus,
  LeadSource,
  Priority,
  MessageChannel,
  MessageDirection,
  CallDirection,
  CallStatus,
  FollowupStatus,
  CalendarEventType,
  EventStatus,
  RuleType,
  IntegrationType,
  IntegrationStatus,
  TaskStatus
}

export interface LeadWithRelations extends Lead {
  messages?: Message[]
  callLogs?: CallLog[]
  followups?: Followup[]
  calendarEvents?: CalendarEvent[]
  tasks?: Task[]
  assignedTo?: User | null
}

export interface WorkspaceWithRelations extends Workspace {
  subscription?: Subscription | null
  users?: User[]
  leads?: Lead[]
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  convertedLeads: number
  totalRevenue: number
  conversionRate: number
  avgResponseTime: number
}

export interface LeadActivity {
  id: string
  type: 'message' | 'call' | 'task' | 'event' | 'note'
  timestamp: Date
  description: string
  metadata?: any
}

export interface AIClassificationResult {
  classification: LeadClassification
  priority: Priority
  confidence: number
  reasoning: string
  suggestedActions: string[]
}

export interface AIMessageResponse {
  message: string
  shouldSend: boolean
  confidence: number
  reasoning: string
}

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text: {
            body: string
          }
          type: string
        }>
      }
      field: string
    }>
  }>
}

export interface TwilioWebhookPayload {
  CallSid: string
  From: string
  To: string
  CallStatus: string
  Direction: string
  RecordingUrl?: string
  TranscriptionText?: string
}

export interface StripeWebhookPayload {
  id: string
  object: string
  type: string
  data: {
    object: any
  }
}

export interface OnboardingData {
  step1?: {
    studioName: string
    studioType: string
    description: string
    logoUrl?: string
  }
  step2?: {
    address: string
    city: string
    postalCode: string
    country: string
    openingHours: Record<string, { open: string; close: string }>
    phone: string
    email: string
  }
  step3?: {
    plans: Array<{
      name: string
      price: number
      duration: string
      description: string
    }>
    trialOffers: Array<{
      name: string
      price: number
      description: string
    }>
  }
  step4?: {
    whatsappToken: string
    whatsappPhoneNumberId: string
    whatsappBusinessNumber: string
  }
  step5?: {
    twilioAccountSid: string
    twilioAuthToken: string
    twilioPhoneNumber: string
    voicemailEnabled: boolean
  }
  step6?: {
    googleAccessToken: string
    googleRefreshToken: string
    calendarId: string
  }
  step7?: {
    classificationRules: Array<{
      condition: string
      classification: LeadClassification
    }>
    followupSequences: Array<{
      trigger: string
      delay: number
      channel: MessageChannel
      template: string
    }>
    priorityRules: Array<{
      condition: string
      priority: Priority
    }>
  }
}
