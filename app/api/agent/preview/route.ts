/**
 * Agent Preview API Route
 * 
 * Test agent with orchestrator
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'
import { orchestrate } from '@/src/server/orchestrator/orchestrator.service'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/agent/preview
 * 
 * Test agent with message
 * 
 * Request body:
 * {
 *   "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "response": "Hey! 👋 Super, dass du dich für unser Studio interessierst! ..."
 * }
 */
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
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log(`[AGENT] Preview for tenant: ${session.tenantId}, message: ${message}`)

    const profile = await prisma.agentProfile.findUnique({
      where: { tenantId: session.tenantId },
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Agent profile not found' },
        { status: 404 }
      )
    }

    const result = await orchestrate({
      channel: Channel.WHATSAPP,
      payload: {
        from: 'preview-user',
        text: message,
        name: 'Test User',
      },
      timestamp: new Date(),
      tenantId: session.tenantId,
    })

    console.log(`[AGENT] Preview result:`, result)

    return NextResponse.json({
      success: true,
      response: result.response?.content || 'No response generated',
      intent: result.intent?.intent,
      confidence: result.intent?.confidence,
    })

  } catch (error) {
    console.error('[AGENT] Error in POST /api/agent/preview:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
