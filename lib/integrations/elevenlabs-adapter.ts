/**
 * ElevenLabs Adapter with Graceful Degradation
 */

import { isElevenLabsAvailable } from './index'
import { logger } from '@/lib/logger'

export async function getAvailableVoices() {
  const status = isElevenLabsAvailable()
  
  if (!status.available) {
    logger.warn(`ElevenLabs not available: ${status.reason}`)
    return {
      success: false,
      error: status.reason,
      voices: []
    }
  }
  
  try {
    const { getCachedConfig } = await import('@/lib/config/env')
    const config = getCachedConfig()
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': config.elevenlabsApiKey!
      }
    })
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      voices: data.voices || []
    }
  } catch (error) {
    logger.error({ error }, 'Failed to fetch ElevenLabs voices')
    return {
      success: false,
      error: 'Fehler beim Abrufen der Stimmen',
      voices: []
    }
  }
}

export async function previewVoice(voiceId: string, text: string) {
  const status = isElevenLabsAvailable()
  
  if (!status.available) {
    return {
      success: false,
      error: status.reason,
      audioUrl: null
    }
  }
  
  try {
    const { getCachedConfig } = await import('@/lib/config/env')
    const config = getCachedConfig()
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': config.elevenlabsApiKey!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2'
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }
    
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    
    return {
      success: true,
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`
    }
  } catch (error) {
    logger.error({ error, voiceId }, 'Failed to preview voice')
    return {
      success: false,
      error: 'Fehler beim Generieren der Sprachvorschau',
      audioUrl: null
    }
  }
}
