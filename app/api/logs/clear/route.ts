/**
 * POST /api/logs/clear
 * 
 * Clear all logs for the current tenant.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { clearLogs } from '@/src/server/logs/log.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    clearLogs(session.tenantId)

    return NextResponse.json({
      success: true,
      message: 'Logs cleared successfully',
    })
  } catch (error) {
    console.error('[API] Error clearing logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear logs',
      },
      { status: 500 }
    )
  }
}
