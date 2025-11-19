import { prisma } from './prisma'
import { logger } from './logger'
import { ProvisioningJobType, JobStatus } from '@prisma/client'

export interface JobData {
  workspaceId: string
  [key: string]: any
}

export interface JobResult {
  success: boolean
  data?: any
  error?: string
}

/**
 * Simple job queue implementation compatible with Vercel serverless
 * For production, consider using Upstash QStash or similar
 */
export class JobQueue {
  /**
   * Enqueue a new provisioning job
   */
  async enqueue(
    workspaceId: string,
    jobType: ProvisioningJobType,
    data?: Record<string, any>
  ): Promise<string> {
    try {
      const job = await prisma.provisioningJob.create({
        data: {
          workspaceId,
          jobType,
          status: 'pending',
          progress: 0,
          result: data || {},
        },
      })

      logger.info({ jobId: job.id, workspaceId, jobType }, 'Job enqueued')
      
      
      return job.id
    } catch (error) {
      logger.error({ error, workspaceId, jobType }, 'Failed to enqueue job')
      throw error
    }
  }

  /**
   * Update job progress
   */
  async updateProgress(jobId: string, progress: number, status?: JobStatus) {
    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        progress,
        ...(status && { status }),
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Mark job as completed
   */
  async complete(jobId: string, result: any) {
    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        result,
        completedAt: new Date(),
      },
    })

    logger.info({ jobId }, 'Job completed')
  }

  /**
   * Mark job as failed
   */
  async fail(jobId: string, error: string) {
    const job = await prisma.provisioningJob.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    const shouldRetry = job.retryCount < job.maxRetries

    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        status: shouldRetry ? 'pending' : 'failed',
        error,
        retryCount: job.retryCount + 1,
        updatedAt: new Date(),
        ...(shouldRetry ? {} : { completedAt: new Date() }),
      },
    })

    logger.error({ jobId, error, retryCount: job.retryCount + 1 }, 'Job failed')
  }

  /**
   * Get job status
   */
  async getStatus(jobId: string) {
    const job = await prisma.provisioningJob.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    return {
      id: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    }
  }

  /**
   * Get all jobs for a workspace
   */
  async getWorkspaceJobs(workspaceId: string, jobType?: ProvisioningJobType) {
    return prisma.provisioningJob.findMany({
      where: {
        workspaceId,
        ...(jobType && { jobType }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Cancel a job
   */
  async cancel(jobId: string) {
    await prisma.provisioningJob.update({
      where: { id: jobId },
      data: {
        status: 'cancelled',
        completedAt: new Date(),
      },
    })

    logger.info({ jobId }, 'Job cancelled')
  }
}

export const jobQueue = new JobQueue()
