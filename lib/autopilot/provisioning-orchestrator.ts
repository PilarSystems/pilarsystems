/**
 * PILAR AUTOPILOT - Provisioning Orchestrator
 * 
 * Coordinates all provisioning steps with progress tracking and error handling
 */

import { logger } from '@/lib/logger'
import { updateJobStatus, markJobFailed, incrementRetryCount } from './provisioning-queue'
import { ensureSubscriptionLinked } from './steps/ensure-subscription'
import { ensureTwilioSubaccount } from './steps/ensure-twilio-subaccount'
import { ensureTwilioNumber } from './steps/ensure-twilio-number'
import { ensureWhatsAppIntegration } from './steps/ensure-whatsapp-integration'
import { ensureEmailCredentials } from './steps/ensure-email-credentials'
import { seedDefaultAiConfig } from './steps/seed-default-ai-config'
import { runSmokeTests } from './steps/run-smoke-tests'
import type { StepResult } from './steps/ensure-subscription'

const PROVISIONING_STEPS = [
  { name: 'ensure_subscription', fn: ensureSubscriptionLinked, weight: 10 },
  { name: 'ensure_twilio_subaccount', fn: ensureTwilioSubaccount, weight: 15 },
  { name: 'ensure_twilio_number', fn: ensureTwilioNumber, weight: 20 },
  { name: 'ensure_whatsapp_integration', fn: ensureWhatsAppIntegration, weight: 15 },
  { name: 'ensure_email_credentials', fn: ensureEmailCredentials, weight: 10 },
  { name: 'seed_default_ai_config', fn: seedDefaultAiConfig, weight: 15 },
  { name: 'run_smoke_tests', fn: runSmokeTests, weight: 15 },
]

const TOTAL_WEIGHT = PROVISIONING_STEPS.reduce((sum, step) => sum + step.weight, 0)

export interface ProvisioningContext {
  jobId: string
  workspaceId: string
  currentProgress: number
  completedSteps: string[]
  result: any
}

/**
 * Run provisioning pipeline for a workspace
 */
export async function runProvisioning(
  context: ProvisioningContext
): Promise<{ success: boolean; error?: string }> {
  const { jobId, workspaceId, currentProgress, completedSteps, result } = context

  logger.info(
    { jobId, workspaceId, currentProgress, completedSteps: completedSteps.length },
    'Starting provisioning orchestration'
  )

  try {
    await updateJobStatus(jobId, 'in_progress', {
      progress: currentProgress,
      result,
    })

    let progress = currentProgress
    const steps = result.steps || []
    const completed = new Set(completedSteps)

    for (const step of PROVISIONING_STEPS) {
      if (completed.has(step.name)) {
        logger.debug({ jobId, step: step.name }, 'Step already completed, skipping')
        continue
      }

      logger.info({ jobId, workspaceId, step: step.name }, 'Executing provisioning step')

      const stepResult: StepResult = await step.fn(workspaceId)

      steps.push({
        name: step.name,
        status: stepResult.status,
        details: stepResult.details,
        error: stepResult.error,
        timestamp: new Date().toISOString(),
      })

      if (stepResult.status === 'completed' || stepResult.status === 'skipped') {
        progress += step.weight
        completed.add(step.name)
      }

      const progressPercent = Math.min(Math.round((progress / TOTAL_WEIGHT) * 100), 100)

      await updateJobStatus(jobId, 'in_progress', {
        progress: progressPercent,
        result: {
          ...result,
          steps,
          completedSteps: Array.from(completed),
        },
      })

      logger.info(
        {
          jobId,
          step: step.name,
          status: stepResult.status,
          progress: progressPercent,
        },
        'Step completed'
      )

      if (stepResult.status === 'failed' && step.name === 'ensure_subscription') {
        logger.error(
          { jobId, step: step.name, error: stepResult.error },
          'Critical step failed, stopping provisioning'
        )

        await markJobFailed(jobId, stepResult.error || 'Critical step failed', {
          ...result,
          steps,
          completedSteps: Array.from(completed),
        })

        return {
          success: false,
          error: stepResult.error || 'Critical step failed',
        }
      }

      if (stepResult.status === 'failed') {
        logger.warn(
          { jobId, step: step.name, error: stepResult.error },
          'Non-critical step failed, continuing'
        )
      }
    }

    await updateJobStatus(jobId, 'completed', {
      progress: 100,
      result: {
        ...result,
        steps,
        completedSteps: Array.from(completed),
        completedAt: new Date().toISOString(),
      },
    })

    logger.info(
      { jobId, workspaceId, stepsCompleted: completed.size },
      'Provisioning completed successfully'
    )

    return { success: true }
  } catch (error: any) {
    logger.error({ error, jobId, workspaceId }, 'Provisioning orchestration failed')

    const retryCount = await incrementRetryCount(jobId)

    const { prisma } = await import('@/lib/prisma')
    const job = await prisma.provisioningJob.findUnique({
      where: { id: jobId },
    })

    if (job && retryCount >= job.maxRetries) {
      await markJobFailed(jobId, error.message || 'Provisioning failed', {
        ...result,
        error: error.message,
        retryCount,
      })

      logger.error(
        { jobId, retryCount, maxRetries: job.maxRetries },
        'Max retries exceeded, job failed'
      )
    } else {
      await updateJobStatus(jobId, 'pending', {
        result: {
          ...result,
          lastError: error.message,
          retryCount,
        },
      })

      logger.info({ jobId, retryCount }, 'Job reset to pending for retry')
    }

    return {
      success: false,
      error: error.message || 'Provisioning failed',
    }
  }
}

/**
 * Resume provisioning from last checkpoint
 */
export async function resumeProvisioning(job: {
  id: string
  workspaceId: string
  progress: number
  result: any
}): Promise<{ success: boolean; error?: string }> {
  const completedSteps = job.result?.completedSteps || []

  logger.info(
    { jobId: job.id, workspaceId: job.workspaceId, progress: job.progress },
    'Resuming provisioning from checkpoint'
  )

  return runProvisioning({
    jobId: job.id,
    workspaceId: job.workspaceId,
    currentProgress: job.progress,
    completedSteps,
    result: job.result || {},
  })
}
