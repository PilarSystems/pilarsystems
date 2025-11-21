/**
 * PILAR AUTOPILOT v5.0 - Operator Runtime Endpoint
 * 
 * Invoked by:
 * - Vercel Cron (daily)
 * - Manual trigger
 * - Opportunistic trigger (rate-limited)
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { runOperator } from '@/lib/operator/runtime'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    logger.info('Operator runtime triggered')

    const result = await runOperator({
      maxSignals: 100,
      maxActions: 50,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    logger.error({ error }, 'Operator runtime endpoint failed')
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
