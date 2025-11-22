/**
 * SIP Gateway Stub
 * 
 * Stub implementation for SIP gateway integration.
 * In production, this would connect to a real SIP provider (Twilio, Plivo, etc.)
 */

import { VoiceEvent, VoiceEventType, CallMetadata, AudioChunk } from './voice.types'

/**
 * SIP Gateway Stub
 * 
 * Simulates a SIP gateway for testing and development.
 * In production, this would be replaced with actual SIP integration.
 */
export class SIPGatewayStub {
  private activeCalls: Map<string, CallMetadata> = new Map()
  private eventHandlers: Map<VoiceEventType, Array<(event: VoiceEvent) => void>> = new Map()

  constructor() {
    console.log('[SIP GATEWAY STUB] Initialized')
  }

  /**
   * Register event handler
   */
  on(eventType: VoiceEventType, handler: (event: VoiceEvent) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)!.push(handler)
  }

  /**
   * Emit event to handlers
   */
  private emit(event: VoiceEvent): void {
    const handlers = this.eventHandlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }
  }

  /**
   * Handle call start
   * 
   * Called when a new call is initiated.
   * In production, this would be triggered by SIP INVITE.
   */
  async handleCallStart(callId: string, metadata: Partial<CallMetadata>): Promise<void> {
    console.log(`[SIP GATEWAY STUB] Call started: ${callId}`)

    const fullMetadata: CallMetadata = {
      callId,
      from: metadata.from || 'unknown',
      to: metadata.to,
      tenantId: metadata.tenantId,
      timestamp: new Date(),
    }

    this.activeCalls.set(callId, fullMetadata)

    const event: VoiceEvent = {
      type: VoiceEventType.CALL_START,
      callId,
      metadata: fullMetadata,
    }

    this.emit(event)
  }

  /**
   * Handle media event
   * 
   * Called when audio data is received from the caller.
   * In production, this would be triggered by RTP packets.
   */
  async handleMediaEvent(callId: string, audioChunk: AudioChunk): Promise<void> {
    const metadata = this.activeCalls.get(callId)
    if (!metadata) {
      console.error(`[SIP GATEWAY STUB] Call not found: ${callId}`)
      return
    }

    const event: VoiceEvent = {
      type: VoiceEventType.CALL_MEDIA,
      callId,
      metadata,
      data: {
        audioChunk: audioChunk.chunk,
      },
    }

    this.emit(event)
  }

  /**
   * Handle call end
   * 
   * Called when a call is terminated.
   * In production, this would be triggered by SIP BYE.
   */
  async handleCallEnd(callId: string, duration?: number): Promise<void> {
    console.log(`[SIP GATEWAY STUB] Call ended: ${callId}`)

    const metadata = this.activeCalls.get(callId)
    if (!metadata) {
      console.error(`[SIP GATEWAY STUB] Call not found: ${callId}`)
      return
    }

    const event: VoiceEvent = {
      type: VoiceEventType.CALL_END,
      callId,
      metadata,
      data: {
        duration,
      },
    }

    this.emit(event)
    this.activeCalls.delete(callId)
  }

  /**
   * Send audio to caller
   * 
   * In production, this would send RTP packets to the caller.
   */
  async sendAudio(callId: string, audioData: string): Promise<void> {
    console.log(`[SIP GATEWAY STUB] Sending audio to ${callId} (${audioData.length} bytes)`)
    
  }

  /**
   * Play text-to-speech
   * 
   * In production, this would use TTS and send audio to caller.
   */
  async playTTS(callId: string, text: string): Promise<void> {
    console.log(`[SIP GATEWAY STUB] Playing TTS to ${callId}: "${text}"`)
    
  }

  /**
   * Get active calls
   */
  getActiveCalls(): CallMetadata[] {
    return Array.from(this.activeCalls.values())
  }

  /**
   * Check if call is active
   */
  isCallActive(callId: string): boolean {
    return this.activeCalls.has(callId)
  }
}

let sipGatewayInstance: SIPGatewayStub | null = null

/**
 * Get SIP gateway instance
 */
export function getSIPGateway(): SIPGatewayStub {
  if (!sipGatewayInstance) {
    sipGatewayInstance = new SIPGatewayStub()
  }
  return sipGatewayInstance
}
