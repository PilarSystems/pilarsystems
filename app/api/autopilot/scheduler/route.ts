/**
 * PILAR AUTOPILOT - WhatsApp Coach Scheduler Endpoint
 * 
 * Processes due WhatsApp Coach followups
 * Triggered by Vercel Cron or opportunistically
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { logger } from '@/lib/logger'
import { processAllWorkspaces } from '@/lib/autopilot/scheduler'

export async function POST(request: NextRequest) {
  try {
    logger.info('WhatsApp Coach scheduler invoked')

    const result = await processAllWorkspaces(50)

    logger.info(
      {
        workspacesProcessed: result.workspacesProcessed,
        sent: result.totalResults.sent,
        failed: result.totalResults.failed,
      },
      'Scheduler tick completed'
    )

    return NextResponse.json({
      success: true,
      workspacesProcessed: result.workspacesProcessed,
      results: result.totalResults,
    })
  } catch (error: any) {
    logger.error({ error }, 'Scheduler error')
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Scheduler failed',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
