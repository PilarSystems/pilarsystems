/**
 * Voice Engine Types
 * 
 * Type definitions for the Realtime Voice Engine
 */

/**
 * Voice event types
 */
export enum VoiceEventType {
  CALL_START = 'call.start',
  CALL_MEDIA = 'call.media',
  CALL_TRANSCRIPT = 'call.transcript',
  CALL_END = 'call.end',
  CALL_ERROR = 'call.error',
}

/**
 * Call metadata
 */
export interface CallMetadata {
  callId: string
  from: string
  to?: string
  tenantId?: string
  timestamp: Date
}

/**
 * Voice event payload
 */
export interface VoiceEvent {
  type: VoiceEventType
  callId: string
  metadata: CallMetadata
  data?: {
    audioChunk?: string // Base64 encoded audio
    transcript?: string
    confidence?: number
    duration?: number
    error?: string
  }
}

/**
 * Voice configuration per tenant
 */
export interface VoiceConfig {
  tenantId: string
  personality?: string
  language?: string
  voice?: string // OpenAI voice ID
  temperature?: number
  maxDuration?: number // seconds
  silenceTimeout?: number // seconds
  interruptible?: boolean
  studioRules?: string[]
}

/**
 * Realtime session state
 */
export enum SessionState {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  PROCESSING = 'processing',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

/**
 * Realtime session
 */
export interface RealtimeSession {
  sessionId: string
  callId: string
  tenantId?: string
  state: SessionState
  startTime: Date
  endTime?: Date
  audioBuffer: string[]
  transcript: string[]
}

/**
 * Audio chunk
 */
export interface AudioChunk {
  callId: string
  chunk: string // Base64 encoded
  timestamp: Date
  sequenceNumber: number
}

/**
 * Transcript result
 */
export interface TranscriptResult {
  text: string
  confidence: number
  isFinal: boolean
  timestamp: Date
}

/**
 * Voice response
 */
export interface VoiceResponse {
  text: string
  audio?: string // Base64 encoded audio
  duration?: number
  timestamp: Date
}

/**
 * Call statistics
 */
export interface CallStats {
  callId: string
  duration: number
  audioChunksReceived: number
  audioChunksSent: number
  transcriptLength: number
  responseCount: number
  errors: number
}
