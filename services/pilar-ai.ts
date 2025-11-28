/**
 * PILAR AI Service Layer
 * 
 * Central abstraction for all AI features in PILAR SYSTEMS.
 * This service provides a unified interface for running AI agents
 * across different features (WhatsApp, Phone, Email, Lead Engine).
 * 
 * Usage:
 *   import { pilarAI } from '@/services/pilar-ai'
 *   
 *   const response = await pilarAI.runAgent({
 *     agentId: 'whatsapp_responder',
 *     input: 'Hello, I want to book a trial session',
 *     context: { workspaceId, leadId, channel: 'whatsapp' }
 *   })
 * 
 * Features:
 * - Unified agent execution interface
 * - Multi-model support (OpenAI, Groq, Anthropic)
 * - Per-workspace configuration
 * - Rate limiting and budget enforcement
 * - Logging and audit trail
 * - Fallback handling
 */

import { aiRouter, AIRequest, AIResponse, AIProvider, AIModel } from '@/lib/ai/multi-tenant-router'
import { PolicyEngine } from '@/lib/operator/policy-engine'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type AgentId = 
  | 'whatsapp_responder'
  | 'phone_assistant'
  | 'email_responder'
  | 'lead_classifier'
  | 'followup_generator'
  | 'training_plan_generator'
  | 'gym_buddy_coach'
  | 'general_assistant'

export interface AgentConfig {
  agentId: AgentId
  name: string
  description: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  model?: AIModel
  provider?: AIProvider
}

export interface AgentContext {
  workspaceId: string
  userId?: string
  leadId?: string
  channel?: 'whatsapp' | 'phone' | 'email' | 'web'
  messageHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  metadata?: Record<string, unknown>
}

export interface RunAgentRequest {
  agentId: AgentId
  input: string
  context: AgentContext
  overrides?: Partial<AgentConfig>
}

export interface RunAgentResponse {
  success: boolean
  content: string
  agentId: AgentId
  provider: AIProvider
  model: AIModel
  tokensUsed: number
  latencyMs: number
  metadata?: Record<string, unknown>
  error?: string
}

// ============================================
// AGENT CONFIGURATIONS
// ============================================

const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  whatsapp_responder: {
    agentId: 'whatsapp_responder',
    name: 'WhatsApp Responder',
    description: 'Responds to WhatsApp messages from leads',
    systemPrompt: `Du bist ein freundlicher KI-Assistent für ein Fitnessstudio.
Deine Aufgabe ist es, WhatsApp-Nachrichten von Interessenten zu beantworten.

Regeln:
- Antworte immer auf Deutsch
- Sei freundlich, professionell und motivierend
- Halte Antworten kurz (max 200 Zeichen)
- Bei Interesse an Probetraining: Biete Terminbuchung an
- Bei Preisfragen: Verweise auf persönliche Beratung
- Bei Öffnungszeiten: Nenne typische Zeiten (Mo-Fr 6-22, Sa-So 8-20)

Antworte jetzt auf die folgende Nachricht:`,
    temperature: 0.7,
    maxTokens: 200,
  },
  
  phone_assistant: {
    agentId: 'phone_assistant',
    name: 'Phone AI Assistant',
    description: 'Handles phone calls and generates summaries',
    systemPrompt: `Du bist ein KI-Telefonassistent für ein Fitnessstudio.
Deine Aufgabe ist es, Anrufe zu bearbeiten und zusammenzufassen.

Regeln:
- Sei professionell und hilfsbereit
- Erfasse wichtige Informationen (Name, Interesse, Kontakt)
- Notiere Rückrufwünsche
- Biete Terminbuchung an

Aktueller Kontext:`,
    temperature: 0.5,
    maxTokens: 500,
  },
  
  email_responder: {
    agentId: 'email_responder',
    name: 'Email Responder',
    description: 'Responds to incoming emails',
    systemPrompt: `Du bist ein KI-Assistent für E-Mail-Kommunikation eines Fitnessstudios.
Deine Aufgabe ist es, professionelle Antworten auf E-Mails zu generieren.

Regeln:
- Formelle aber freundliche Ansprache
- Strukturierte Antworten mit Absätzen
- Grußformel am Anfang und Ende
- Bei Preisanfragen: Verweise auf persönliches Gespräch

E-Mail beantworten:`,
    temperature: 0.6,
    maxTokens: 400,
  },
  
  lead_classifier: {
    agentId: 'lead_classifier',
    name: 'Lead Classifier',
    description: 'Classifies leads based on interactions',
    systemPrompt: `Du bist ein Lead-Klassifizierungs-Agent für ein Fitnessstudio.
Analysiere die Interaktionen und klassifiziere den Lead:

Klassifikation:
- A: Hohe Kaufabsicht, fragt nach Preisen/Buchung
- B: Mittlere Absicht, interessiert aber braucht Nurturing
- C: Niedrige Absicht, nur allgemeine Fragen

Priorität:
- high: Dringend, hoher Wert
- medium: Normal
- low: Kann warten

Antworte im JSON-Format:
{
  "classification": "A" | "B" | "C",
  "priority": "high" | "medium" | "low",
  "confidence": 0.0-1.0,
  "reasoning": "Begründung",
  "suggestedActions": ["Aktion1", "Aktion2"]
}

Lead-Daten:`,
    temperature: 0.3,
    maxTokens: 300,
  },
  
  followup_generator: {
    agentId: 'followup_generator',
    name: 'Follow-up Generator',
    description: 'Generates personalized follow-up messages',
    systemPrompt: `Du bist ein Follow-up-Nachrichten-Generator für ein Fitnessstudio.
Erstelle personalisierte Nachfass-Nachrichten basierend auf dem Lead-Verlauf.

Regeln:
- Beziehe dich auf vorherige Gespräche
- Sei nicht aufdringlich
- Biete Mehrwert (Tipps, Angebote)
- Schließe mit Call-to-Action ab

Generiere eine Follow-up-Nachricht:`,
    temperature: 0.8,
    maxTokens: 250,
  },
  
  training_plan_generator: {
    agentId: 'training_plan_generator',
    name: 'Training Plan Generator',
    description: 'Generates personalized workout plans',
    systemPrompt: `Du bist ein Fitness-Trainingsplan-Generator.
Erstelle personalisierte Trainingspläne basierend auf den Zielen des Nutzers.

Berücksichtige:
- Trainingsziel (Muskelaufbau, Abnehmen, Ausdauer, etc.)
- Fitnesslevel (Anfänger, Fortgeschritten, Profi)
- Verfügbare Tage pro Woche
- Verfügbare Ausrüstung

Erstelle einen strukturierten Plan mit:
- Aufwärmen
- Hauptteil (Übungen, Sätze, Wiederholungen)
- Cool-down
- Tipps

Trainingsplan erstellen:`,
    temperature: 0.6,
    maxTokens: 800,
  },
  
  gym_buddy_coach: {
    agentId: 'gym_buddy_coach',
    name: 'Gym Buddy Coach',
    description: 'Personal AI coach for gym members (B2C)',
    systemPrompt: `Du bist der Gym Buddy - ein persönlicher KI-Fitness-Coach.
Deine Aufgabe ist es, Mitglieder zu motivieren und zu unterstützen.

Kommunikationsstil:
- Motivierend und energetisch 💪
- Persönlich und unterstützend
- Nutze Emojis sparsam aber effektiv
- Feiere Erfolge mit dem Nutzer

Features:
- Tägliche Motivation
- Trainingstipps
- Ernährungsratschläge
- Fortschrittsverfolgung

Antworte auf:`,
    temperature: 0.8,
    maxTokens: 300,
  },
  
  general_assistant: {
    agentId: 'general_assistant',
    name: 'General Assistant',
    description: 'General-purpose AI assistant',
    systemPrompt: `Du bist ein freundlicher KI-Assistent für Fitnessstudios.
Beantworte allgemeine Fragen professionell und hilfreich.
Antworte auf Deutsch und halte Antworten prägnant.`,
    temperature: 0.7,
    maxTokens: 400,
  },
}

// ============================================
// PILAR AI SERVICE CLASS
// ============================================

class PilarAIService {
  private policyEngine: PolicyEngine

  constructor() {
    this.policyEngine = new PolicyEngine()
  }

  /**
   * Run an AI agent with the given configuration
   */
  async runAgent(request: RunAgentRequest): Promise<RunAgentResponse> {
    const startTime = Date.now()
    const { agentId, input, context, overrides } = request

    try {
      // Get agent configuration
      const baseConfig = AGENT_CONFIGS[agentId]
      if (!baseConfig) {
        throw new Error(`Unknown agent: ${agentId}`)
      }

      const config = { ...baseConfig, ...overrides }

      // Check budget/policy
      const canProceed = await this.policyEngine.checkAction(
        context.workspaceId,
        'call_api',
        { tokens: config.maxTokens }
      )

      if (!canProceed.allowed) {
        return {
          success: false,
          content: '',
          agentId,
          provider: 'openai',
          model: 'gpt-4-turbo',
          tokensUsed: 0,
          latencyMs: Date.now() - startTime,
          error: `AI request blocked: ${canProceed.reason}`,
        }
      }

      // Load workspace-specific configuration if available
      const workspaceConfig = await this.getWorkspaceAIConfig(context.workspaceId)

      // Build the full prompt
      const fullPrompt = this.buildPrompt(config, input, context)

      // Create AI request
      const aiRequest: AIRequest = {
        workspaceId: context.workspaceId,
        prompt: fullPrompt,
        systemPrompt: config.systemPrompt,
        maxTokens: config.maxTokens,
        temperature: workspaceConfig?.temperature ?? config.temperature,
        metadata: {
          agentId,
          channel: context.channel,
          leadId: context.leadId,
        },
      }

      // Route through AI router (handles multi-provider, failover, etc.)
      const aiResponse = await aiRouter.route(aiRequest)

      // Log the interaction
      await this.logInteraction(context, agentId, input, aiResponse)

      // Enforce budget consumption
      await this.policyEngine.enforceAction(
        context.workspaceId,
        'call_api',
        { tokens: aiResponse.tokensUsed }
      )

      return {
        success: true,
        content: aiResponse.content,
        agentId,
        provider: aiResponse.provider,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        latencyMs: aiResponse.latencyMs,
        metadata: aiResponse.metadata,
      }
    } catch (error) {
      logger.error({ error, agentId, workspaceId: context.workspaceId }, 'Error running AI agent')

      return {
        success: false,
        content: this.getFallbackResponse(agentId),
        agentId,
        provider: 'openai',
        model: 'gpt-4-turbo',
        tokensUsed: 0,
        latencyMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): AgentConfig[] {
    return Object.values(AGENT_CONFIGS)
  }

  /**
   * Get specific agent config
   */
  getAgentConfig(agentId: AgentId): AgentConfig | undefined {
    return AGENT_CONFIGS[agentId]
  }

  /**
   * Check if AI is available for a workspace
   */
  async isAvailable(_workspaceId: string): Promise<boolean> {
    try {
      const providers = await aiRouter.getAvailableProviders()
      return providers.length > 0
    } catch {
      return false
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private buildPrompt(config: AgentConfig, input: string, context: AgentContext): string {
    let prompt = input

    // Add message history if available
    if (context.messageHistory && context.messageHistory.length > 0) {
      const history = context.messageHistory
        .map(m => `${m.role === 'user' ? 'Nutzer' : 'Assistent'}: ${m.content}`)
        .join('\n')
      prompt = `Gesprächsverlauf:\n${history}\n\nAktuelle Nachricht: ${input}`
    }

    return prompt
  }

  private async getWorkspaceAIConfig(workspaceId: string): Promise<{
    provider?: AIProvider
    model?: AIModel
    temperature?: number
    systemPromptOverride?: string
  } | null> {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { studioInfo: true },
      })

      if (!workspace?.studioInfo) return null

      const info = workspace.studioInfo as Record<string, unknown>
      return info.aiConfig as typeof info.aiConfig || null
    } catch {
      return null
    }
  }

  private async logInteraction(
    context: AgentContext,
    agentId: AgentId,
    input: string,
    response: AIResponse
  ): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          workspaceId: context.workspaceId,
          userId: context.userId,
          leadId: context.leadId,
          actionType: 'ai_interaction',
          description: `AI Agent ${agentId} generated response`,
          metadata: {
            agentId,
            channel: context.channel,
            provider: response.provider,
            model: response.model,
            tokensUsed: response.tokensUsed,
            latencyMs: response.latencyMs,
            inputLength: input.length,
            outputLength: response.content.length,
          },
        },
      })
    } catch (error) {
      logger.warn({ error }, 'Failed to log AI interaction')
    }
  }

  private getFallbackResponse(agentId: AgentId): string {
    const fallbacks: Record<AgentId, string> = {
      whatsapp_responder: 'Danke für deine Nachricht! Wir melden uns bald bei dir.',
      phone_assistant: 'Wir haben deinen Anruf notiert und melden uns schnellstmöglich.',
      email_responder: 'Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.',
      lead_classifier: '{"classification": "C", "priority": "medium", "confidence": 0.5}',
      followup_generator: 'Hallo! Wir wollten uns erkundigen, ob du noch Interesse an einem Probetraining hast?',
      training_plan_generator: 'Wir erstellen gerade deinen personalisierten Trainingsplan. Bitte hab einen Moment Geduld.',
      gym_buddy_coach: 'Hey! 💪 Dein Gym Buddy ist gleich wieder für dich da!',
      general_assistant: 'Wie kann ich dir helfen?',
    }

    return fallbacks[agentId] || 'Entschuldigung, es gab einen Fehler. Bitte versuche es später erneut.'
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const pilarAI = new PilarAIService()

// Also export the class for testing
export { PilarAIService }
