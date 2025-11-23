/**
 * GET /api/logs
 * 
 * Get message logs with filtering and pagination.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { getLogs, getLogStats } from '@/src/server/logs/log.service'
import { LogFilter } from '@/src/server/logs/log.types'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const channel = searchParams.get('channel') as Channel | null
    const level = searchParams.get('level') as any
    const type = searchParams.get('type') as any
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeStats = searchParams.get('includeStats') === 'true'

    const filter: LogFilter = {
      tenantId: session.tenantId,
      limit,
      offset,
    }

    if (channel) {
      filter.channel = channel
    }

    if (level) {
      filter.level = level
    }

    if (type) {
      filter.type = type
    }

    const logs = getLogs(filter)

    let stats = undefined
    if (includeStats) {
      stats = getLogStats(session.tenantId)
    }

    return NextResponse.json({
      success: true,
      logs,
      stats,
      pagination: {
        limit,
        offset,
        total: logs.length,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch logs',
      },
      { status: 500 }
    )
  }
}
