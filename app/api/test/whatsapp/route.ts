/**
 * WhatsApp Test API Route
 * 
 * Test WhatsApp Engine with orchestrator
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'
import { orchestrate } from '@/src/server/orchestrator/orchestrator.service'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'
import { logOrchestratorResult } from '@/src/server/logs/log.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/test/whatsapp
 * 
 * Test WhatsApp message with orchestrator
 * 
 * Request body:
 * {
 *   "message": "Hallo, ich möchte einen Trainingsplan"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "result": {
 *     "message": {...},
 *     "intent": {...},
 *     "routing": {...},
 *     "response": {...}
 *   }
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

    console.log(`[TEST] WhatsApp test for tenant: ${session.tenantId}, message: ${message}`)

    const profile = await prisma.agentProfile.findUnique({
      where: { tenantId: session.tenantId },
    })

    const tenant = await prisma.tenant.findUnique({
      where: { id: session.tenantId },
      select: {
        name: true,
        domain: true,
      },
    })

    const result = await orchestrate({
      channel: Channel.WHATSAPP,
      payload: {
        from: 'test-user',
        text: message,
        name: 'Test User',
      },
      timestamp: new Date(),
      tenantId: session.tenantId,
    })

    console.log(`[TEST] WhatsApp test result:`, result)

    logOrchestratorResult(
      session.tenantId,
      Channel.WHATSAPP,
      result,
      {
        userId: 'test-user',
        userName: 'Test User',
        phoneNumber: 'test-user',
      }
    )

    return NextResponse.json({
      success: true,
      result: {
        message: result.message,
        intent: result.intent,
        routing: result.routing,
        response: result.response,
      },
      debug: {
        tenantId: session.tenantId,
        tenantName: tenant?.name,
        agentProfile: profile ? {
          name: profile.name,
          tone: profile.tone,
          language: profile.language,
        } : null,
        timestamp: new Date().toISOString(),
      },
    })

  } catch (error) {
    console.error('[TEST] Error in POST /api/test/whatsapp:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
