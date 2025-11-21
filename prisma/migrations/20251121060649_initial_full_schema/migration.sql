-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('whatsapp', 'phone', 'email', 'calendar');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('active', 'inactive', 'error');

-- CreateEnum
CREATE TYPE "LeadClassification" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('whatsapp', 'phone', 'email', 'manual', 'web');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('whatsapp', 'email', 'sms');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('answered', 'missed', 'voicemail', 'busy', 'failed');

-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('probetraining', 'pt_session', 'vertragsgespraech', 'other');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('classification', 'followup', 'priority', 'auto_reply');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProvisioningJobType" AS ENUM ('twilio_subaccount', 'twilio_number', 'whatsapp_setup', 'calendar_oauth', 'email_setup', 'n8n_workflow');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('google_calendar', 'microsoft_calendar', 'gmail', 'outlook');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('gmail', 'outlook', 'custom');

-- CreateEnum
CREATE TYPE "AffiliateStatus" AS ENUM ('pending', 'active', 'suspended', 'rejected');

-- CreateEnum
CREATE TYPE "AffiliateConversionStatus" AS ENUM ('pending', 'approved', 'reversed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT,
    "studioInfo" JSONB,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "whatsappAddon" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardProgress" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WizardProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "config" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "classification" "LeadClassification",
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "source" "LeadSource" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "assignedToId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT,
    "channel" "MessageChannel" NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "direction" "CallDirection" NOT NULL,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "transcript" TEXT,
    "aiSummary" TEXT,
    "aiActions" JSONB,
    "status" "CallStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followup" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "MessageChannel" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "FollowupStatus" NOT NULL DEFAULT 'pending',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT,
    "type" "CalendarEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "googleEventId" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'scheduled',
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRule" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "ruleType" "RuleType" NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "leadId" TEXT,
    "actionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvisioningJob" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "jobType" "ProvisioningJobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "result" JSONB,
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ProvisioningJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwilioSubaccount" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "subaccountSid" TEXT NOT NULL,
    "apiKeySid" TEXT NOT NULL,
    "apiKeySecret" TEXT NOT NULL,
    "phoneNumberSid" TEXT,
    "phoneNumber" TEXT,
    "webhooksConfigured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwilioSubaccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppIntegration" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "wabaId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "systemUserId" TEXT,
    "webhookVerifyToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthToken" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCredential" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL,
    "email" TEXT NOT NULL,
    "imapHost" TEXT NOT NULL,
    "imapPort" INTEGER NOT NULL,
    "smtpHost" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "useTLS" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "N8nWorkflow" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "N8nWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "studioName" TEXT NOT NULL,
    "studioSize" TEXT NOT NULL,
    "location" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliate" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'pending',
    "commissionSetup" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "commissionRecurring" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "payoutMethod" TEXT,
    "payoutDetails" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "affiliateLinkId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "landingPage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateConversion" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "affiliateLinkId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" "AffiliateConversionStatus" NOT NULL DEFAULT 'pending',
    "setupFeeAmount" DOUBLE PRECISION,
    "recurringAmount" DOUBLE PRECISION,
    "commissionSetup" DOUBLE PRECISION,
    "commissionRecurring" DOUBLE PRECISION,
    "totalCommission" DOUBLE PRECISION,
    "paidOut" BOOLEAN NOT NULL DEFAULT false,
    "paidOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePayout" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AffiliatePayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "payload" JSONB NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationState" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'idle',
    "lastMessageAt" TIMESTAMP(3),
    "nextActionAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_subscriptionId_key" ON "Workspace"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_workspaceId_key" ON "Subscription"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "WizardProgress_workspaceId_step_key" ON "WizardProgress"("workspaceId", "step");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_workspaceId_type_key" ON "Integration"("workspaceId", "type");

-- CreateIndex
CREATE INDEX "Lead_workspaceId_status_idx" ON "Lead"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Lead_workspaceId_classification_idx" ON "Lead"("workspaceId", "classification");

-- CreateIndex
CREATE INDEX "Message_workspaceId_leadId_idx" ON "Message"("workspaceId", "leadId");

-- CreateIndex
CREATE INDEX "Message_workspaceId_createdAt_idx" ON "Message"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "CallLog_workspaceId_leadId_idx" ON "CallLog"("workspaceId", "leadId");

-- CreateIndex
CREATE INDEX "CallLog_workspaceId_createdAt_idx" ON "CallLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Followup_workspaceId_scheduledAt_idx" ON "Followup"("workspaceId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Followup_workspaceId_status_idx" ON "Followup"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "CalendarEvent_workspaceId_startTime_idx" ON "CalendarEvent"("workspaceId", "startTime");

-- CreateIndex
CREATE INDEX "CalendarEvent_workspaceId_status_idx" ON "CalendarEvent"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "AiRule_workspaceId_ruleType_active_idx" ON "AiRule"("workspaceId", "ruleType", "active");

-- CreateIndex
CREATE INDEX "ActivityLog_workspaceId_createdAt_idx" ON "ActivityLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_workspaceId_leadId_idx" ON "ActivityLog"("workspaceId", "leadId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_status_idx" ON "Task"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Task_workspaceId_assignedToId_idx" ON "Task"("workspaceId", "assignedToId");

-- CreateIndex
CREATE INDEX "ProvisioningJob_workspaceId_status_idx" ON "ProvisioningJob"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "ProvisioningJob_workspaceId_jobType_idx" ON "ProvisioningJob"("workspaceId", "jobType");

-- CreateIndex
CREATE UNIQUE INDEX "TwilioSubaccount_workspaceId_key" ON "TwilioSubaccount"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "TwilioSubaccount_subaccountSid_key" ON "TwilioSubaccount"("subaccountSid");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppIntegration_workspaceId_key" ON "WhatsAppIntegration"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppIntegration_phoneNumberId_key" ON "WhatsAppIntegration"("phoneNumberId");

-- CreateIndex
CREATE INDEX "OAuthToken_workspaceId_provider_idx" ON "OAuthToken"("workspaceId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_workspaceId_provider_key" ON "OAuthToken"("workspaceId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "EmailCredential_workspaceId_key" ON "EmailCredential"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "N8nWorkflow_workflowId_key" ON "N8nWorkflow"("workflowId");

-- CreateIndex
CREATE INDEX "N8nWorkflow_workspaceId_active_idx" ON "N8nWorkflow"("workspaceId", "active");

-- CreateIndex
CREATE INDEX "AuditLog_workspaceId_createdAt_idx" ON "AuditLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContactRequest_status_createdAt_idx" ON "ContactRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactRequest_email_idx" ON "ContactRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_email_key" ON "Affiliate"("email");

-- CreateIndex
CREATE INDEX "Affiliate_status_createdAt_idx" ON "Affiliate"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Affiliate_email_idx" ON "Affiliate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateLink_code_key" ON "AffiliateLink"("code");

-- CreateIndex
CREATE INDEX "AffiliateLink_affiliateId_active_idx" ON "AffiliateLink"("affiliateId", "active");

-- CreateIndex
CREATE INDEX "AffiliateLink_code_idx" ON "AffiliateLink"("code");

-- CreateIndex
CREATE INDEX "AffiliateClick_affiliateLinkId_createdAt_idx" ON "AffiliateClick"("affiliateLinkId", "createdAt");

-- CreateIndex
CREATE INDEX "AffiliateClick_ipHash_createdAt_idx" ON "AffiliateClick"("ipHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateConversion_stripeCheckoutSessionId_key" ON "AffiliateConversion"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "AffiliateConversion_affiliateId_status_idx" ON "AffiliateConversion"("affiliateId", "status");

-- CreateIndex
CREATE INDEX "AffiliateConversion_affiliateLinkId_status_idx" ON "AffiliateConversion"("affiliateLinkId", "status");

-- CreateIndex
CREATE INDEX "AffiliateConversion_stripeCheckoutSessionId_idx" ON "AffiliateConversion"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "AffiliateConversion_paidOut_createdAt_idx" ON "AffiliateConversion"("paidOut", "createdAt");

-- CreateIndex
CREATE INDEX "AffiliatePayout_affiliateId_status_idx" ON "AffiliatePayout"("affiliateId", "status");

-- CreateIndex
CREATE INDEX "AffiliatePayout_status_createdAt_idx" ON "AffiliatePayout"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_workspaceId_status_idx" ON "WebhookEvent"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_createdAt_idx" ON "WebhookEvent"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_source_externalId_key" ON "WebhookEvent"("source", "externalId");

-- CreateIndex
CREATE INDEX "ConversationState_workspaceId_state_idx" ON "ConversationState"("workspaceId", "state");

-- CreateIndex
CREATE INDEX "ConversationState_nextActionAt_idx" ON "ConversationState"("nextActionAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationState_workspaceId_leadId_key" ON "ConversationState"("workspaceId", "leadId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardProgress" ADD CONSTRAINT "WizardProgress_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRule" ADD CONSTRAINT "AiRule_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvisioningJob" ADD CONSTRAINT "ProvisioningJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwilioSubaccount" ADD CONSTRAINT "TwilioSubaccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppIntegration" ADD CONSTRAINT "WhatsAppIntegration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthToken" ADD CONSTRAINT "OAuthToken_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCredential" ADD CONSTRAINT "EmailCredential_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "N8nWorkflow" ADD CONSTRAINT "N8nWorkflow_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateConversion" ADD CONSTRAINT "AffiliateConversion_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateConversion" ADD CONSTRAINT "AffiliateConversion_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliatePayout" ADD CONSTRAINT "AffiliatePayout_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
