/**
 * Autopilot Job Queue
 * 
 * Job processing system with priority, idempotency, and distributed locking
 */

import { prisma } from '@/lib/db'
import crypto from 'crypto'

export type JobType = string

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'

export interface AutopilotJob {
  id: string
  workspaceId: string
  type: JobType
  payload: Record<string, any>
  status: JobStatus
  priority: number
  attempts: number
  maxAttempts: number
  scheduledAt: Date
  startedAt?: Date | null
  completedAt?: Date | null
  idempotencyKey: string
  lockedAt?: Date | null
  lockedBy?: string | null
  result?: any
  error?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateJobOptions {
  workspaceId: string
  type: JobType
  payload: Record<string, any>
  priority?: number
  scheduledAt?: Date
  maxAttempts?: number
  idempotencyKey?: string
}

export interface JobProcessor {
  canHandle(jobType: JobType): boolean
  process(job: AutopilotJob): Promise<JobResult>
  getProcessorName(): string
}

export interface JobResult {
  success: boolean
  result?: any
  error?: string
  reschedule?: Date
}

class JobQueue {
  private processors: Map<JobType, JobProcessor> = new Map()
  private processingLock = new Set<string>()

  /**
   * Register a job processor
   */
  register(jobType: JobType, processor: JobProcessor): void {
    this.processors.set(jobType, processor)
  }

  /**
   * Enqueue a new job with idempotency
   */
  async enqueue(options: CreateJobOptions): Promise<AutopilotJob> {
    const idempotencyKey = options.idempotencyKey || this.generateIdempotencyKey(options)

    const existing = await prisma.autopilotJob.findUnique({
      where: { idempotencyKey }
    })

    if (existing) {
      return existing as AutopilotJob
    }

    const job = await prisma.autopilotJob.create({
      data: {
        workspaceId: options.workspaceId,
        type: options.type,
        payload: options.payload,
        priority: options.priority || 5,
        scheduledAt: options.scheduledAt || new Date(),
        maxAttempts: options.maxAttempts || 3,
        idempotencyKey,
        status: 'pending'
      }
    })

    return job as AutopilotJob
  }

  /**
   * Dequeue and process next job
   */
  async dequeue(workerType: string = 'default'): Promise<AutopilotJob | null> {
    const job = await prisma.$transaction(async (tx) => {
      const nextJob = await tx.autopilotJob.findFirst({
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

      if (!nextJob) return null

      const locked = await tx.autopilotJob.updateMany({
        where: {
          id: nextJob.id,
          lockedAt: null
        },
        data: {
          status: 'in_progress',
          lockedAt: new Date(),
          lockedBy: workerType,
          startedAt: new Date(),
          attempts: { increment: 1 }
        }
      })

      if (locked.count === 0) return null

      return tx.autopilotJob.findUnique({
        where: { id: nextJob.id }
      })
    })

    return job as AutopilotJob | null
  }

  /**
   * Process pending jobs
   */
  async processPendingJobs(limit: number = 50, workerType: string = 'default'): Promise<number> {
    let processed = 0

    for (let i = 0; i < limit; i++) {
      const job = await this.dequeue(workerType)
      if (!job) break

      if (this.processingLock.has(job.id)) continue

      try {
        this.processingLock.add(job.id)
        await this.processJob(job)
        processed++
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)
      } finally {
        this.processingLock.delete(job.id)
      }
    }

    return processed
  }

  /**
   * Process a single job
   */
  private async processJob(job: AutopilotJob): Promise<void> {
    try {
      const processor = this.processors.get(job.type)

      if (!processor) {
        throw new Error(`No processor registered for job type: ${job.type}`)
      }

      const result = await processor.process(job)

      if (result.success) {
        await prisma.autopilotJob.update({
          where: { id: job.id },
          data: {
            status: 'completed',
            result: result.result,
            completedAt: new Date(),
            lockedAt: null,
            lockedBy: null
          }
        })
      } else if (result.reschedule) {
        await prisma.autopilotJob.update({
          where: { id: job.id },
          data: {
            status: 'pending',
            scheduledAt: result.reschedule,
            error: result.error,
            lockedAt: null,
            lockedBy: null
          }
        })
      } else {
        await this.handleJobFailure(job, result.error || 'Job processing failed')
      }
    } catch (error) {
      await this.handleJobFailure(job, error instanceof Error ? error.message : String(error))
    }
  }

  /**
   * Handle job processing failure
   */
  private async handleJobFailure(job: AutopilotJob, error: string): Promise<void> {
    const updatedJob = await prisma.autopilotJob.findUnique({
      where: { id: job.id }
    })

    if (!updatedJob) return

    const shouldRetry = updatedJob.attempts < updatedJob.maxAttempts

    if (shouldRetry) {
      const backoffMs = Math.pow(2, updatedJob.attempts) * 1000
      const retryAt = new Date(Date.now() + backoffMs)

      await prisma.autopilotJob.update({
        where: { id: job.id },
        data: {
          status: 'pending',
          scheduledAt: retryAt,
          error,
          lockedAt: null,
          lockedBy: null
        }
      })
    } else {
      await prisma.autopilotJob.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error,
          completedAt: new Date(),
          lockedAt: null,
          lockedBy: null
        }
      })
    }
  }

  /**
   * Complete a job manually
   */
  async complete(jobId: string, result: any): Promise<void> {
    await prisma.autopilotJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        result,
        completedAt: new Date(),
        lockedAt: null,
        lockedBy: null
      }
    })
  }

  /**
   * Fail a job manually
   */
  async fail(jobId: string, error: string): Promise<void> {
    await this.handleJobFailure({ id: jobId } as AutopilotJob, error)
  }

  /**
   * Cancel a job
   */
  async cancel(jobId: string): Promise<void> {
    await prisma.autopilotJob.update({
      where: { id: jobId },
      data: {
        status: 'cancelled',
        completedAt: new Date(),
        lockedAt: null,
        lockedBy: null
      }
    })
  }

  /**
   * Generate idempotency key
   */
  private generateIdempotencyKey(options: CreateJobOptions): string {
    const payload = JSON.stringify({
      workspaceId: options.workspaceId,
      type: options.type,
      payload: options.payload,
      scheduledAt: options.scheduledAt?.toISOString()
    })

    return crypto.createHash('sha256').update(payload).digest('hex')
  }

  /**
   * Get job statistics
   */
  async getStats(workspaceId?: string) {
    const where = workspaceId ? { workspaceId } : {}

    const [total, pending, inProgress, completed, failed, cancelled] = await Promise.all([
      prisma.autopilotJob.count({ where }),
      prisma.autopilotJob.count({ where: { ...where, status: 'pending' } }),
      prisma.autopilotJob.count({ where: { ...where, status: 'in_progress' } }),
      prisma.autopilotJob.count({ where: { ...where, status: 'completed' } }),
      prisma.autopilotJob.count({ where: { ...where, status: 'failed' } }),
      prisma.autopilotJob.count({ where: { ...where, status: 'cancelled' } })
    ])

    return { total, pending, inProgress, completed, failed, cancelled }
  }

  /**
   * Get queue depth
   */
  async getQueueDepth(workspaceId?: string): Promise<number> {
    const where = workspaceId ? { workspaceId, status: 'pending' as const } : { status: 'pending' as const }
    return prisma.autopilotJob.count({ where })
  }

  /**
   * Clean up old completed jobs
   */
  async cleanup(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const result = await prisma.autopilotJob.deleteMany({
      where: {
        status: { in: ['completed', 'cancelled'] },
        completedAt: { lt: cutoffDate }
      }
    })

    return result.count
  }

  /**
   * Release stuck jobs (locked for more than 5 minutes)
   */
  async releaseStuckJobs(): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const result = await prisma.autopilotJob.updateMany({
      where: {
        status: 'in_progress',
        lockedAt: { lt: fiveMinutesAgo }
      },
      data: {
        status: 'pending',
        lockedAt: null,
        lockedBy: null
      }
    })

    return result.count
  }
}

export const jobQueue = new JobQueue()
