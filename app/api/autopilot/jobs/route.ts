/**
 * Autopilot Jobs API
 * 
 * Manage autopilot jobs (create, list, stats)
 */

import { NextRequest, NextResponse } from 'next/server'
import { jobQueue, CreateJobOptions } from '@/lib/autopilot/job-queue'
import { rateLimiter } from '@/lib/autopilot/rate-limiter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/autopilot/jobs
 * List jobs for workspace
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const stats = await jobQueue.getStats(workspaceId)
    const queueDepth = await jobQueue.getQueueDepth(workspaceId)

    return NextResponse.json({
      success: true,
      stats,
      queueDepth
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/autopilot/jobs
 * Create new job
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workspaceId, type, payload, priority, scheduledAt, maxAttempts } = body

    if (!workspaceId || !type || !payload) {
      return NextResponse.json(
        { error: 'workspaceId, type, and payload required' },
        { status: 400 }
      )
    }

    const hasbudget = await rateLimiter.checkBudget(workspaceId, 'jobs', 1)
    if (!hasbudget) {
      return NextResponse.json(
        { error: 'Job budget exceeded for workspace' },
        { status: 429 }
      )
    }

    const options: CreateJobOptions = {
      workspaceId,
      type,
      payload,
      priority,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      maxAttempts
    }

    const job = await jobQueue.enqueue(options)

    await rateLimiter.consumeBudget(workspaceId, 'jobs', 1)

    return NextResponse.json({
      success: true,
      job
    })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}
