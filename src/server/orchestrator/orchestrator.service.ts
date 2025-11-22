/**
 * Orchestrator Service (KI-BRAIN)
 */

import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/src/server/db/client'
import {
  RawMessage,
  NormalizedMessage,
  Channel,
  AIContext,
  IntentDetectionResult,
  RoutingDecision,
  AIResponse,
  OrchestratorResult,
  Module,
} from './orchestrator.types'
import { detectIntent } from './intentDetection.service'
import { routeToModule, isModuleAvailable, getFallbackModule } from './routingRules'
import { generateWorkoutPlan } from '../core/training/trainingPlan.service'
import { TrainingGoal, TrainingLevel, Equipment } from '../core/training/trainingPlan.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export function normalizeIncomingMessage(payload: RawMessage): NormalizedMessage {
  const id = uuidv4()

  let content = ''
  let metadata: any = {
    timestamp: payload.timestamp || new Date(),
    raw: payload.payload,
  }

  switch (payload.channel) {
    case Channel.WHATSAPP:
      content = payload.payload.message?.text?.body || payload.payload.text || ''
      metadata.phoneNumber = payload.payload.from || payload.payload.phoneNumber
      metadata.userName = payload.payload.profile?.name || payload.payload.name
      break

    case Channel.VOICE:
      content = payload.payload.transcript || payload.payload.text || ''
      metadata.phoneNumber = payload.payload.from || payload.payload.caller
      metadata.callSid = payload.payload.callSid
      break

    case Channel.EMAIL:
      content = payload.payload.body || payload.payload.text || ''
      metadata.email = payload.payload.from || payload.payload.sender
      metadata.subject = payload.payload.subject
      break

    case Channel.WEB:
      content = payload.payload.message || payload.payload.text || ''
      metadata.userId = payload.payload.userId
      metadata.sessionId = payload.payload.sessionId
      break

    case Channel.SMS:
      content = payload.payload.body || payload.payload.text || ''
      metadata.phoneNumber = payload.payload.from || payload.payload.sender
      break

    default:
      content = JSON.stringify(payload.payload)
  }

  if (payload.tenantId) {
    metadata.tenantId = payload.tenantId
  }
  if (payload.userId) {
    metadata.userId = payload.userId
  }

  return {
    id,
    channel: payload.channel,
    content,
    metadata,
  }
}

export async function buildAIContext(
  tenantId: string | undefined,
  userData: any,
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>,
  intent: IntentDetectionResult
): Promise<AIContext> {
  const context: AIContext = {
    tenantId,
    user: userData,
    messageHistory,
    intent,
    additionalContext: {},
  }

  if (tenantId) {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
          name: true,
          domain: true,
        },
      })

      if (tenant) {
        context.tenant = {
          name: tenant.name,
          domain: tenant.domain || undefined,
        }
      }
    } catch (error) {
      console.error('Error fetching tenant:', error)
    }
  }

  return context
}

export async function executeAIResponse(
  context: AIContext,
  routing: RoutingDecision,
  message: NormalizedMessage
): Promise<AIResponse> {
  const startTime = Date.now()

  try {
    const module = isModuleAvailable(routing.module)
      ? routing.module
      : getFallbackModule(routing.module)

    switch (module) {
      case Module.TRAINING_PLAN_ENGINE:
        return await executeTrainingPlanEngine(context, routing, message)

      case Module.BOOKING_ENGINE:
        return await executeBookingEngine(context, routing, message)

      case Module.WHATSAPP_ENGINE:
        return await executeWhatsAppEngine(context, routing, message)

      case Module.VOICE_ENGINE:
        return await executeVoiceEngine(context, routing, message)

      case Module.GENERAL_AI:
      default:
        return await executeGeneralAI(context, routing, message)
    }
  } catch (error) {
    console.error('Error executing AI response:', error)

    const processingTime = Date.now() - startTime

    return {
      content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung deiner Anfrage.',
      metadata: {
        module: routing.module,
        intent: routing.intent,
        confidence: 0,
        processingTime,
      },
    }
  }
}

async function executeTrainingPlanEngine(
  context: AIContext,
  routing: RoutingDecision,
  message: NormalizedMessage
): Promise<AIResponse> {
  const startTime = Date.now()

  try {
    const params = await extractTrainingParameters(message.content)

    const plan = await generateWorkoutPlan({
      goal: params.goal || TrainingGoal.GENERAL_FITNESS,
      daysPerWeek: params.daysPerWeek || 3,
      level: params.level || TrainingLevel.BEGINNER,
      equipment: params.equipment || Equipment.FULL_GYM,
      tenantId: context.tenantId,
      userId: context.user?.id,
    })

    const processingTime = Date.now() - startTime

    return {
      content: `Ich habe einen personalisierten Trainingsplan für dich erstellt! 💪\n\nZiel: ${plan.goal}\nTrainingstage: ${plan.daysPerWeek}x pro Woche\nLevel: ${plan.level}\n\nDein Plan umfasst ${plan.split.days.length} Trainingstage mit detaillierten Übungen.\n\nMöchtest du mehr Details erfahren?`,
      metadata: {
        module: Module.TRAINING_PLAN_ENGINE,
        intent: routing.intent,
        confidence: routing.params.confidence,
        processingTime,
      },
      data: plan,
    }
  } catch (error) {
    console.error('Error in training plan engine:', error)

    const processingTime = Date.now() - startTime

    return {
      content: 'Ich konnte leider keinen Trainingsplan erstellen. Kannst du mir mehr Details geben?',
      metadata: {
        module: Module.TRAINING_PLAN_ENGINE,
        intent: routing.intent,
        confidence: 0,
        processingTime,
      },
    }
  }
}

async function extractTrainingParameters(content: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    return {}
  }

  try {
    const prompt = `Extract training parameters from: "${content}"

Return JSON with:
{
  "goal": "muscle_building|fat_loss|strength|rehabilitation|endurance|general_fitness",
  "daysPerWeek": 1-7,
  "level": "beginner|intermediate|advanced",
  "equipment": "full_gym|home_basic|bodyweight|limited"
}

Only include fields that are clearly mentioned.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract training parameters. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      return {}
    }

    return JSON.parse(responseContent)
  } catch (error) {
    console.error('Error extracting training parameters:', error)
    return {}
  }
}

async function executeBookingEngine(
  context: AIContext,
  routing: RoutingDecision,
  _message: NormalizedMessage
): Promise<AIResponse> {
  const processingTime = 10

  return {
    content: '[BOOKING ENGINE STUB] Buchungsfunktion ist noch nicht implementiert.',
    metadata: {
      module: Module.BOOKING_ENGINE,
      intent: routing.intent,
      confidence: routing.params.confidence,
      processingTime,
    },
  }
}

async function executeWhatsAppEngine(
  context: AIContext,
  routing: RoutingDecision,
  _message: NormalizedMessage
): Promise<AIResponse> {
  const processingTime = 10

  return {
    content: '[WHATSAPP ENGINE STUB] Lead-Qualifizierung ist noch nicht implementiert.',
    metadata: {
      module: Module.WHATSAPP_ENGINE,
      intent: routing.intent,
      confidence: routing.params.confidence,
      processingTime,
    },
  }
}

async function executeVoiceEngine(
  context: AIContext,
  routing: RoutingDecision,
  _message: NormalizedMessage
): Promise<AIResponse> {
  const processingTime = 10

  return {
    content: '[VOICE ENGINE STUB] Sprachanruf-Funktion ist noch nicht implementiert.',
    metadata: {
      module: Module.VOICE_ENGINE,
      intent: routing.intent,
      confidence: routing.params.confidence,
      processingTime,
    },
  }
}

async function executeGeneralAI(
  context: AIContext,
  routing: RoutingDecision,
  message: NormalizedMessage
): Promise<AIResponse> {
  const startTime = Date.now()

  if (!process.env.OPENAI_API_KEY) {
    const processingTime = Date.now() - startTime

    return {
      content: 'Ich bin ein KI-Assistent für Fitnessstudios. Wie kann ich dir helfen?',
      metadata: {
        module: Module.GENERAL_AI,
        intent: routing.intent,
        confidence: 0.5,
        processingTime,
      },
    }
  }

  try {
    const systemPrompt = `Du bist ein freundlicher KI-Assistent für Fitnessstudios. Antworte auf Deutsch, sei hilfsbereit und motivierend.`

    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    if (context.messageHistory && context.messageHistory.length > 0) {
      context.messageHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    messages.push({
      role: 'user',
      content: message.content,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseContent = completion.choices[0]?.message?.content || 'Entschuldigung, ich konnte keine Antwort generieren.'

    const processingTime = Date.now() - startTime

    return {
      content: responseContent,
      metadata: {
        module: Module.GENERAL_AI,
        intent: routing.intent,
        confidence: routing.params.confidence,
        processingTime,
      },
    }
  } catch (error) {
    console.error('Error in general AI:', error)

    const processingTime = Date.now() - startTime

    return {
      content: 'Entschuldigung, ich hatte Schwierigkeiten deine Anfrage zu verarbeiten.',
      metadata: {
        module: Module.GENERAL_AI,
        intent: routing.intent,
        confidence: 0,
        processingTime,
      },
    }
  }
}

export async function orchestrate(rawMessage: RawMessage): Promise<OrchestratorResult> {
  try {
    const normalizedMessage = normalizeIncomingMessage(rawMessage)

    const intent = await detectIntent(normalizedMessage)

    const context = await buildAIContext(
      normalizedMessage.metadata.tenantId,
      {
        id: normalizedMessage.metadata.userId,
        name: normalizedMessage.metadata.userName,
        email: normalizedMessage.metadata.email,
        phoneNumber: normalizedMessage.metadata.phoneNumber,
      },
      [],
      intent
    )

    const routing = routeToModule(intent)

    const response = await executeAIResponse(context, routing, normalizedMessage)

    return {
      success: true,
      message: normalizedMessage,
      intent,
      routing,
      response,
    }
  } catch (error) {
    console.error('Error in orchestrator:', error)

    return {
      success: false,
      message: normalizeIncomingMessage(rawMessage),
      intent: {
        intent: 'fallback' as any,
        confidence: 0,
        entities: {},
      },
      routing: {
        module: Module.GENERAL_AI,
        intent: 'fallback' as any,
        params: {},
      },
      response: {
        content: 'Entschuldigung, es gab einen Fehler.',
        metadata: {
          module: Module.GENERAL_AI,
          intent: 'fallback' as any,
          confidence: 0,
          processingTime: 0,
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
