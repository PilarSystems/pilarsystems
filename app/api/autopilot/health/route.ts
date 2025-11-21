/**
 * PILAR AUTOPILOT - Health Endpoint
 * 
 * Returns health status for workspace or all workspaces
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getWorkspaceHealth, getAllWorkspacesHealth } from '@/lib/autopilot/health'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const all = searchParams.get('all') === 'true'

    if (all) {
      const limit = parseInt(searchParams.get('limit') || '50')
      const healthStatuses = await getAllWorkspacesHealth(limit)

      return NextResponse.json({
        success: true,
        workspaces: healthStatuses,
      })
    }

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    const health = await getWorkspaceHealth(workspaceId)

    return NextResponse.json({
      success: true,
      health,
    })
  } catch (error: any) {
    logger.error({ error }, 'Failed to get health status')
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get health status',
      },
      { status: 500 }
    )
  }
}
