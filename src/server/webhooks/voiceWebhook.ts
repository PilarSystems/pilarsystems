/**
 * Voice Webhook Handler (STUB)
 */

import { orchestrate } from '../orchestrator/orchestrator.service'
import { Channel } from '../orchestrator/orchestrator.types'

export enum VoiceEventType {
  CALL_START = 'call.start',
  CALL_MEDIA = 'call.media',
  CALL_END = 'call.end',
  CALL_TRANSCRIPT = 'call.transcript',
}

export interface VoiceWebhookPayload {
  event: VoiceEventType
  callSid: string
  from: string
  to?: string
  transcript?: string
  confidence?: number
  duration?: number
  timestamp: string
}

async function extractTenantId(payload: VoiceWebhookPayload, queryParams?: Record<string, string>): Promise<string | undefined> {
  if (queryParams?.tenantId) {
    return queryParams.tenantId
  }
  return undefined
}

export async function processVoiceWebhook(
  payload: VoiceWebhookPayload,
  queryParams?: Record<string, string>
): Promise<{ success: boolean; message?: string; response?: string; error?: string }> {
  try {
    const tenantId = await extractTenantId(payload, queryParams)

    switch (payload.event) {
      case VoiceEventType.CALL_START:
        return handleCallStart(payload, tenantId)

      case VoiceEventType.CALL_TRANSCRIPT:
        return handleCallTranscript(payload, tenantId)

      case VoiceEventType.CALL_MEDIA:
        return handleCallMedia(payload, tenantId)

      case VoiceEventType.CALL_END:
        return handleCallEnd(payload, tenantId)

      default:
        return {
          success: false,
          error: `Unknown event type: ${payload.event}`,
        }
    }
  } catch (error) {
    console.error('Error processing voice webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function handleCallStart(
  payload: VoiceWebhookPayload,
  tenantId?: string
): Promise<{ success: boolean; message?: string; response?: string }> {
  console.log(`[VOICE STUB] Call started: ${payload.callSid} from ${payload.from}`)

  return {
    success: true,
    message: 'Call started',
    response: '[STUB] Willkommen bei PILAR SYSTEMS. Wie kann ich Ihnen helfen?',
  }
}

async function handleCallTranscript(
  payload: VoiceWebhookPayload,
  tenantId?: string
): Promise<{ success: boolean; message?: string; response?: string }> {
  if (!payload.transcript) {
    return {
      success: false,
      error: 'No transcript in payload',
    }
  }

  console.log(`[VOICE STUB] Transcript received: ${payload.transcript}`)

  const result = await orchestrate({
    channel: Channel.VOICE,
    payload: {
      from: payload.from,
      caller: payload.from,
      transcript: payload.transcript,
      confidence: payload.confidence,
      callSid: payload.callSid,
    },
    timestamp: new Date(payload.timestamp),
    tenantId,
  })

  return {
    success: true,
    message: 'Transcript processed',
    response: result.response.content,
  }
}

async function handleCallMedia(
  payload: VoiceWebhookPayload,
  tenantId?: string
): Promise<{ success: boolean; message?: string }> {
  console.log(`[VOICE STUB] Media event received: ${payload.callSid}`)

  return {
    success: true,
    message: 'Media event received (stub)',
  }
}

async function handleCallEnd(
  payload: VoiceWebhookPayload,
  tenantId?: string
): Promise<{ success: boolean; message?: string }> {
  console.log(`[VOICE STUB] Call ended: ${payload.callSid}, duration: ${payload.duration}s`)

  return {
    success: true,
    message: 'Call ended',
  }
}

export async function generateVoiceResponse(
  text: string,
  callSid: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  console.log(`[STUB] Generating voice response for ${callSid}: ${text}`)

  return {
    success: true,
    audioUrl: `https://example.com/audio/${callSid}.mp3`,
  }
}
