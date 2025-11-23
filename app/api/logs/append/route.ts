/**
 * POST /api/logs/append
 * 
 * Append a new log entry (for internal use).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { logMessageReceived, logMessageSent, logError, logSystem } from '@/src/server/logs/log.service'
import { LogType } from '@/src/server/logs/log.types'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'

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

    const body = await request.json()
    const { type, channel, content, metadata } = body

    if (!type || !channel) {
      return NextResponse.json(
        { success: false, error: 'Type and channel are required' },
        { status: 400 }
      )
    }

    let log

    switch (type) {
      case LogType.MESSAGE_RECEIVED:
        log = logMessageReceived(session.tenantId, channel as Channel, content, metadata)
        break

      case LogType.MESSAGE_SENT:
        log = logMessageSent(session.tenantId, channel as Channel, content, metadata)
        break

      case LogType.ERROR:
        log = logError(session.tenantId, channel as Channel, content, metadata)
        break

      case LogType.SYSTEM:
        log = logSystem(session.tenantId, content, metadata?.level, metadata)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid log type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      log,
    })
  } catch (error) {
    console.error('[API] Error appending log:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to append log',
      },
      { status: 500 }
    )
  }
}
