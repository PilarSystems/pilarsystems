# PILAR AUTOPILOT v6.0 - Technical Architecture

**Version:** 6.0.0  
**Authors:** Devin AI, PILAR Systems Engineering Team  
**Status:** Architecture Specification  
**Date:** November 2024  
**Baseline:** PR #19 (Operator Runtime + AI-Onboarding Wizard v5.0)

---

## Executive Summary

PILAR AUTOPILOT v6.0 transforms PILAR SYSTEMS into a fully autonomous, multi-tenant AI company that operates without human intervention. After launch, the founder only handles Marketing, Sales, and Support emails while the system manages 100,000+ studios completely automatically.

### Goals
- **Zero Manual Operations**: Complete automation of workspace provisioning, Twilio/WhatsApp setup, AI coaching, affiliate management
- **Multi-Tenant Scale**: Support 10,000+ concurrent studios with isolated resources and budgets
- **Self-Healing**: Automatic error recovery, webhook recreation, queue management, health monitoring
- **Enterprise UX**: Mobile-first, Apple-quality animations, unified toast system, professional error handling

### Constraints
- **Preserve Existing**: All current features must remain functional during transformation
- **Graceful Degradation**: System works even when optional providers (Redis, OpenAI, Twilio) are offline
- **Security First**: OWASP compliance, CSP headers, webhook signature validation, sensitive data masking
- **Performance**: <200ms API responses, <3s page loads, 99.9% uptime

### Success Metrics
- **Operational**: 0 manual interventions per 1000 new customers
- **Performance**: 99.9% uptime, <200ms API response times
- **Scale**: Support 10,000 concurrent studios
- **Quality**: 0 console errors, 100% mobile responsive, Lighthouse score >90

---

## Current State Baseline (PR #19)

### Existing Components
- **Operator Runtime**: `lib/operator/runtime.ts` - Event-driven orchestrator with policy engine
- **AI-Onboarding Wizard**: `lib/onboarding/ai-wizard.ts` - Generates structured JSON rules matching Prisma schema
- **Provisioning Orchestrator**: `lib/autopilot/provisioning-orchestrator.ts` - Manages async provisioning jobs
- **Multi-Tenant Architecture**: Workspace-scoped Prisma queries with tenant isolation

### Existing API Routes
```
/api/operator/run              - Operator Runtime execution
/api/autopilot/scheduler       - Daily scheduler (9am UTC)
/api/autopilot/run             - Autopilot runner (10am UTC) 
/api/autopilot/health          - Health monitoring
/api/autopilot/status          - Status checking
/api/autopilot/reprovision     - Manual reprovisioning
/api/onboarding/ai-wizard      - AI-powered onboarding
/api/onboarding/complete       - Onboarding completion
```

### Existing Database Models
- **Core**: User, Workspace, Subscription, Integration, Lead, Message
- **Automation**: ProvisioningJob, AiRule, ActivityLog, AuditLog, DistributedLock
- **Communications**: TwilioSubaccount, WhatsAppIntegration, Followup, CallLog
- **Business**: Affiliate, AffiliateLink, AffiliateConversion, ContactRequest

### Known Issues
- **Cron Mismatch**: vercel.json points to `/api/autopilot/*` but Operator Runtime is at `/api/operator/run`
- **Missing Event System**: No structured event queue for WhatsApp Coach automation
- **Limited Health Monitoring**: Basic health checks without auto-remediation
- **UI Polish Needed**: Auth contrast issues, missing mobile optimizations, inconsistent toasts

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    PILAR AUTOPILOT v6.0                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 16 + React 19)                              │
│  ├─ Marketing Site (Apple-style animations)                    │
│  ├─ Auth System (white text, error handling)                   │
│  ├─ Dashboard (mobile-first, micro-interactions)               │
│  └─ Affiliate Portal (self-serve, QR codes, analytics)         │
├─────────────────────────────────────────────────────────────────┤
│  API Layer (App Router + Middleware)                           │
│  ├─ Operator Runtime (/api/operator/run)                       │
│  ├─ Autopilot Modules (/api/autopilot/*)                       │
│  ├─ WhatsApp Coach (/api/whatsapp-coach/*)                     │
│  ├─ Health Monitoring (/api/health/*)                          │
│  └─ Webhook Handlers (/api/webhooks/*)                         │
├─────────────────────────────────────────────────────────────────┤
│  Autopilot Backplane                                           │
│  ├─ Event Queue (DB-backed, Redis optional)                    │
│  ├─ Job Scheduler (Vercel Cron + manual triggers)              │
│  ├─ Distributed Locks (Upstash + DB fallback)                  │
│  ├─ Rate Limiting (per-workspace budgets)                      │
│  └─ Audit Trail (ActivityLog + AuditLog)                       │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Modules                                        │
│  ├─ Workspace Autoprovisioning                                 │
│  ├─ Twilio/WhatsApp Autoprovisioning                           │
│  ├─ AI-Agent Orchestrator                                      │
│  ├─ WhatsApp Coach/Buddy Runtime                               │
│  ├─ Self-Healing & Health Monitoring                           │
│  └─ Affiliate Management                                       │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer (PostgreSQL + Prisma)                              │
│  ├─ Multi-Tenant Tables (workspaceId scoped)                   │
│  ├─ Event/Job Tables (AutopilotEvent, AutopilotJob)            │
│  ├─ Health Tables (HealthCheck, Incident)                      │
│  └─ Audit Tables (ActivityLog, AuditLog)                       │
├─────────────────────────────────────────────────────────────────┤
│  External Integrations                                         │
│  ├─ Stripe (subscriptions, webhooks)                           │
│  ├─ Twilio (subaccounts, numbers, SMS)                         │
│  ├─ WhatsApp Cloud API (messaging, webhooks)                   │
│  ├─ OpenAI/Groq/Anthropic (AI models)                          │
│  ├─ ElevenLabs (voice selection)                               │
│  └─ Upstash Redis (optional caching/rate limiting)             │
└─────────────────────────────────────────────────────────────────┘
```

### Request Lifecycle

#### 1. New Customer Signup
```
User Signup → Stripe Checkout → Webhook → Workspace Autoprovisioning
    ↓
Workspace Created → AI-Agent Defaults → Twilio Provisioning → WhatsApp Setup
    ↓
Coach Events Scheduled → Health Monitoring Active → Customer Ready
```

#### 2. WhatsApp Message Processing
```
WhatsApp Webhook → Message Validation → Lead Identification → AI Rule Evaluation
    ↓
Response Generation → Rate Limit Check → Message Sending → Activity Logging
    ↓
Coach Event Scheduling → Follow-up Planning → Health Status Update
```

#### 3. Operator Runtime Cycle
```
Vercel Cron Trigger → Operator Scan (100 workspaces) → Policy Evaluation
    ↓
Action Queue Generation → Distributed Lock Acquisition → Action Execution
    ↓
Health Checks → Self-Healing → Budget Enforcement → Audit Logging
```

### Multi-Tenant Boundaries

#### Workspace Isolation
- **Database**: All queries scoped by `workspaceId` via Prisma client extension
- **Resources**: Per-workspace budgets (daily messages, tokens, API calls)
- **Policies**: Per-workspace AI rules, rate limits, feature flags
- **Security**: Webhook signatures validated per workspace

#### Resource Budgets
```typescript
interface WorkspaceBudget {
  dailyMessages: number      // WhatsApp messages per day
  dailyTokens: number        // AI tokens per day  
  dailyApiCalls: number      // External API calls per day
  resetAt: Date              // Budget reset timestamp
  overagePolicy: 'queue' | 'drop' | 'degrade'
}
```

---

## Autopilot Backplane

The shared infrastructure layer that all v6 modules use for consistency and reliability.

### Event System

#### AutopilotEvent Table
```sql
CREATE TABLE AutopilotEvent (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NOT NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  type            VARCHAR(100) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  scheduledAt     TIMESTAMP NOT NULL DEFAULT NOW(),
  attempts        INTEGER DEFAULT 0,
  maxAttempts     INTEGER DEFAULT 3,
  idempotencyKey  VARCHAR(255) UNIQUE NOT NULL,
  lockedAt        TIMESTAMP NULL,
  lockedBy        VARCHAR(100) NULL,
  error           TEXT NULL,
  processedAt     TIMESTAMP NULL,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_autopilot_event_workspace_status ON AutopilotEvent(workspaceId, status);
CREATE INDEX idx_autopilot_event_scheduled ON AutopilotEvent(scheduledAt) WHERE status = 'pending';
CREATE INDEX idx_autopilot_event_type ON AutopilotEvent(type, status);
```

#### Event Types
```typescript
type EventType = 
  // WhatsApp Coach Events
  | 'coach.morning_nudge'
  | 'coach.missed_training_nudge' 
  | 'coach.weekly_checkin'
  | 'coach.goal_progress_report'
  | 'coach.nutrition_reminder'
  | 'coach.motivation_message'
  
  // Health Monitoring Events
  | 'health.webhook_check'
  | 'health.queue_check'
  | 'health.rate_limit_check'
  | 'health.integration_check'
  | 'health.ai_provider_check'
  
  // Provisioning Events
  | 'provisioning.workspace_setup'
  | 'provisioning.twilio_retry'
  | 'provisioning.whatsapp_retry'
  | 'provisioning.webhook_recreate'
  
  // Support Events
  | 'support.auto_reply_request'
  | 'support.escalation_needed'
  | 'support.incident_created'
```

### Job Queue System

#### AutopilotJob Table
```sql
CREATE TABLE AutopilotJob (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NOT NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  type            VARCHAR(100) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  priority        INTEGER DEFAULT 5,
  attempts        INTEGER DEFAULT 0,
  maxAttempts     INTEGER DEFAULT 3,
  scheduledAt     TIMESTAMP NOT NULL DEFAULT NOW(),
  startedAt       TIMESTAMP NULL,
  completedAt     TIMESTAMP NULL,
  idempotencyKey  VARCHAR(255) UNIQUE NOT NULL,
  lockedAt        TIMESTAMP NULL,
  lockedBy        VARCHAR(100) NULL,
  result          JSONB NULL,
  error           TEXT NULL,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_autopilot_job_workspace_status ON AutopilotJob(workspaceId, status);
CREATE INDEX idx_autopilot_job_scheduled ON AutopilotJob(scheduledAt, priority) WHERE status = 'pending';
CREATE INDEX idx_autopilot_job_type ON AutopilotJob(type, status);
```

#### Job Processing Flow
```typescript
interface JobProcessor {
  process(job: AutopilotJob): Promise<JobResult>
  retry(job: AutopilotJob, error: Error): Promise<void>
  cleanup(job: AutopilotJob): Promise<void>
}

interface JobResult {
  success: boolean
  result?: any
  error?: string
  reschedule?: Date
}
```

### Distributed Locking

#### Lock Acquisition Strategy
```typescript
class DistributedLockManager {
  async acquireLock(
    key: string, 
    workspaceId: string, 
    ttlMs: number = 30000
  ): Promise<Lock | null> {
    // Try Redis first (if available)
    if (this.redis) {
      const acquired = await this.redis.set(
        `lock:${key}`, 
        workspaceId, 
        'PX', ttlMs, 
        'NX'
      )
      if (acquired) return new RedisLock(key, workspaceId, ttlMs)
    }
    
    // Fallback to database
    try {
      const lock = await prisma.distributedLock.create({
        data: {
          lockKey: key,
          workspaceId,
          scope: 'autopilot',
          expiresAt: new Date(Date.now() + ttlMs)
        }
      })
      return new DatabaseLock(lock)
    } catch (error) {
      if (error.code === 'P2002') return null // Already locked
      throw error
    }
  }
}
```

### Rate Limiting

#### Per-Workspace Budget Enforcement
```typescript
interface WorkspaceBudgetManager {
  async checkBudget(workspaceId: string, resource: ResourceType): Promise<boolean>
  async consumeBudget(workspaceId: string, resource: ResourceType, amount: number): Promise<void>
  async resetBudgets(): Promise<void> // Called daily at midnight
}

type ResourceType = 'messages' | 'tokens' | 'api_calls'

interface BudgetConfig {
  messages: { daily: number, hourly: number }
  tokens: { daily: number, hourly: number }
  apiCalls: { daily: number, hourly: number }
}
```

---

## Module Specifications

## Module 1: Autopilot Backplane

### Goals
- Provide shared infrastructure for all autopilot modules
- Ensure consistent event processing, job queueing, and resource management
- Enable graceful degradation when external services are unavailable

### Data Flow
```
Event Creation → Queue Validation → Idempotency Check → Lock Acquisition → Processing → Result Storage
```

### API Routes
- `POST /api/autopilot/events` - Create new event
- `GET /api/autopilot/events/[workspaceId]` - List workspace events
- `POST /api/autopilot/jobs` - Create new job
- `GET /api/autopilot/jobs/[workspaceId]` - List workspace jobs
- `POST /api/autopilot/locks/acquire` - Acquire distributed lock
- `DELETE /api/autopilot/locks/[lockId]` - Release lock

### Database Models
- **AutopilotEvent**: Event queue with scheduling and retry logic
- **AutopilotJob**: Job queue with priority and idempotency
- **DistributedLock**: Cross-process locking (existing, enhanced)

### Background Jobs
- **Event Processor**: Polls pending events every 30 seconds
- **Job Processor**: Processes jobs by priority and schedule
- **Lock Cleaner**: Removes expired locks every 5 minutes
- **Budget Resetter**: Resets daily budgets at midnight UTC

### Security & Rate Limits
- Events limited to 1000 per workspace per hour
- Jobs limited to 500 per workspace per hour
- Lock acquisition limited to 100 per workspace per minute
- All operations require valid workspace authentication

### Error Scenarios & Recovery
- **Database Unavailable**: Queue operations in memory, flush when available
- **Redis Unavailable**: Fall back to database-only locking
- **High Load**: Implement exponential backoff and circuit breakers
- **Poison Messages**: Dead letter queue after max attempts exceeded

---

## Module 2: Operator Runtime v2

### Goals
- Enhance existing Operator Runtime with multi-tenant policy enforcement
- Implement per-workspace resource budgets and health scoring
- Standardize cron scheduling and manual trigger endpoints

### Data Flow
```
Cron Trigger → Workspace Scan → Policy Evaluation → Budget Check → Action Execution → Health Update → Audit Log
```

### API Routes
- `POST /api/operator/run` - Execute operator cycle (enhanced)
- `GET /api/operator/status` - Operator status and last run info
- `POST /api/operator/trigger/[workspaceId]` - Manual workspace trigger
- `GET /api/operator/policies/[workspaceId]` - Get workspace policies
- `PUT /api/operator/policies/[workspaceId]` - Update workspace policies

### Database Models
```typescript
// Extend Workspace.studioInfo with operator config
interface OperatorConfig {
  enabled: boolean
  policies: {
    whatsapp: { enabled: boolean, dailyLimit: number }
    coach: { enabled: boolean, schedules: CoachSchedule[] }
    followups: { enabled: boolean, maxPerDay: number }
    provisioning: { autoRetry: boolean, maxRetries: number }
  }
  budgets: WorkspaceBudget
  healthScore: number // 0-100
  lastHealthCheck: Date
}

interface CoachSchedule {
  type: EventType
  cron: string // "0 8 * * *" for 8am daily
  enabled: boolean
  timezone: string
}
```

### Background Jobs
- **Operator Cycle**: Runs every hour via Vercel cron
- **Health Scorer**: Calculates workspace health scores every 6 hours
- **Policy Enforcer**: Validates and enforces workspace policies
- **Budget Monitor**: Tracks and enforces resource consumption

### Security & Rate Limits
- Operator runs limited to once per minute per workspace
- Policy updates require workspace owner authentication
- Budget overrides require admin privileges
- All operator actions logged to AuditLog

### Error Scenarios & Recovery
- **Workspace Lock Timeout**: Skip workspace, retry next cycle
- **Policy Evaluation Error**: Use default policies, log incident
- **Budget Exceeded**: Queue actions for next budget reset
- **Health Check Failure**: Mark workspace unhealthy, escalate if critical

---

## Module 3: AI Wizard + Agent Orchestrator

### Goals
- Enhance existing AI-Onboarding Wizard with multi-model support
- Implement per-workspace AI agent policies and model selection
- Add rule composition, priority handling, and A/B testing capabilities

### Data Flow
```
Wizard Input → Model Selection → Rule Generation → Policy Creation → Validation → Storage → Activation
```

### API Routes
- `POST /api/ai-wizard/generate` - Generate AI configuration (enhanced)
- `POST /api/ai-wizard/validate` - Validate generated rules
- `GET /api/ai-agent/config/[workspaceId]` - Get agent configuration
- `PUT /api/ai-agent/config/[workspaceId]` - Update agent configuration
- `POST /api/ai-agent/evaluate` - Dry-run rule evaluation
- `GET /api/ai-agent/analytics/[workspaceId]` - Rule performance analytics

### Database Models
```typescript
// Extend AiRule with v2 features
interface AiRuleV2 {
  id: string
  workspaceId: string
  ruleType: RuleType
  conditions: RuleCondition[]
  actions: RuleAction[]
  priority: number // 1-100, higher = more important
  version: number
  trafficSplit?: number // 0-100 for A/B testing
  analytics: {
    matches: number
    successes: number
    failures: number
    avgLatency: number
    lastFired: Date
  }
  active: boolean
}

interface RuleCondition {
  type: 'keyword_match' | 'sentiment' | 'intent' | 'time_based' | 'lead_property'
  operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than'
  value: any
  weight?: number // For composite conditions
}

interface RuleAction {
  type: 'send_template' | 'send_text' | 'schedule_followup' | 'tag_lead' | 'escalate' | 'call_function'
  parameters: Record<string, any>
  delay?: number // Delay in seconds
}

// New AI Agent Configuration
interface AiAgentConfig {
  workspaceId: string
  provider: 'openai' | 'groq' | 'anthropic'
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  policies: {
    tone: 'professional' | 'friendly' | 'casual' | 'motivational'
    language: string
    responseLength: 'short' | 'medium' | 'long'
    personalityTraits: string[]
  }
  fallbackRules: AiRuleV2[]
  budgetLimits: {
    dailyTokens: number
    maxResponseTime: number
  }
}
```

### Background Jobs
- **Rule Analytics Aggregator**: Calculates rule performance metrics hourly
- **A/B Test Manager**: Manages traffic splits and statistical significance
- **Model Performance Monitor**: Tracks model response times and error rates
- **Policy Optimizer**: Suggests policy improvements based on performance data

### Security & Rate Limits
- AI generation limited to 10 requests per workspace per hour
- Model switching limited to 5 times per workspace per day
- Rule evaluation limited to 1000 per workspace per hour
- All AI interactions logged with token consumption

### Error Scenarios & Recovery
- **Model Provider Unavailable**: Fall back to cached responses or alternative provider
- **Token Limit Exceeded**: Queue requests for next budget reset
- **Rule Evaluation Error**: Use fallback rules, log for debugging
- **Invalid Configuration**: Revert to last known good configuration

---

## Module 4: Workspace Autoprovisioning

### Goals
- Fully automate workspace creation from Stripe webhook to ready-to-use studio
- Create default AI agents, training logic, follow-ups, and calendar integration
- Ensure idempotent provisioning with comprehensive error handling

### Data Flow
```
Stripe Webhook → Customer Validation → Workspace Creation → Default Setup → AI Agent Creation → Integration Setup → Health Check → Activation
```

### API Routes
- `POST /api/provisioning/workspace` - Create new workspace (webhook handler)
- `GET /api/provisioning/workspace/[workspaceId]/status` - Provisioning status
- `POST /api/provisioning/workspace/[workspaceId]/retry` - Retry failed provisioning
- `GET /api/provisioning/workspace/[workspaceId]/defaults` - Get default configuration
- `PUT /api/provisioning/workspace/[workspaceId]/defaults` - Update defaults

### Database Models
```typescript
// Extend ProvisioningJob for workspace setup
interface WorkspaceProvisioningJob extends ProvisioningJob {
  jobType: 'workspace_setup'
  steps: {
    customer_validation: JobStepStatus
    workspace_creation: JobStepStatus
    default_ai_agent: JobStepStatus
    training_logic: JobStepStatus
    followup_templates: JobStepStatus
    calendar_integration: JobStepStatus
    health_monitoring: JobStepStatus
    activation: JobStepStatus
  }
}

interface JobStepStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt?: Date
  completedAt?: Date
  error?: string
  result?: any
}

// Default workspace configuration
interface WorkspaceDefaults {
  aiAgent: {
    provider: 'openai'
    model: 'gpt-4'
    systemPrompt: string
    policies: AiAgentConfig['policies']
  }
  trainingLogic: {
    enabled: boolean
    schedules: TrainingSchedule[]
    templates: MessageTemplate[]
  }
  followups: {
    enabled: boolean
    templates: FollowupTemplate[]
    schedules: FollowupSchedule[]
  }
  calendar: {
    enabled: boolean
    eventTypes: CalendarEventType[]
    defaultDuration: number
    bufferTime: number
  }
}
```

### Background Jobs
- **Workspace Provisioner**: Processes workspace setup jobs
- **Default Template Updater**: Updates default templates based on best practices
- **Provisioning Health Checker**: Monitors provisioning success rates
- **Onboarding Optimizer**: A/B tests different default configurations

### Security & Rate Limits
- Workspace creation limited to valid Stripe customers only
- Provisioning jobs limited to 10 concurrent per workspace
- Default updates require workspace owner authentication
- All provisioning steps logged to AuditLog with correlation IDs

### Error Scenarios & Recovery
- **Stripe Webhook Replay**: Idempotent handling using Stripe event IDs
- **Database Constraint Violation**: Graceful handling of duplicate workspaces
- **External Service Timeout**: Retry with exponential backoff
- **Partial Provisioning Failure**: Resume from last successful step

---

## Module 5: Twilio/WhatsApp Autoprovisioning

### Goals
- Fully automate Twilio subaccount creation, phone number purchase, and WhatsApp setup
- Handle WABA prerequisites and approval workflows automatically
- Implement self-healing webhook recreation and phone number management

### Data Flow
```
Workspace Ready → Twilio Subaccount → Phone Number Purchase → WhatsApp Registration → Webhook Setup → Verification → Activation
```

### API Routes
- `POST /api/provisioning/twilio` - Start Twilio provisioning
- `GET /api/provisioning/twilio/[workspaceId]/status` - Provisioning status
- `POST /api/provisioning/twilio/[workspaceId]/retry` - Retry failed steps
- `POST /api/provisioning/whatsapp/webhook/verify` - Webhook verification
- `GET /api/provisioning/whatsapp/[workspaceId]/health` - WhatsApp health check

### Database Models
```typescript
// Extend TwilioSubaccount with provisioning status
interface TwilioSubaccountV2 extends TwilioSubaccount {
  provisioningStatus: 'pending' | 'in_progress' | 'completed' | 'failed'
  provisioningSteps: {
    subaccount_creation: JobStepStatus
    api_key_generation: JobStepStatus
    phone_number_purchase: JobStepStatus
    webhook_configuration: JobStepStatus
    whatsapp_registration: JobStepStatus
    verification: JobStepStatus
  }
  healthStatus: {
    webhookHealth: 'healthy' | 'degraded' | 'failed'
    numberHealth: 'active' | 'suspended' | 'released'
    lastHealthCheck: Date
    consecutiveFailures: number
  }
}

// WhatsApp Business Account prerequisites
interface WABAPrerequisites {
  businessVerified: boolean
  phoneNumberVerified: boolean
  templatesApproved: string[]
  webhookConfigured: boolean
  displayNameApproved: boolean
  paymentMethodAdded: boolean
}
```

### Background Jobs
- **Twilio Provisioner**: Handles subaccount and number provisioning
- **WhatsApp Registrar**: Manages WABA registration and approval
- **Webhook Health Monitor**: Monitors webhook delivery and recreates if needed
- **Phone Number Manager**: Monitors number status and handles suspensions
- **Template Approver**: Submits and tracks WhatsApp template approvals

### Security & Rate Limits
- Twilio provisioning limited to verified workspaces only
- Phone number purchases limited to 1 per workspace per day
- Webhook recreation limited to 3 attempts per hour
- All Twilio operations require encrypted credential storage

### Error Scenarios & Recovery
- **Twilio API Rate Limits**: Exponential backoff with jitter
- **Phone Number Unavailable**: Try alternative numbers in same area code
- **WABA Prerequisites Missing**: Queue for manual review and approval
- **Webhook Signature Failure**: Regenerate webhook URL and update Twilio
- **WhatsApp Template Rejection**: Fallback to approved templates

---

## Module 6: WhatsApp Coach/Buddy Runtime

### Goals
- Implement event-driven WhatsApp coaching with scheduled nudges and responses
- Respect WhatsApp 24-hour session windows and template requirements
- Provide personalized coaching based on lead history and goals

### Data Flow
```
Coach Event Trigger → Lead Context Loading → Message Generation → Rate Limit Check → Template Selection → Message Sending → Response Tracking → Next Event Scheduling
```

### API Routes
- `POST /api/whatsapp-coach/message` - Send coach message
- `GET /api/whatsapp-coach/schedule/[workspaceId]` - Get coaching schedule
- `PUT /api/whatsapp-coach/schedule/[workspaceId]` - Update coaching schedule
- `GET /api/whatsapp-coach/analytics/[workspaceId]` - Coaching analytics
- `POST /api/whatsapp-coach/test/[workspaceId]` - Test coaching flow

### Database Models
```typescript
// Coach Event Types
interface CoachEvent extends AutopilotEvent {
  type: 'coach.morning_nudge' | 'coach.missed_training_nudge' | 'coach.weekly_checkin' | 
        'coach.goal_progress_report' | 'coach.nutrition_reminder' | 'coach.motivation_message'
  payload: {
    leadId: string
    messageType: 'template' | 'text'
    templateName?: string
    personalizedContent?: string
    scheduledFor: Date
    timezone: string
  }
}

// Lead Coaching State
interface LeadCoachingState {
  leadId: string
  workspaceId: string
  currentGoals: Goal[]
  lastTrainingDate?: Date
  lastNudgeDate?: Date
  lastResponseDate?: Date
  coachingPreferences: {
    frequency: 'daily' | 'weekly' | 'bi-weekly'
    timeOfDay: string // "08:00"
    timezone: string
    motivationStyle: 'encouraging' | 'challenging' | 'supportive'
  }
  sessionWindow: {
    isActive: boolean
    expiresAt?: Date
    lastInboundMessage?: Date
  }
  metrics: {
    totalNudgesSent: number
    responseRate: number
    goalCompletionRate: number
    engagementScore: number // 0-100
  }
}

interface Goal {
  id: string
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'habit'
  target: string
  deadline?: Date
  progress: number // 0-100
  milestones: Milestone[]
}

interface Milestone {
  description: string
  targetDate: Date
  completed: boolean
  completedAt?: Date
}
```

### Background Jobs
- **Coach Event Scheduler**: Creates coaching events based on workspace schedules
- **Message Personalizer**: Generates personalized coaching content using AI
- **Session Window Monitor**: Tracks WhatsApp 24-hour session windows
- **Engagement Analyzer**: Calculates lead engagement scores and adjusts frequency
- **Template Manager**: Manages WhatsApp template approvals and usage

### Security & Rate Limits
- Coaching messages limited by workspace daily budget
- Template messages limited to approved templates only
- Personal data in messages must be anonymized in logs
- All coaching interactions logged for compliance

### Error Scenarios & Recovery
- **WhatsApp Rate Limit**: Queue messages for next available window
- **Template Not Approved**: Fall back to approved templates or text messages
- **Session Window Expired**: Use template messages only
- **Lead Unsubscribed**: Remove from coaching schedule immediately
- **Message Delivery Failed**: Retry with exponential backoff, max 3 attempts

---

## Module 7: Health Monitoring & Self-Healing

### Goals
- Implement comprehensive health monitoring across all autopilot components
- Provide automatic remediation for common failure scenarios
- Create health dashboards and alerting for critical issues

### Data Flow
```
Health Check Trigger → Component Status Check → Issue Detection → Remediation Action → Result Verification → Incident Logging → Dashboard Update
```

### API Routes
- `GET /api/health/autopilot` - Overall autopilot health status
- `GET /api/health/workspace/[workspaceId]` - Workspace-specific health
- `POST /api/health/check/[component]` - Manual health check trigger
- `GET /api/health/incidents` - List recent incidents
- `POST /api/health/remediate/[incidentId]` - Manual remediation trigger

### Database Models
```typescript
// Health Check Results
interface HealthCheck {
  id: string
  workspaceId?: string
  component: HealthComponent
  status: 'healthy' | 'degraded' | 'failed'
  metrics: HealthMetrics
  issues: HealthIssue[]
  lastCheck: Date
  nextCheck: Date
  consecutiveFailures: number
}

type HealthComponent = 
  | 'webhook_delivery' | 'queue_processing' | 'rate_limits' 
  | 'twilio_integration' | 'whatsapp_integration' | 'ai_providers'
  | 'database_performance' | 'external_apis'

interface HealthMetrics {
  responseTime?: number
  errorRate?: number
  throughput?: number
  queueDepth?: number
  budgetUtilization?: number
}

interface HealthIssue {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detectedAt: Date
  autoRemediable: boolean
  remediationAction?: string
}

// Incident Management
interface Incident {
  id: string
  workspaceId?: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  component: HealthComponent
  detectedAt: Date
  resolvedAt?: Date
  remediationActions: RemediationAction[]
  escalated: boolean
  escalatedAt?: Date
}

interface RemediationAction {
  type: 'recreate_webhook' | 'retry_job' | 'reset_rate_limit' | 'restart_integration' | 'clear_queue'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  result?: string
  error?: string
}
```

### Background Jobs
- **Health Monitor**: Runs health checks every 5 minutes
- **Auto Remediator**: Executes automatic remediation actions
- **Incident Manager**: Creates and manages incidents
- **Escalation Handler**: Escalates critical incidents to support
- **Health Reporter**: Generates daily health reports

### Security & Rate Limits
- Health checks limited to prevent resource exhaustion
- Remediation actions require proper authorization
- Incident data must not contain sensitive information
- Health endpoints require authentication

### Error Scenarios & Recovery
- **Health Check Timeout**: Mark component as degraded, retry with longer timeout
- **Remediation Failure**: Escalate to manual intervention
- **False Positive**: Implement health check validation and tuning
- **Cascade Failures**: Implement circuit breakers to prevent system-wide issues

---

## Module 8: Security Hardening

### Goals
- Implement comprehensive security measures across all autopilot components
- Add CORS, CSP headers, webhook signature validation, and request validation
- Ensure OWASP compliance and sensitive data protection

### Data Flow
```
Request → Security Headers → Authentication → Authorization → Input Validation → Rate Limiting → Processing → Response → Audit Logging
```

### API Routes
- `GET /api/security/csp-report` - CSP violation reporting
- `POST /api/security/webhook/validate` - Webhook signature validation
- `GET /api/security/audit/[workspaceId]` - Security audit logs
- `POST /api/security/test/[component]` - Security test endpoints

### Security Implementation

#### Content Security Policy
```typescript
const cspHeader = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://api.openai.com https://api.groq.com https://api.anthropic.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
}
```

#### CORS Configuration
```typescript
const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pilarsystems.com', 'https://www.pilarsystems.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}
```

#### Webhook Signature Validation
```typescript
class WebhookValidator {
  validateStripe(payload: string, signature: string, secret: string): boolean {
    const elements = signature.split(',')
    const signatureHash = elements.find(el => el.startsWith('v1='))?.split('=')[1]
    const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1]
    
    if (!signatureHash || !timestamp) return false
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + '.' + payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }
  
  validateWhatsApp(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return signature === `sha256=${expectedSignature}`
  }
}
```

#### Request Validation Schemas
```typescript
// Zod schemas for API validation
const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  ownerId: z.string().uuid(),
  plan: z.enum(['BASIC', 'PRO']),
  metadata: z.record(z.any()).optional()
})

const sendMessageSchema = z.object({
  workspaceId: z.string().uuid(),
  leadId: z.string().uuid(),
  content: z.string().min(1).max(4096),
  channel: z.enum(['whatsapp', 'sms', 'email']),
  templateName: z.string().optional()
})
```

### Background Jobs
- **Security Scanner**: Scans for security vulnerabilities daily
- **Audit Log Analyzer**: Analyzes audit logs for suspicious activity
- **Certificate Monitor**: Monitors SSL certificate expiration
- **Compliance Checker**: Validates OWASP compliance

### Security & Rate Limits
- CSP violations logged and monitored
- Failed authentication attempts rate limited
- Webhook signature validation mandatory
- All sensitive data encrypted at rest and in transit

### Error Scenarios & Recovery
- **CSP Violation**: Log violation, adjust policy if legitimate
- **Invalid Webhook Signature**: Reject request, log security incident
- **Rate Limit Exceeded**: Return 429 status, implement exponential backoff
- **Authentication Failure**: Log attempt, implement account lockout if repeated

---

## Module 9: Affiliate 100% Autonomous

### Goals
- Create fully self-service affiliate registration and management
- Automate affiliate link generation, QR code creation, and commission tracking
- Provide real-time analytics dashboard for affiliates

### Data Flow
```
Affiliate Signup → Email Verification → Account Creation → Link Generation → QR Code Creation → Dashboard Access → Click Tracking → Conversion Attribution → Commission Calculation → Payout Processing
```

### API Routes
- `POST /api/affiliate/register` - Self-service affiliate registration
- `GET /api/affiliate/dashboard/[affiliateId]` - Affiliate dashboard data
- `POST /api/affiliate/links` - Create new affiliate link
- `GET /api/affiliate/analytics/[affiliateId]` - Detailed analytics
- `POST /api/affiliate/payout/request` - Request payout
- `GET /api/affiliate/qr/[linkId]` - Generate QR code

### Database Models
```typescript
// Enhanced Affiliate Management
interface AffiliateV2 extends Affiliate {
  registrationSource: 'website' | 'referral' | 'direct'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verificationToken: string
  onboardingCompleted: boolean
  dashboardAccess: boolean
  autoApproval: boolean
  performanceMetrics: {
    totalClicks: number
    totalConversions: number
    conversionRate: number
    totalCommissions: number
    averageOrderValue: number
    topPerformingLinks: string[]
  }
  payoutPreferences: {
    method: 'bank_transfer' | 'paypal' | 'stripe'
    minimumAmount: number
    frequency: 'weekly' | 'monthly' | 'quarterly'
    details: Record<string, any> // Encrypted
  }
}

// Enhanced Link Tracking
interface AffiliateLinkV2 extends AffiliateLink {
  qrCodeUrl: string
  shortUrl: string
  utmParameters: {
    source: string
    medium: string
    campaign: string
    term?: string
    content?: string
  }
  targetAudience: string[]
  expectedConversionRate: number
  performanceGoals: {
    clicksPerMonth: number
    conversionsPerMonth: number
    revenuePerMonth: number
  }
  analytics: {
    clicksByDay: Record<string, number>
    conversionsByDay: Record<string, number>
    topReferrers: string[]
    deviceBreakdown: Record<string, number>
    locationBreakdown: Record<string, number>
  }
}

// Automated Payout System
interface AutomatedPayout {
  id: string
  affiliateId: string
  amount: number
  currency: string
  method: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  scheduledAt: Date
  processedAt?: Date
  transactionId?: string
  fees: number
  netAmount: number
  conversionsIncluded: string[]
}
```

### Background Jobs
- **Affiliate Onboarder**: Processes new affiliate registrations
- **Commission Calculator**: Calculates commissions from conversions
- **Payout Processor**: Processes automated payouts
- **Analytics Aggregator**: Aggregates affiliate performance data
- **QR Code Generator**: Generates and updates QR codes for links
- **Performance Optimizer**: Provides performance improvement suggestions

### Security & Rate Limits
- Affiliate registration limited to 10 per IP per day
- Link creation limited to 50 per affiliate per day
- Dashboard access requires authentication
- Commission data encrypted and access logged

### Error Scenarios & Recovery
- **Email Verification Failed**: Resend verification email, expire after 24 hours
- **Payout Processing Failed**: Retry with exponential backoff, notify affiliate
- **Analytics Data Corruption**: Rebuild from raw click/conversion data
- **QR Code Generation Failed**: Use fallback service or manual generation

---

## Module 10: UI/UX Super Upgrade

### Goals
- Achieve Apple-quality user experience with smooth animations and micro-interactions
- Ensure perfect mobile responsiveness starting from 360px width
- Implement unified toast system and professional error handling

### Data Flow
```
User Interaction → Animation Trigger → State Update → UI Feedback → Error Handling → Toast Notification → Analytics Tracking
```

### API Routes
- `GET /api/ui/health` - UI component health check
- `POST /api/ui/feedback` - User feedback collection
- `GET /api/ui/analytics` - UI performance analytics
- `POST /api/ui/error-report` - Client-side error reporting

### UI Components & Patterns

#### Animation System
```typescript
// Framer Motion animation variants
const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: 'easeInOut' }
}

const microInteractions = {
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15 }
  },
  card: {
    whileHover: { y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' },
    transition: { duration: 0.2 }
  }
}
```

#### Toast System
```typescript
// Unified toast system using Sonner
interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

class ToastManager {
  success(message: string, options?: Partial<ToastConfig>) {
    toast.success(message, {
      duration: 4000,
      ...options
    })
  }
  
  error(message: string, options?: Partial<ToastConfig>) {
    toast.error(message, {
      duration: 6000,
      ...options
    })
  }
  
  loading(message: string, promise: Promise<any>) {
    return toast.promise(promise, {
      loading: message,
      success: 'Operation completed successfully',
      error: 'Operation failed'
    })
  }
}
```

#### Mobile-First Responsive Design
```css
/* Breakpoint system */
:root {
  --mobile-xs: 360px;
  --mobile-sm: 480px;
  --tablet: 768px;
  --desktop: 1024px;
  --desktop-lg: 1440px;
}

/* Mobile-first approach */
.container {
  width: 100%;
  padding: 0 16px;
  margin: 0 auto;
}

@media (min-width: 480px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 32px;
  }
}
```

#### Error Boundary System
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    this.logError(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    
    return this.props.children
  }
}
```

### Background Jobs
- **Performance Monitor**: Tracks Core Web Vitals and user interactions
- **Error Aggregator**: Collects and analyzes client-side errors
- **A/B Test Manager**: Manages UI/UX A/B tests
- **Accessibility Checker**: Monitors accessibility compliance

### Security & Rate Limits
- Client-side error reporting limited to prevent spam
- UI analytics data anonymized
- Performance monitoring respects user privacy preferences
- All UI interactions logged for analytics

### Error Scenarios & Recovery
- **JavaScript Error**: Show error boundary with retry option
- **Network Error**: Show offline indicator and retry mechanism
- **Slow Loading**: Show skeleton screens and loading indicators
- **Mobile Layout Issues**: Graceful degradation to simpler layouts

---

## Event-Sourcing & Job Queue Design

### Event Store Architecture

#### Event Schema
```sql
CREATE TABLE AutopilotEvent (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NOT NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  aggregateId     UUID NOT NULL, -- Lead, Workspace, etc.
  aggregateType   VARCHAR(50) NOT NULL,
  eventType       VARCHAR(100) NOT NULL,
  eventVersion    INTEGER NOT NULL DEFAULT 1,
  eventData       JSONB NOT NULL,
  metadata        JSONB NULL,
  causationId     UUID NULL, -- Event that caused this event
  correlationId   UUID NULL, -- Group related events
  streamPosition  BIGSERIAL,
  timestamp       TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_stream_position UNIQUE (aggregateId, streamPosition)
);

CREATE INDEX idx_event_aggregate ON AutopilotEvent(aggregateId, streamPosition);
CREATE INDEX idx_event_type ON AutopilotEvent(eventType, timestamp);
CREATE INDEX idx_event_workspace ON AutopilotEvent(workspaceId, timestamp);
CREATE INDEX idx_event_correlation ON AutopilotEvent(correlationId);
```

#### Event Processing Pipeline
```typescript
interface EventProcessor {
  process(event: AutopilotEvent): Promise<void>
  canHandle(eventType: string): boolean
  getHandlerName(): string
}

class EventBus {
  private processors: Map<string, EventProcessor[]> = new Map()
  
  async publish(event: AutopilotEvent): Promise<void> {
    const processors = this.processors.get(event.eventType) || []
    
    await Promise.all(
      processors.map(processor => 
        this.processWithRetry(processor, event)
      )
    )
  }
  
  private async processWithRetry(
    processor: EventProcessor, 
    event: AutopilotEvent,
    maxRetries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await processor.process(event)
        return
      } catch (error) {
        if (attempt === maxRetries) {
          await this.handleProcessingFailure(processor, event, error)
          throw error
        }
        await this.delay(Math.pow(2, attempt) * 1000) // Exponential backoff
      }
    }
  }
}
```

### Job Queue Implementation

#### Job Processing Strategy
```typescript
interface JobQueue {
  enqueue(job: AutopilotJob): Promise<string>
  dequeue(workerType: string): Promise<AutopilotJob | null>
  complete(jobId: string, result: any): Promise<void>
  fail(jobId: string, error: string): Promise<void>
  retry(jobId: string): Promise<void>
}

class DatabaseJobQueue implements JobQueue {
  async enqueue(job: AutopilotJob): Promise<string> {
    const existingJob = await this.findDuplicateJob(job)
    if (existingJob) return existingJob.id
    
    const newJob = await prisma.autopilotJob.create({
      data: {
        ...job,
        idempotencyKey: this.generateIdempotencyKey(job)
      }
    })
    
    return newJob.id
  }
  
  async dequeue(workerType: string): Promise<AutopilotJob | null> {
    return await prisma.$transaction(async (tx) => {
      const job = await tx.autopilotJob.findFirst({
        where: {
          status: 'pending',
          scheduledAt: { lte: new Date() },
          lockedAt: null
        },
        orderBy: [
          { priority: 'desc' },
          { scheduledAt: 'asc' }
        ]
      })
      
      if (!job) return null
      
      await tx.autopilotJob.update({
        where: { id: job.id },
        data: {
          status: 'in_progress',
          lockedAt: new Date(),
          lockedBy: workerType,
          startedAt: new Date()
        }
      })
      
      return job
    })
  }
}
```

### Idempotency Strategy

#### Idempotency Key Generation
```typescript
class IdempotencyManager {
  generateKey(operation: string, parameters: Record<string, any>): string {
    const sortedParams = Object.keys(parameters)
      .sort()
      .reduce((result, key) => {
        result[key] = parameters[key]
        return result
      }, {} as Record<string, any>)
    
    const payload = JSON.stringify({ operation, parameters: sortedParams })
    return crypto.createHash('sha256').update(payload).digest('hex')
  }
  
  async ensureIdempotent<T>(
    key: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const existing = await this.getExistingResult(key)
    if (existing) return existing
    
    const result = await operation()
    await this.storeResult(key, result)
    return result
  }
}
```

---

## API Surface Summary

### Core Autopilot APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/operator/run` | POST | Execute operator cycle | System |
| `/api/operator/status` | GET | Get operator status | Workspace |
| `/api/operator/policies/[id]` | GET/PUT | Manage workspace policies | Owner |
| `/api/autopilot/events` | POST/GET | Event management | Workspace |
| `/api/autopilot/jobs` | POST/GET | Job management | Workspace |
| `/api/autopilot/health` | GET | System health | Public |

### Provisioning APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/provisioning/workspace` | POST | Create workspace | Webhook |
| `/api/provisioning/twilio` | POST | Provision Twilio | System |
| `/api/provisioning/whatsapp` | POST | Setup WhatsApp | System |
| `/api/provisioning/status/[id]` | GET | Check status | Workspace |

### WhatsApp Coach APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/whatsapp-coach/message` | POST | Send coach message | System |
| `/api/whatsapp-coach/schedule/[id]` | GET/PUT | Manage schedule | Workspace |
| `/api/whatsapp-coach/analytics/[id]` | GET | Get analytics | Workspace |

### AI Agent APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/ai-wizard/generate` | POST | Generate AI config | Workspace |
| `/api/ai-agent/config/[id]` | GET/PUT | Manage agent config | Workspace |
| `/api/ai-agent/evaluate` | POST | Test rule evaluation | Workspace |

### Health & Security APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/health/autopilot` | GET | Overall health | Public |
| `/api/health/workspace/[id]` | GET | Workspace health | Workspace |
| `/api/security/audit/[id]` | GET | Security audit | Owner |

### Affiliate APIs
| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/affiliate/register` | POST | Self-registration | None |
| `/api/affiliate/dashboard/[id]` | GET | Dashboard data | Affiliate |
| `/api/affiliate/links` | POST | Create link | Affiliate |
| `/api/affiliate/analytics/[id]` | GET | Performance data | Affiliate |

---

## Data Model Changes

### New Tables Required

#### AutopilotEvent
```sql
CREATE TABLE AutopilotEvent (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NOT NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  type            VARCHAR(100) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  scheduledAt     TIMESTAMP NOT NULL DEFAULT NOW(),
  attempts        INTEGER DEFAULT 0,
  maxAttempts     INTEGER DEFAULT 3,
  idempotencyKey  VARCHAR(255) UNIQUE NOT NULL,
  lockedAt        TIMESTAMP NULL,
  lockedBy        VARCHAR(100) NULL,
  error           TEXT NULL,
  processedAt     TIMESTAMP NULL,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW()
);
```

#### AutopilotJob
```sql
CREATE TABLE AutopilotJob (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NOT NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  type            VARCHAR(100) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  priority        INTEGER DEFAULT 5,
  attempts        INTEGER DEFAULT 0,
  maxAttempts     INTEGER DEFAULT 3,
  scheduledAt     TIMESTAMP NOT NULL DEFAULT NOW(),
  startedAt       TIMESTAMP NULL,
  completedAt     TIMESTAMP NULL,
  idempotencyKey  VARCHAR(255) UNIQUE NOT NULL,
  lockedAt        TIMESTAMP NULL,
  lockedBy        VARCHAR(100) NULL,
  result          JSONB NULL,
  error           TEXT NULL,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW()
);
```

#### HealthCheck
```sql
CREATE TABLE HealthCheck (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId         UUID NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  component           VARCHAR(50) NOT NULL,
  status              VARCHAR(20) NOT NULL,
  metrics             JSONB NULL,
  issues              JSONB NULL,
  lastCheck           TIMESTAMP NOT NULL,
  nextCheck           TIMESTAMP NOT NULL,
  consecutiveFailures INTEGER DEFAULT 0,
  createdAt           TIMESTAMP DEFAULT NOW(),
  updatedAt           TIMESTAMP DEFAULT NOW()
);
```

#### Incident
```sql
CREATE TABLE Incident (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspaceId     UUID NULL REFERENCES Workspace(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT NOT NULL,
  severity        VARCHAR(20) NOT NULL,
  status          VARCHAR(20) NOT NULL,
  component       VARCHAR(50) NOT NULL,
  detectedAt      TIMESTAMP NOT NULL,
  resolvedAt      TIMESTAMP NULL,
  escalated       BOOLEAN DEFAULT FALSE,
  escalatedAt     TIMESTAMP NULL,
  remediationActions JSONB NULL,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW()
);
```

### Enhanced Existing Tables

#### Workspace.studioInfo Extensions
```typescript
interface StudioInfoV6 {
  // Existing fields preserved
  ...existingStudioInfo,
  
  // New v6 fields
  operatorConfig: {
    enabled: boolean
    policies: WorkspacePolicies
    budgets: WorkspaceBudget
    healthScore: number
    lastHealthCheck: Date
  }
  
  aiAgentConfig: {
    provider: 'openai' | 'groq' | 'anthropic'
    model: string
    systemPrompt: string
    policies: AiAgentPolicies
  }
  
  coachingConfig: {
    enabled: boolean
    schedules: CoachSchedule[]
    preferences: CoachingPreferences
  }
  
  affiliateConfig?: {
    enabled: boolean
    commissionRates: CommissionRates
    payoutSettings: PayoutSettings
  }
}
```

---

## Operational Model

### Cron Schedule (Vercel)
```json
{
  "crons": [
    {
      "path": "/api/operator/run",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/autopilot/health/check",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/autopilot/budget/reset",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/autopilot/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Manual Triggers
- **Emergency Operator Run**: `POST /api/operator/run?emergency=true`
- **Workspace Reprovisioning**: `POST /api/provisioning/workspace/[id]/retry`
- **Health Check**: `POST /api/health/check/all`
- **Budget Override**: `POST /api/operator/budget/override`

### Health Endpoints
- **System Health**: `GET /api/health/autopilot` - Public endpoint for uptime monitoring
- **Workspace Health**: `GET /api/health/workspace/[id]` - Detailed workspace status
- **Component Health**: `GET /api/health/component/[name]` - Individual component status

### Dashboard Widgets
- **Operator Status**: Last run time, actions executed, errors
- **Health Score**: Overall system health (0-100)
- **Active Jobs**: Current job queue depth and processing rate
- **Budget Utilization**: Resource consumption across workspaces
- **Recent Incidents**: Critical issues and resolution status

---

## Implementation Roadmap

### Phase 0: Foundation Setup (1 hour)
**Dependencies**: PR #19 merged  
**Effort**: 1 hour  
**Risk**: Low  

**Tasks**:
- Merge PR #19 to establish v5 baseline on main
- Create `autopilot-v6` branch from main
- Set up feature branch workflow
- Update vercel.json cron paths to point to `/api/operator/run`

**Acceptance Criteria**:
- ✅ PR #19 merged successfully
- ✅ `autopilot-v6` branch created and pushed
- ✅ Vercel cron configuration updated
- ✅ Local development environment working

### Phase 1: Autopilot Backplane (3-4 hours)
**Dependencies**: Phase 0 complete  
**Effort**: 3-4 hours  
**Risk**: Medium (new database tables)  

**Tasks**:
- Create AutopilotEvent and AutopilotJob tables
- Implement event bus and job queue systems
- Add distributed locking enhancements
- Create idempotency management
- Build rate limiting infrastructure

**Acceptance Criteria**:
- ✅ Database migrations run successfully
- ✅ Event creation and processing working
- ✅ Job queue processing jobs correctly
- ✅ Distributed locks preventing concurrent operations
- ✅ Rate limiting enforcing workspace budgets
- ✅ All tests passing

### Phase 2: Operator Runtime v2 (3-4 hours)
**Dependencies**: Phase 1 complete  
**Effort**: 3-4 hours  
**Risk**: Medium (existing system modification)  

**Tasks**:
- Enhance existing Operator Runtime with policy engine
- Implement per-workspace budget enforcement
- Add health scoring system
- Create policy management APIs
- Update cron integration

**Acceptance Criteria**:
- ✅ Operator processes 100 workspaces per cycle
- ✅ Policies enforced correctly per workspace
- ✅ Budget limits respected and logged
- ✅ Health scores calculated accurately
- ✅ Manual triggers working
- ✅ Audit trail complete

### Phase 3: AI Wizard + Agent Orchestrator (3-4 hours)
**Dependencies**: Phase 2 complete  
**Effort**: 3-4 hours  
**Risk**: Medium (AI provider integration)  

**Tasks**:
- Enhance existing AI-Onboarding Wizard
- Add multi-model support (OpenAI, Groq, Anthropic)
- Implement rule composition and priority system
- Add A/B testing framework
- Create rule analytics

**Acceptance Criteria**:
- ✅ AI Wizard generates rules matching Prisma schema
- ✅ Multiple AI providers supported
- ✅ Rule evaluation working correctly
- ✅ A/B tests tracking performance
- ✅ Analytics showing rule effectiveness
- ✅ Dry-run endpoint functional

### Phase 4: Workspace Autoprovisioning (3-4 hours)
**Dependencies**: Phase 3 complete  
**Effort**: 3-4 hours  
**Risk**: Medium (Stripe webhook integration)  

**Tasks**:
- Implement Stripe webhook to workspace creation flow
- Create default AI agent and training logic setup
- Add follow-up template creation
- Implement calendar integration defaults
- Add comprehensive error handling

**Acceptance Criteria**:
- ✅ Stripe webhooks trigger workspace creation
- ✅ Default AI agent created automatically
- ✅ Training logic activated by default
- ✅ Follow-up templates installed
- ✅ Calendar integration configured
- ✅ Idempotent provisioning working
- ✅ Error recovery functional

### Phase 5: Twilio/WhatsApp Autoprovisioning (4-5 hours)
**Dependencies**: Phase 4 complete  
**Effort**: 4-5 hours  
**Risk**: High (external API dependencies)  

**Tasks**:
- Implement Twilio subaccount creation
- Add automatic phone number purchasing
- Create WhatsApp Business API registration
- Implement webhook configuration
- Add health monitoring and self-healing

**Acceptance Criteria**:
- ✅ Twilio subaccounts created automatically
- ✅ Phone numbers purchased successfully
- ✅ WhatsApp registration working
- ✅ Webhooks configured correctly
- ✅ Health checks detecting issues
- ✅ Self-healing recreating failed webhooks
- ✅ WABA prerequisites handled gracefully

### Phase 6: WhatsApp Coach/Buddy Runtime (4-5 hours)
**Dependencies**: Phase 5 complete  
**Effort**: 4-5 hours  
**Risk**: High (WhatsApp API compliance)  

**Tasks**:
- Implement coach event scheduling system
- Create personalized message generation
- Add 24-hour session window management
- Implement template message handling
- Create engagement analytics

**Acceptance Criteria**:
- ✅ Coach events scheduled correctly
- ✅ Messages personalized per lead
- ✅ 24-hour windows respected
- ✅ Template messages used appropriately
- ✅ Rate limits enforced
- ✅ Engagement metrics tracked
- ✅ Unsubscribe handling working

### Phase 7: Health Monitoring & Self-Healing (2-3 hours)
**Dependencies**: Phase 6 complete  
**Effort**: 2-3 hours  
**Risk**: Low  

**Tasks**:
- Create comprehensive health check system
- Implement automatic remediation actions
- Add incident management
- Create health dashboard APIs
- Implement escalation procedures

**Acceptance Criteria**:
- ✅ Health checks running every 5 minutes
- ✅ Issues detected and logged
- ✅ Automatic remediation working
- ✅ Incidents created for critical issues
- ✅ Escalation emails sent when needed
- ✅ Health dashboard showing accurate status

### Phase 8: Security Hardening (2-3 hours)
**Dependencies**: Phase 7 complete  
**Effort**: 2-3 hours  
**Risk**: Medium (potential breaking changes)  

**Tasks**:
- Implement CSP and CORS headers
- Add webhook signature validation
- Create request validation schemas
- Implement sensitive data masking
- Add security monitoring

**Acceptance Criteria**:
- ✅ CSP headers preventing XSS
- ✅ CORS configured correctly
- ✅ Webhook signatures validated
- ✅ All API inputs validated with Zod
- ✅ Sensitive data masked in logs
- ✅ Security violations monitored
- ✅ No console errors in production

### Phase 9: Affiliate 100% Autonomous (2-3 hours)
**Dependencies**: Phase 8 complete  
**Effort**: 2-3 hours  
**Risk**: Low  

**Tasks**:
- Create self-service affiliate registration
- Implement automatic link and QR code generation
- Add real-time analytics dashboard
- Create automated payout system
- Add performance tracking

**Acceptance Criteria**:
- ✅ Affiliates can register without approval
- ✅ Links and QR codes generated automatically
- ✅ Dashboard showing real-time stats
- ✅ Payouts processed automatically
- ✅ Performance metrics accurate
- ✅ Commission calculations correct

### Phase 10: UI/UX Super Upgrade (2-3 hours)
**Dependencies**: Phase 9 complete  
**Effort**: 2-3 hours  
**Risk**: Low  

**Tasks**:
- Implement mobile-first responsive design
- Add Apple-quality animations
- Create unified toast system
- Fix auth UI issues
- Add micro-interactions

**Acceptance Criteria**:
- ✅ Perfect rendering at 360px width
- ✅ Smooth animations throughout
- ✅ Consistent toast notifications
- ✅ Auth UI with white text and clear errors
- ✅ Micro-interactions on all interactive elements
- ✅ Lighthouse score >90 on mobile
- ✅ 0 console errors

### Phase 11: Documentation & Final Validation (1-2 hours)
**Dependencies**: Phase 10 complete  
**Effort**: 1-2 hours  
**Risk**: Low  

**Tasks**:
- Create PILAR_AUTOPILOT_V6_SETUP.md
- Complete final acceptance criteria validation
- Run comprehensive end-to-end tests
- Create deployment checklist
- Document known limitations

**Acceptance Criteria**:
- ✅ Setup documentation complete and tested
- ✅ All 8 original acceptance criteria met
- ✅ End-to-end flows working
- ✅ Performance benchmarks met
- ✅ Security audit passed
- ✅ Ready for production deployment

---

## Risk Assessment

### High-Risk Areas

#### External API Dependencies
- **Risk**: Twilio/WhatsApp API rate limits or service outages
- **Mitigation**: Implement circuit breakers, fallback mechanisms, and graceful degradation
- **Monitoring**: Track API response times and error rates

#### Database Performance
- **Risk**: New tables and queries may impact performance at scale
- **Mitigation**: Proper indexing, query optimization, and connection pooling
- **Monitoring**: Database performance metrics and slow query logging

#### WhatsApp Compliance
- **Risk**: Violating WhatsApp Business API policies
- **Mitigation**: Strict adherence to 24-hour windows, template requirements, and rate limits
- **Monitoring**: Message delivery rates and policy violation alerts

### Medium-Risk Areas

#### Multi-Tenant Isolation
- **Risk**: Data leakage between workspaces
- **Mitigation**: Comprehensive testing of tenant scoping and access controls
- **Monitoring**: Audit logs and access pattern analysis

#### Event Processing Scale
- **Risk**: Event queue becoming bottleneck at high volume
- **Mitigation**: Horizontal scaling, batch processing, and priority queues
- **Monitoring**: Queue depth and processing latency metrics

### Low-Risk Areas

#### UI/UX Changes
- **Risk**: Breaking existing user workflows
- **Mitigation**: Progressive enhancement and feature flags
- **Monitoring**: User behavior analytics and error rates

#### Documentation
- **Risk**: Incomplete or inaccurate setup instructions
- **Mitigation**: Thorough testing of setup procedures
- **Monitoring**: Support ticket volume and setup success rates

---

## Success Metrics

### Operational Excellence
- **Zero Manual Interventions**: 0 manual steps required per 1000 new customers
- **Uptime**: 99.9% system availability
- **Response Time**: <200ms API response times (95th percentile)
- **Error Rate**: <0.1% error rate across all operations

### Scale & Performance
- **Concurrent Workspaces**: Support 10,000 active workspaces
- **Message Throughput**: Process 100,000 messages per day
- **Job Processing**: Complete 95% of jobs within 5 minutes
- **Database Performance**: <100ms query response times

### User Experience
- **Mobile Performance**: Lighthouse score >90 on mobile devices
- **Page Load Time**: <3 seconds for all pages
- **Error Handling**: 0 unhandled errors in production
- **Accessibility**: WCAG 2.1 AA compliance

### Business Impact
- **Customer Onboarding**: 100% automated from signup to active use
- **Support Reduction**: 70% reduction in support tickets
- **Affiliate Growth**: 100% self-service affiliate management
- **Revenue Impact**: Support 10x revenue growth without operational scaling

---

## Conclusion

PILAR AUTOPILOT v6.0 represents a complete transformation of PILAR SYSTEMS into a fully autonomous, multi-tenant AI company. The architecture provides:

1. **Complete Automation**: Zero manual operations for workspace provisioning, Twilio/WhatsApp setup, AI coaching, and affiliate management
2. **Enterprise Scale**: Support for 10,000+ concurrent studios with isolated resources and budgets
3. **Self-Healing**: Automatic error recovery, webhook recreation, and health monitoring
4. **Professional UX**: Apple-quality animations, mobile-first design, and unified error handling
5. **Security First**: OWASP compliance, CSP headers, webhook validation, and audit trails

The modular architecture ensures each component can be developed, tested, and deployed independently while maintaining system coherence through the shared Autopilot Backplane.

**Total Implementation Effort**: 30-40 hours across 11 phases  
**Timeline**: 2-3 weeks with proper testing and validation  
**Risk Level**: Medium (manageable with proper monitoring and fallbacks)  

Upon completion, PILAR SYSTEMS will operate as a fully autonomous AI company where the founder only handles Marketing, Sales, and Support emails while the system manages everything else automatically.
