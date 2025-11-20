import { NextRequest, NextResponse } from 'next/server'
import { getVoices } from '@/services/voice/elevenlabs'
import { isFeatureEnabled, disabledFeatureResponse } from '@/lib/features'
import { logger } from '@/lib/logger'

/**
 * GET /api/voices
 * Returns list of available ElevenLabs voices
 */
export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('elevenlabs')) {
      logger.warn('Voice list requested but ElevenLabs is disabled')
      return NextResponse.json(disabledFeatureResponse('elevenlabs'), { status: 200 })
    }

    const voices = await getVoices()
    
    const simplifiedVoices = voices.map(voice => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category,
      description: voice.description,
      labels: voice.labels,
    }))
    
    return NextResponse.json({ voices: simplifiedVoices })
  } catch (error: any) {
    logger.error({ error }, 'Failed to fetch voices')
    return NextResponse.json(
      { error: 'Failed to fetch voices', message: error.message },
      { status: 500 }
    )
  }
}
