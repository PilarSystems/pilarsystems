/**
 * Routing Rules
 */

import { Intent, Module, IntentDetectionResult, RoutingDecision } from './orchestrator.types'

const INTENT_TO_MODULE: Record<Intent, Module> = {
  [Intent.TRAINING_PLAN]: Module.TRAINING_PLAN_ENGINE,
  [Intent.BOOKING]: Module.BOOKING_ENGINE,
  [Intent.GYM_BUDDY]: Module.TRAINING_PLAN_ENGINE,
  [Intent.LEAD_QUALIFICATION]: Module.WHATSAPP_ENGINE,
  [Intent.VOICE_CALL]: Module.VOICE_ENGINE,
  [Intent.GENERAL_QUESTION]: Module.GENERAL_AI,
  [Intent.FALLBACK]: Module.GENERAL_AI,
}

export function routeToModule(intent: IntentDetectionResult): RoutingDecision {
  const targetModule = INTENT_TO_MODULE[intent.intent] || Module.GENERAL_AI

  const decision: RoutingDecision = {
    module: targetModule,
    intent: intent.intent,
    params: {
      confidence: intent.confidence,
      entities: intent.entities,
      reasoning: intent.reasoning,
    },
  }

  return decision
}

export function isModuleAvailable(targetModule: Module): boolean {
  const availableModules = [
    Module.TRAINING_PLAN_ENGINE,
    Module.GENERAL_AI,
  ]

  return availableModules.includes(targetModule)
}

export function getFallbackModule(targetModule: Module): Module {
  if (!isModuleAvailable(targetModule)) {
    return Module.GENERAL_AI
  }

  return targetModule
}
