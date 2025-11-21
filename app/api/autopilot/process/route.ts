/**
 * Autopilot Process API
 * 
 * Background processor for events and jobs
 * Called by Vercel cron or manual trigger
 */

import { NextRequest, NextResponse } from 'next/server'
import { eventBus } from '@/lib/autopilot/event-bus'
import { jobQueue } from '@/lib/autopilot/job-queue'
import { lockManager } from '@/lib/autopilot/distributed-lock-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max

/**
 * POST /api/autopilot/process
 * Process pending events and jobs
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-vercel-cron-secret')

    if (cronSecret !== process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lock = await lockManager.acquireLock(
      'autopilot-process',
      'system',
      55000, // 55 seconds (less than maxDuration)
      'system'
    )

    if (!lock) {
      return NextResponse.json({
        success: false,
        message: 'Another process is already running'
      })
    }

    try {
      const eventsProcessed = await eventBus.processPendingEvents(100)

      const jobsProcessed = await jobQueue.processPendingJobs(50, 'cron-worker')

      const stuckJobsReleased = await jobQueue.releaseStuckJobs()

      const locksCleanedUp = await lockManager.cleanupExpiredLocks()

      const duration = Date.now() - startTime

      return NextResponse.json({
        success: true,
        stats: {
          eventsProcessed,
          jobsProcessed,
          stuckJobsReleased,
          locksCleanedUp,
          durationMs: duration
        }
      })
    } finally {
      await lock.release()
    }
  } catch (error) {
    console.error('Error processing autopilot:', error)
    return NextResponse.json(
      {
        error: 'Failed to process autopilot',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/autopilot/process
 * Get processor status
 */
export async function GET() {
  try {
    const isLocked = await lockManager.isLocked('autopilot-process')

    return NextResponse.json({
      success: true,
      status: isLocked ? 'running' : 'idle'
    })
  } catch (error) {
    console.error('Error checking processor status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
