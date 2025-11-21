export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getVoicePreview } from '@/services/voice/elevenlabs'
import { logger } from '@/lib/logger'

/**
 * GET /api/voices/preview?voiceId=xxx
 * Returns audio preview for a specific voice
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const voiceId = searchParams.get('voiceId')
    
    if (!voiceId) {
      return NextResponse.json(
        { error: 'voiceId parameter is required' },
        { status: 400 }
      )
    }
    
    const audioBuffer = await getVoicePreview(voiceId)
    
    if (!audioBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate preview' },
        { status: 500 }
      )
    }
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error: any) {
    logger.error({ error }, 'Failed to generate voice preview')
    return NextResponse.json(
      { error: 'Failed to generate preview', message: error.message },
      { status: 500 }
    )
  }
}
