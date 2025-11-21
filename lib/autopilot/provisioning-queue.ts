/**
 * PILAR AUTOPILOT - Provisioning Queue
 * 
 * Manages provisioning job queue with idempotent enqueue
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { ProvisioningJobType, JobStatus } from '@prisma/client'

export interface EnqueueOptions {
  source: 'stripe' | 'onboarding' | 'manual'
  metadata?: Record<string, any>
}

/**
 * Enqueue a provisioning job (idempotent)
 * If a job is already in progress or pending, returns existing job
 */
export async function enqueueProvisioning(
  workspaceId: string,
  options: EnqueueOptions
): Promise<{ jobId: string; created: boolean }> {
  try {
    const existingJob = await prisma.provisioningJob.findFirst({
      where: {
        workspaceId,
        status: {
          in: ['pending', 'in_progress'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (existingJob) {
      logger.info(
        {
          workspaceId,
          jobId: existingJob.id,
          status: existingJob.status,
          source: options.source,
        },
        'Provisioning job already exists, skipping enqueue'
      )
      return {
        jobId: existingJob.id,
        created: false,
      }
    }

    const job = await prisma.provisioningJob.create({
      data: {
        workspaceId,
        jobType: 'full_provisioning' as ProvisioningJobType,
        status: 'pending' as JobStatus,
        progress: 0,
        result: {
          source: options.source,
          metadata: options.metadata || {},
          steps: [],
        },
        maxRetries: 3,
        retryCount: 0,
      },
    })

    logger.info(
      {
        workspaceId,
        jobId: job.id,
        source: options.source,
      },
      'Provisioning job enqueued'
    )

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'provisioning_started',
        description: `Provisioning job started (source: ${options.source})`,
        metadata: {
          jobId: job.id,
          source: options.source,
        },
      },
    })

    return {
      jobId: job.id,
      created: true,
    }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Failed to enqueue provisioning job')
    throw error
  }
}

/**
 * Get next pending provisioning job
 */
export async function getNextPendingJob(): Promise<{
  id: string
  workspaceId: string
  progress: number
  result: any
  retryCount: number
  maxRetries: number
} | null> {
  try {
    const job = await prisma.provisioningJob.findFirst({
      where: {
        status: 'pending',
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return job
  } catch (error) {
    logger.error({ error }, 'Failed to get next pending job')
    return null
  }
}

/**
 * Get in-progress job for a workspace
 */
export async function getInProgressJob(workspaceId: string): Promise<{
  id: string
  workspaceId: string
  progress: number
  result: any
  retryCount: number
  maxRetries: number
} | null> {
  try {
    const job = await prisma.provisioningJob.findFirst({
      where: {
        workspaceId,
        status: 'in_progress',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return job
  } catch (error) {
    logger.error({ error, workspaceId }, 'Failed to get in-progress job')
    return null
  }
}

/**
 * Update job status
 */
export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  updates?: {
    progress?: number
    result?: any
    error?: string
    retryCount?: number
  }
): Promise<void> {
  try {
    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        status,
        progress: updates?.progress,
        result: updates?.result,
        error: updates?.error,
        retryCount: updates?.retryCount,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
    })

    logger.debug({ jobId, status, progress: updates?.progress }, 'Job status updated')
  } catch (error) {
    logger.error({ error, jobId, status }, 'Failed to update job status')
    throw error
  }
}

/**
 * Mark job as failed
 */
export async function markJobFailed(
  jobId: string,
  error: string,
  result?: any
): Promise<void> {
  try {
    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error,
        result,
        completedAt: new Date(),
      },
    })

    logger.error({ jobId, error }, 'Job marked as failed')
  } catch (err) {
    logger.error({ error: err, jobId }, 'Failed to mark job as failed')
    throw err
  }
}

/**
 * Increment retry count
 */
export async function incrementRetryCount(jobId: string): Promise<number> {
  try {
    const job = await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        retryCount: {
          increment: 1,
        },
      },
    })

    return job.retryCount
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to increment retry count')
    throw error
  }
}
