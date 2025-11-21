/**
 * PILAR AUTOPILOT - Provisioning Runner Endpoint
 * 
 * Processes pending provisioning jobs with workspace locking
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { acquireLock } from '@/lib/autopilot/locks'
import { getNextPendingJob, getInProgressJob } from '@/lib/autopilot/provisioning-queue'
import { runProvisioning, resumeProvisioning } from '@/lib/autopilot/provisioning-orchestrator'

export async function POST(request: NextRequest) {
  try {
    logger.info('Provisioning runner invoked')

    const pendingJob = await getNextPendingJob()

    if (!pendingJob) {
      logger.debug('No pending provisioning jobs')
      return NextResponse.json({
        success: true,
        message: 'No pending jobs',
      })
    }

    const { id: jobId, workspaceId } = pendingJob

    logger.info({ jobId, workspaceId }, 'Processing provisioning job')

    const lock = await acquireLock(workspaceId, 'provisioning', {
      ttlMs: 300000, // 5 minutes
      retryAttempts: 1,
    })

    if (!lock) {
      logger.warn({ jobId, workspaceId }, 'Failed to acquire lock, workspace busy')
      return NextResponse.json({
        success: false,
        error: 'Workspace busy',
      })
    }

    try {
      const inProgressJob = await getInProgressJob(workspaceId)

      let result
      if (inProgressJob) {
        logger.info({ jobId: inProgressJob.id, workspaceId }, 'Resuming in-progress job')
        result = await resumeProvisioning(inProgressJob)
      } else {
        result = await runProvisioning({
          jobId: pendingJob.id,
          workspaceId: pendingJob.workspaceId,
          currentProgress: pendingJob.progress || 0,
          completedSteps: pendingJob.result?.completedSteps || [],
          result: pendingJob.result || {},
        })
      }

      return NextResponse.json({
        success: result.success,
        jobId,
        error: result.error,
      })
    } finally {
      await lock.release()
    }
  } catch (error: any) {
    logger.error({ error }, 'Provisioning runner error')
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Runner failed',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
