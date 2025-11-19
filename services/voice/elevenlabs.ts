import { logger } from '@/lib/logger'

interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  labels: Record<string, string>
  description?: string
  preview_url?: string
}

interface ElevenLabsVoicesResponse {
  voices: ElevenLabsVoice[]
}

let elevenLabsApiKey: string | null = null

function getApiKey(): string {
  if (!elevenLabsApiKey) {
    elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || ''
    if (!elevenLabsApiKey) {
      logger.warn('ELEVENLABS_API_KEY not configured')
    }
  }
  return elevenLabsApiKey
}

/**
 * Fetch all available voices from ElevenLabs API
 */
export async function getVoices(): Promise<ElevenLabsVoice[]> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    logger.warn('ElevenLabs API key not configured, returning empty voice list')
    return []
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }

    const data: ElevenLabsVoicesResponse = await response.json()
    
    logger.info({ voiceCount: data.voices.length }, 'Fetched ElevenLabs voices')
    
    return data.voices
  } catch (error) {
    logger.error({ error }, 'Failed to fetch ElevenLabs voices')
    throw error
  }
}

/**
 * Get a specific voice by ID
 */
export async function getVoice(voiceId: string): Promise<ElevenLabsVoice | null> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    return null
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      headers: {
        'xi-api-key': apiKey,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }

    const voice: ElevenLabsVoice = await response.json()
    return voice
  } catch (error) {
    logger.error({ error, voiceId }, 'Failed to fetch ElevenLabs voice')
    throw error
  }
}

/**
 * Generate speech from text using a specific voice
 */
export async function textToSpeech(
  text: string,
  voiceId: string,
  options: {
    stability?: number
    similarity_boost?: number
    style?: number
    use_speaker_boost?: boolean
  } = {}
): Promise<ArrayBuffer> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured')
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarity_boost ?? 0.75,
            style: options.style ?? 0.0,
            use_speaker_boost: options.use_speaker_boost ?? true,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    
    logger.info({ voiceId, textLength: text.length, audioSize: audioBuffer.byteLength }, 'Generated speech')
    
    return audioBuffer
  } catch (error) {
    logger.error({ error, voiceId }, 'Failed to generate speech')
    throw error
  }
}

/**
 * Get preview audio for a voice (if available)
 */
export async function getVoicePreview(voiceId: string): Promise<ArrayBuffer | null> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    return null
  }

  try {
    const previewText = 'Hallo! Ich bin dein KI-Assistent für PILAR SYSTEMS. Wie kann ich dir heute helfen?'
    
    return await textToSpeech(previewText, voiceId, {
      stability: 0.5,
      similarity_boost: 0.75,
    })
  } catch (error) {
    logger.error({ error, voiceId }, 'Failed to generate voice preview')
    return null
  }
}
