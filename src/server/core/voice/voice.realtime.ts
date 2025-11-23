/**
 * OpenAI Realtime API Integration
 * 
 * Handles real-time voice processing using OpenAI's Realtime API.
 */

import OpenAI from 'openai'
import { RealtimeSession, SessionState, TranscriptResult, VoiceResponse, VoiceConfig } from './voice.types'

/**
 * Realtime Voice Engine
 * 
 * Manages real-time voice sessions with OpenAI.
 */
export class RealtimeVoiceEngine {
  private openai: OpenAI | null = null
  private sessions: Map<string, RealtimeSession> = new Map()

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      console.log('[REALTIME ENGINE] Initialized with OpenAI API')
    } else {
      console.warn('[REALTIME ENGINE] No OpenAI API key found - running in stub mode')
    }
  }

  /**
   * Create a new realtime session
   */
  async createSession(callId: string, config: VoiceConfig): Promise<RealtimeSession> {
    console.log(`[REALTIME ENGINE] Creating session for call ${callId}`)

    const session: RealtimeSession = {
      sessionId: `session_${callId}_${Date.now()}`,
      callId,
      tenantId: config.tenantId,
      state: SessionState.CONNECTING,
      startTime: new Date(),
      audioBuffer: [],
      transcript: [],
    }

    this.sessions.set(callId, session)


    session.state = SessionState.CONNECTED
    console.log(`[REALTIME ENGINE] Session created: ${session.sessionId}`)

    return session
  }

  /**
   * Process audio chunk
   * 
   * Sends audio to OpenAI for transcription and processing.
   */
  async processAudioChunk(callId: string, audioChunk: string): Promise<TranscriptResult | null> {
    const session = this.sessions.get(callId)
    if (!session) {
      console.error(`[REALTIME ENGINE] Session not found for call ${callId}`)
      return null
    }

    session.audioBuffer.push(audioChunk)
    session.state = SessionState.PROCESSING


    if (!this.openai) {
      console.log('[REALTIME ENGINE STUB] Simulating transcription')
      return {
        text: '[STUB] Simulated transcript from audio',
        confidence: 0.95,
        isFinal: true,
        timestamp: new Date(),
      }
    }

    return {
      text: '[STUB] Transcription pending - OpenAI Realtime API integration needed',
      confidence: 0.8,
      isFinal: false,
      timestamp: new Date(),
    }
  }

  /**
   * Generate voice response
   * 
   * Converts text to speech using OpenAI TTS.
   */
  async generateVoiceResponse(callId: string, text: string, config: VoiceConfig): Promise<VoiceResponse> {
    const session = this.sessions.get(callId)
    if (!session) {
      throw new Error(`Session not found for call ${callId}`)
    }

    console.log(`[REALTIME ENGINE] Generating voice response for call ${callId}`)

    if (!this.openai) {
      console.log('[REALTIME ENGINE STUB] Simulating TTS')
      return {
        text,
        audio: 'base64_encoded_audio_stub',
        duration: text.length * 0.1, // Rough estimate
        timestamp: new Date(),
      }
    }

    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: (config.voice as any) || 'alloy',
        input: text,
      })

      const buffer = Buffer.from(await response.arrayBuffer())
      const audio = buffer.toString('base64')

      return {
        text,
        audio,
        duration: text.length * 0.1, // Rough estimate
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('[REALTIME ENGINE] Error generating TTS:', error)
      throw error
    }
  }

  /**
   * Handle interruption
   * 
   * Called when user interrupts the AI response.
   */
  async handleInterruption(callId: string): Promise<void> {
    const session = this.sessions.get(callId)
    if (!session) {
      return
    }

    console.log(`[REALTIME ENGINE] Handling interruption for call ${callId}`)


    session.audioBuffer = []
  }

  /**
   * End session
   */
  async endSession(callId: string): Promise<void> {
    const session = this.sessions.get(callId)
    if (!session) {
      return
    }

    console.log(`[REALTIME ENGINE] Ending session for call ${callId}`)

    session.state = SessionState.DISCONNECTED
    session.endTime = new Date()


    this.sessions.delete(callId)
  }

  /**
   * Get session
   */
  getSession(callId: string): RealtimeSession | undefined {
    return this.sessions.get(callId)
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): RealtimeSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.state !== SessionState.DISCONNECTED
    )
  }
}

let realtimeEngineInstance: RealtimeVoiceEngine | null = null

/**
 * Get realtime engine instance
 */
export function getRealtimeEngine(): RealtimeVoiceEngine {
  if (!realtimeEngineInstance) {
    realtimeEngineInstance = new RealtimeVoiceEngine()
  }
  return realtimeEngineInstance
}
