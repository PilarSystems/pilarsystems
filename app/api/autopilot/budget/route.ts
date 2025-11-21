/**
 * Autopilot Budget API
 * 
 * Get budget statistics and remaining capacity
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/lib/autopilot/rate-limiter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/autopilot/budget
 * Get budget statistics for workspace
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

    const stats = await rateLimiter.getStats(workspaceId)

    return NextResponse.json({
      success: true,
      budget: stats
    })
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    )
  }
}
