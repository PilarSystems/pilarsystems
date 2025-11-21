/**
 * Autopilot Events API
 * 
 * Manage autopilot events (create, list, stats)
 */

import { NextRequest, NextResponse } from 'next/server'
import { eventBus, CreateEventOptions } from '@/lib/autopilot/event-bus'
import { rateLimiter } from '@/lib/autopilot/rate-limiter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/autopilot/events
 * List events for workspace
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

    const stats = await eventBus.getStats(workspaceId)

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/autopilot/events
 * Create new event
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workspaceId, type, payload, scheduledAt, maxAttempts } = body

    if (!workspaceId || !type || !payload) {
      return NextResponse.json(
        { error: 'workspaceId, type, and payload required' },
        { status: 400 }
      )
    }

    const hasbudget = await rateLimiter.checkBudget(workspaceId, 'events', 1)
    if (!hasbudget) {
      return NextResponse.json(
        { error: 'Event budget exceeded for workspace' },
        { status: 429 }
      )
    }

    const options: CreateEventOptions = {
      workspaceId,
      type,
      payload,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      maxAttempts
    }

    const event = await eventBus.createEvent(options)

    await rateLimiter.consumeBudget(workspaceId, 'events', 1)

    return NextResponse.json({
      success: true,
      event
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
