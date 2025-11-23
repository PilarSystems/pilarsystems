/**
 * Voice Test API Route
 * 
 * Test Voice Engine with realtime processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'
import { getRealtimeEngine } from '@/src/server/core/voice/voice.realtime'
import { orchestrate } from '@/src/server/orchestrator/orchestrator.service'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'
import { logOrchestratorResult } from '@/src/server/logs/log.service'
import { runWorkflowsForTrigger } from '@/src/server/workflows/workflow.runner'
import { TriggerType } from '@/src/server/workflows/workflow.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/test/voice
 * 
 * Test voice input with orchestrator
 * 
 * Request body:
 * {
 *   "text": "Hallo, ich möchte einen Trainingsplan",
 *   "generateAudio": true
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "result": {
 *     "message": {...},
 *     "intent": {...},
 *     "routing": {...},
 *     "response": {...},
 *     "audio": "base64_encoded_audio"
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
    const { text, generateAudio = true } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      )
    }

    console.log(`[TEST] Voice test for tenant: ${session.tenantId}, text: ${text}`)

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
      channel: Channel.VOICE,
      payload: {
        from: 'test-user',
        transcript: text,
        text: text,
        caller: 'Test User',
      },
      timestamp: new Date(),
      tenantId: session.tenantId,
    })

    console.log(`[TEST] Voice test result:`, result)

    logOrchestratorResult(
      session.tenantId,
      Channel.VOICE,
      result,
      {
        userId: 'test-user',
        userName: 'Test User',
        callId: `test-${Date.now()}`,
      }
    )

    await runWorkflowsForTrigger(
      session.tenantId,
      TriggerType.VOICE_CALL,
      {
        channel: Channel.VOICE,
        content: text,
        from: 'test-user',
        intent: result.intent.intent,
        intentConfidence: result.intent.confidence,
      }
    )

    let audioData = null
    if (generateAudio && result.response?.content) {
      try {
        const realtimeEngine = getRealtimeEngine()
        const callId = `test-${Date.now()}`
        
        await realtimeEngine.createSession(callId, {
          tenantId: session.tenantId,
          voice: profile?.voiceModel || 'alloy',
          language: profile?.language || 'de',
        })

        const voiceResponse = await realtimeEngine.generateVoiceResponse(
          callId,
          result.response.content,
          {
            tenantId: session.tenantId,
            voice: profile?.voiceModel || 'alloy',
            language: profile?.language || 'de',
          }
        )

        audioData = voiceResponse.audio

        await realtimeEngine.endSession(callId)
      } catch (error) {
        console.error('[TEST] Error generating audio:', error)
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        message: result.message,
        intent: result.intent,
        routing: result.routing,
        response: result.response,
        audio: audioData,
      },
      debug: {
        tenantId: session.tenantId,
        tenantName: tenant?.name,
        agentProfile: profile ? {
          name: profile.name,
          tone: profile.tone,
          language: profile.language,
          voiceModel: profile.voiceModel,
        } : null,
        timestamp: new Date().toISOString(),
        audioGenerated: audioData !== null,
      },
    })

  } catch (error) {
    console.error('[TEST] Error in POST /api/test/voice:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
