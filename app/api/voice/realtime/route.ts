/**
 * Voice Realtime API Route
 * 
 * Provides WebSocket/Stream interface for real-time voice processing.
 * Supports both text simulation and audio streaming.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVoiceEngine } from '@/src/server/core/voice/voiceEngine.service'
import { VoiceEventType } from '@/src/server/core/voice/voice.types'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/voice/realtime
 * 
 * Handle voice events and text simulation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, callId, text, audio, tenantId } = body

    if (!callId) {
      return NextResponse.json(
        { error: 'callId is required' },
        { status: 400 }
      )
    }

    const voiceEngine = getVoiceEngine()

    if (type === 'text' && text) {
      logger.info({ callId, text, tenantId }, 'Simulating text input')

      const response = await voiceEngine.simulateTextInput(callId, text, tenantId)

      return NextResponse.json({
        success: true,
        callId,
        response: {
          text: response.text,
          audio: response.audio,
          duration: response.duration,
          timestamp: response.timestamp,
        },
      })
    }

    if (type === 'audio' && audio) {
      logger.info({ callId, tenantId }, 'Processing audio')

      await voiceEngine.handleIncomingVoiceEvent({
        type: VoiceEventType.CALL_MEDIA,
        callId,
        metadata: {
          callId,
          from: 'api',
          tenantId,
          timestamp: new Date(),
        },
        data: {
          audioChunk: audio,
        },
      })

      return NextResponse.json({
        success: true,
        callId,
        message: 'Audio processed',
      })
    }

    return NextResponse.json(
      { error: 'Invalid request: type must be "text" or "audio"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('[API] Error in POST /api/voice/realtime:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/voice/realtime
 * 
 * Get active calls and stats.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const callId = searchParams.get('callId')

    const voiceEngine = getVoiceEngine()

    if (callId) {
      const stats = voiceEngine.getCallStats(callId)
      
      if (!stats) {
        return NextResponse.json(
          { error: 'Call not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        callId,
        stats,
      })
    }

    const activeCalls = voiceEngine.getActiveCalls()

    return NextResponse.json({
      success: true,
      activeCalls,
      count: activeCalls.length,
    })

  } catch (error) {
    console.error('[API] Error in GET /api/voice/realtime:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
