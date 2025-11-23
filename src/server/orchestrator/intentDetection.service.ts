/**
 * Intent Detection Service
 */

import OpenAI from 'openai'
import { NormalizedMessage, Intent, IntentDetectionResult } from './orchestrator.types'

let openaiInstance: OpenAI | null = null

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

function detectIntentWithRules(message: NormalizedMessage): IntentDetectionResult | null {
  const content = message.content.toLowerCase()

  const trainingKeywords = ['trainingsplan', 'workout', 'training', 'plan', 'übungen', 'exercises', 'fitness plan']
  if (trainingKeywords.some(keyword => content.includes(keyword))) {
    return {
      intent: Intent.TRAINING_PLAN,
      confidence: 0.8,
      entities: {},
      reasoning: 'Matched training plan keywords',
    }
  }

  const bookingKeywords = ['termin', 'buchen', 'booking', 'appointment', 'reservieren', 'reserve']
  if (bookingKeywords.some(keyword => content.includes(keyword))) {
    return {
      intent: Intent.BOOKING,
      confidence: 0.8,
      entities: {},
      reasoning: 'Matched booking keywords',
    }
  }

  const gymBuddyKeywords = ['gym buddy', 'trainingspartner', 'workout partner', 'motivation', 'gemeinsam trainieren']
  if (gymBuddyKeywords.some(keyword => content.includes(keyword))) {
    return {
      intent: Intent.GYM_BUDDY,
      confidence: 0.8,
      entities: {},
      reasoning: 'Matched gym buddy keywords',
    }
  }

  const leadKeywords = ['interesse', 'interested', 'info', 'information', 'preise', 'prices', 'mitgliedschaft', 'membership']
  if (leadKeywords.some(keyword => content.includes(keyword))) {
    return {
      intent: Intent.LEAD_QUALIFICATION,
      confidence: 0.7,
      entities: {},
      reasoning: 'Matched lead qualification keywords',
    }
  }

  const voiceKeywords = ['anrufen', 'call', 'telefon', 'phone', 'sprechen', 'talk']
  if (voiceKeywords.some(keyword => content.includes(keyword))) {
    return {
      intent: Intent.VOICE_CALL,
      confidence: 0.7,
      entities: {},
      reasoning: 'Matched voice call keywords',
    }
  }

  return null
}

async function detectIntentWithAI(message: NormalizedMessage): Promise<IntentDetectionResult> {
  const openai = getOpenAI()
  
  if (!openai) {
    return {
      intent: Intent.GENERAL_QUESTION,
      confidence: 0.5,
      entities: {},
      reasoning: 'No OpenAI API key available',
    }
  }

  try {
    const prompt = `Detect user intent from: "${message.content}"

Available intents: training_plan, booking, gym_buddy, lead_qualification, voice_call, general_question, fallback

Respond in JSON:
{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "entities": {},
  "reasoning": "Brief explanation"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an intent detection AI. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(responseContent)

    return {
      intent: result.intent as Intent,
      confidence: result.confidence,
      entities: result.entities || {},
      reasoning: result.reasoning,
    }
  } catch (error) {
    console.error('Error detecting intent with AI:', error)

    return {
      intent: Intent.GENERAL_QUESTION,
      confidence: 0.5,
      entities: {},
      reasoning: 'AI detection failed',
    }
  }
}

export async function detectIntent(message: NormalizedMessage): Promise<IntentDetectionResult> {
  const ruleResult = detectIntentWithRules(message)
  if (ruleResult && ruleResult.confidence >= 0.7) {
    return ruleResult
  }

  const aiResult = await detectIntentWithAI(message)

  if (aiResult.confidence < 0.5) {
    return {
      intent: Intent.FALLBACK,
      confidence: 0.5,
      entities: {},
      reasoning: 'Low confidence from both rules and AI',
    }
  }

  return aiResult
}
