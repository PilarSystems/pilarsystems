/**
 * Voice Engine Service
 * 
 * Main service for handling voice calls and integrating with the orchestrator.
 */

import { orchestrate } from '../../orchestrator/orchestrator.service'
import { Channel } from '../../orchestrator/orchestrator.types'
import { getSIPGateway } from './sipGateway.stub'
import { getRealtimeEngine } from './voice.realtime'
import { 
  VoiceEvent, 
  VoiceEventType, 
  VoiceConfig, 
  CallStats,
  VoiceResponse 
} from './voice.types'

/**
 * Default voice configuration
 */
const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  tenantId: 'default',
  personality: 'Du bist ein freundlicher KI-Assistent für Fitnessstudios. Antworte auf Deutsch, sei hilfsbereit und motivierend.',
  language: 'de',
  voice: 'alloy',
  temperature: 0.7,
  maxDuration: 300, // 5 minutes
  silenceTimeout: 10, // 10 seconds
  interruptible: true,
  studioRules: [],
}

/**
 * Voice Engine Service
 */
export class VoiceEngineService {
  private sipGateway = getSIPGateway()
  private realtimeEngine = getRealtimeEngine()
  private callStats: Map<string, CallStats> = new Map()

  constructor() {
    this.setupEventHandlers()
    console.log('[VOICE ENGINE] Service initialized')
  }

  /**
   * Setup event handlers for SIP gateway
   */
  private setupEventHandlers(): void {
    this.sipGateway.on(VoiceEventType.CALL_START, async (event) => {
      await this.handleCallStart(event)
    })

    this.sipGateway.on(VoiceEventType.CALL_MEDIA, async (event) => {
      await this.handleMediaEvent(event)
    })

    this.sipGateway.on(VoiceEventType.CALL_END, async (event) => {
      await this.handleCallEnd(event)
    })
  }

  /**
   * Get voice configuration for tenant
   */
  private async getVoiceConfig(tenantId?: string): Promise<VoiceConfig> {
    return {
      ...DEFAULT_VOICE_CONFIG,
      tenantId: tenantId || 'default',
    }
  }

  /**
   * Handle call start
   */
  private async handleCallStart(event: VoiceEvent): Promise<void> {
    console.log(`[VOICE ENGINE] Handling call start: ${event.callId}`)

    try {
      const config = await this.getVoiceConfig(event.metadata.tenantId)

      await this.realtimeEngine.createSession(event.callId, config)

      this.callStats.set(event.callId, {
        callId: event.callId,
        duration: 0,
        audioChunksReceived: 0,
        audioChunksSent: 0,
        transcriptLength: 0,
        responseCount: 0,
        errors: 0,
      })

      const greeting = 'Willkommen bei PILAR SYSTEMS. Wie kann ich Ihnen helfen?'
      await this.sendVoiceResponse(event.callId, greeting, config)

    } catch (error) {
      console.error('[VOICE ENGINE] Error handling call start:', error)
      this.incrementErrorCount(event.callId)
    }
  }

  /**
   * Handle media event (audio chunk)
   */
  private async handleMediaEvent(event: VoiceEvent): Promise<void> {
    const { callId, data } = event

    if (!data?.audioChunk) {
      return
    }

    try {
      const stats = this.callStats.get(callId)
      if (stats) {
        stats.audioChunksReceived++
      }

      const transcript = await this.realtimeEngine.processAudioChunk(
        callId,
        data.audioChunk
      )

      if (transcript && transcript.isFinal) {
        console.log(`[VOICE ENGINE] Transcript: "${transcript.text}"`)

        if (stats) {
          stats.transcriptLength += transcript.text.length
        }

        await this.processTranscript(event, transcript.text)
      }

    } catch (error) {
      console.error('[VOICE ENGINE] Error handling media event:', error)
      this.incrementErrorCount(callId)
    }
  }

  /**
   * Process transcript through orchestrator
   */
  private async processTranscript(event: VoiceEvent, transcript: string): Promise<void> {
    const { callId, metadata } = event

    try {
      const result = await orchestrate({
        channel: Channel.VOICE,
        payload: {
          from: metadata.from,
          caller: metadata.from,
          transcript,
          callId,
        },
        timestamp: new Date(),
        tenantId: metadata.tenantId,
      })

      console.log(`[VOICE ENGINE] Orchestrator response: "${result.response.content}"`)

      const stats = this.callStats.get(callId)
      if (stats) {
        stats.responseCount++
      }

      const config = await this.getVoiceConfig(metadata.tenantId)
      await this.sendVoiceResponse(callId, result.response.content, config)

    } catch (error) {
      console.error('[VOICE ENGINE] Error processing transcript:', error)
      this.incrementErrorCount(callId)

      const config = await this.getVoiceConfig(metadata.tenantId)
      await this.sendVoiceResponse(
        callId,
        'Entschuldigung, ich hatte Schwierigkeiten Ihre Anfrage zu verarbeiten.',
        config
      )
    }
  }

  /**
   * Send voice response
   */
  private async sendVoiceResponse(
    callId: string,
    text: string,
    config: VoiceConfig
  ): Promise<void> {
    try {
      const response = await this.realtimeEngine.generateVoiceResponse(
        callId,
        text,
        config
      )

      if (response.audio) {
        await this.sipGateway.sendAudio(callId, response.audio)
      } else {
        await this.sipGateway.playTTS(callId, text)
      }

      const stats = this.callStats.get(callId)
      if (stats) {
        stats.audioChunksSent++
      }

    } catch (error) {
      console.error('[VOICE ENGINE] Error sending voice response:', error)
      this.incrementErrorCount(callId)
    }
  }

  /**
   * Handle call end
   */
  private async handleCallEnd(event: VoiceEvent): Promise<void> {
    console.log(`[VOICE ENGINE] Handling call end: ${event.callId}`)

    try {
      await this.realtimeEngine.endSession(event.callId)

      const stats = this.callStats.get(event.callId)
      if (stats) {
        stats.duration = event.data?.duration || 0
        console.log(`[VOICE ENGINE] Call stats:`, stats)
      }

      this.callStats.delete(event.callId)

    } catch (error) {
      console.error('[VOICE ENGINE] Error handling call end:', error)
    }
  }

  /**
   * Increment error count
   */
  private incrementErrorCount(callId: string): void {
    const stats = this.callStats.get(callId)
    if (stats) {
      stats.errors++
    }
  }

  /**
   * Handle incoming voice event (public API)
   */
  async handleIncomingVoiceEvent(event: VoiceEvent): Promise<void> {
    console.log(`[VOICE ENGINE] Handling incoming event: ${event.type}`)

    switch (event.type) {
      case VoiceEventType.CALL_START:
        await this.handleCallStart(event)
        break

      case VoiceEventType.CALL_MEDIA:
        await this.handleMediaEvent(event)
        break

      case VoiceEventType.CALL_END:
        await this.handleCallEnd(event)
        break

      default:
        console.warn(`[VOICE ENGINE] Unknown event type: ${event.type}`)
    }
  }

  /**
   * Simulate text input (for testing)
   */
  async simulateTextInput(callId: string, text: string, tenantId?: string): Promise<VoiceResponse> {
    console.log(`[VOICE ENGINE] Simulating text input: "${text}"`)

    try {
      const result = await orchestrate({
        channel: Channel.VOICE,
        payload: {
          from: 'test',
          caller: 'test',
          transcript: text,
          callId,
        },
        timestamp: new Date(),
        tenantId,
      })

      const config = await this.getVoiceConfig(tenantId)
      const response = await this.realtimeEngine.generateVoiceResponse(
        callId,
        result.response.content,
        config
      )

      return response

    } catch (error) {
      console.error('[VOICE ENGINE] Error simulating text input:', error)
      throw error
    }
  }

  /**
   * Get call stats
   */
  getCallStats(callId: string): CallStats | undefined {
    return this.callStats.get(callId)
  }

  /**
   * Get all active calls
   */
  getActiveCalls(): string[] {
    return this.sipGateway.getActiveCalls().map(call => call.callId)
  }
}

let voiceEngineInstance: VoiceEngineService | null = null

/**
 * Get voice engine instance
 */
export function getVoiceEngine(): VoiceEngineService {
  if (!voiceEngineInstance) {
    voiceEngineInstance = new VoiceEngineService()
  }
  return voiceEngineInstance
}
