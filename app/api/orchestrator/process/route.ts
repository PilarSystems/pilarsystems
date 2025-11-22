/**
 * Orchestrator API Route
 * 
 * POST /api/orchestrator/process
 */

import { NextRequest, NextResponse } from 'next/server'
import { orchestrate } from '@/src/server/orchestrator/orchestrator.service'
import { RawMessage, Channel } from '@/src/server/orchestrator/orchestrator.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const rawMessage: RawMessage = {
      channel: body.channel as Channel,
      payload: body.payload,
      timestamp: new Date(),
      tenantId: body.tenantId,
      userId: body.userId,
    }

    const result = await orchestrate(rawMessage)

    return NextResponse.json({
      success: result.success,
      result,
    })
  } catch (error) {
    console.error('Error in /api/orchestrator/process:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process message',
      },
      { status: 500 }
    )
  }
}
