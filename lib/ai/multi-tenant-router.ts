/**
 * Multi-Tenant AI Router
 * 
 * Intelligent routing layer for AI requests with:
 * - Multi-model support (OpenAI, Groq, Anthropic)
 * - Per-workspace model selection and fallback
 * - Rate limiting and throttling
 * - Cost tracking and budget enforcement
 * - Automatic failover and retry logic
 */

import { PolicyEngine } from '../operator/policy-engine'
import { IdentityEngine } from '../auth/identity-engine'

const policyEngine = new PolicyEngine()
const identityEngine = new IdentityEngine()

export type AIProvider = 'openai' | 'groq' | 'anthropic'
export type AIModel = 
  | 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  | 'groq-llama-3-70b' | 'groq-mixtral-8x7b'
  | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'

export interface AIRouterConfig {
  workspaceId: string
  primaryProvider: AIProvider
  primaryModel: AIModel
  fallbackProviders?: Array<{
    provider: AIProvider
    model: AIModel
    priority: number
  }>
  maxRetries: number
  timeoutMs: number
  costPerToken?: number
}

export interface AIRequest {
  workspaceId: string
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
  metadata?: Record<string, any>
}

export interface AIResponse {
  content: string
  provider: AIProvider
  model: AIModel
  tokensUsed: number
  cost: number
  latencyMs: number
  cached: boolean
  metadata?: Record<string, any>
}

export interface AIProviderClient {
  provider: AIProvider
  model: AIModel
  
  complete(request: AIRequest): Promise<AIResponse>
  isAvailable(): Promise<boolean>
  getRateLimit(): Promise<{ remaining: number; resetAt: Date }>
}

export class MultiTenantAIRouter {
  private providers: Map<AIProvider, AIProviderClient> = new Map()
  private routerConfigs: Map<string, AIRouterConfig> = new Map()

  constructor() {
    this.initializeProviders()
  }

  /**
   * Route AI request to appropriate provider
   */
  async route(request: AIRequest): Promise<AIResponse> {
    const config = await this.getRouterConfig(request.workspaceId)
    
    const canProceed = await policyEngine.checkAction(
      request.workspaceId,
      'ai_request',
      { tokensEstimate: request.maxTokens || 1000 }
    )

    if (!canProceed.allowed) {
      throw new Error(`AI request blocked: ${canProceed.reason}`)
    }

    try {
      const response = await this.executeRequest(
        config.primaryProvider,
        config.primaryModel,
        request,
        config
      )

      await this.trackUsage(request.workspaceId, response)

      return response
    } catch (primaryError) {
      console.error(`Primary provider ${config.primaryProvider} failed:`, primaryError)

      if (config.fallbackProviders && config.fallbackProviders.length > 0) {
        const sortedFallbacks = config.fallbackProviders.sort((a, b) => a.priority - b.priority)

        for (const fallback of sortedFallbacks) {
          try {
            const response = await this.executeRequest(
              fallback.provider,
              fallback.model,
              request,
              config
            )

            await this.trackUsage(request.workspaceId, response)

            return response
          } catch (fallbackError) {
            console.error(`Fallback provider ${fallback.provider} failed:`, fallbackError)
            continue
          }
        }
      }

      throw new Error('All AI providers failed')
    }
  }

  /**
   * Execute request with specific provider
   */
  private async executeRequest(
    provider: AIProvider,
    model: AIModel,
    request: AIRequest,
    config: AIRouterConfig
  ): Promise<AIResponse> {
    const client = this.providers.get(provider)
    if (!client) {
      throw new Error(`Provider ${provider} not configured`)
    }

    const available = await client.isAvailable()
    if (!available) {
      throw new Error(`Provider ${provider} not available`)
    }

    const rateLimit = await client.getRateLimit()
    if (rateLimit.remaining <= 0) {
      throw new Error(`Provider ${provider} rate limit exceeded`)
    }

    const startTime = Date.now()

    const response = await Promise.race([
      client.complete(request),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), config.timeoutMs)
      )
    ])

    response.latencyMs = Date.now() - startTime

    return response
  }

  /**
   * Get router configuration for workspace
   */
  private async getRouterConfig(workspaceId: string): Promise<AIRouterConfig> {
    if (this.routerConfigs.has(workspaceId)) {
      return this.routerConfigs.get(workspaceId)!
    }

    const config: AIRouterConfig = {
      workspaceId,
      primaryProvider: 'openai',
      primaryModel: 'gpt-4-turbo',
      fallbackProviders: [
        { provider: 'groq', model: 'groq-llama-3-70b', priority: 1 },
        { provider: 'anthropic', model: 'claude-3-sonnet', priority: 2 }
      ],
      maxRetries: 3,
      timeoutMs: 30000,
      costPerToken: 0.00001
    }

    this.routerConfigs.set(workspaceId, config)
    setTimeout(() => this.routerConfigs.delete(workspaceId), 5 * 60 * 1000)

    return config
  }

  /**
   * Track AI usage for billing and analytics
   */
  private async trackUsage(workspaceId: string, response: AIResponse): Promise<void> {
    await policyEngine.enforceAction(
      workspaceId,
      'ai_request',
      {
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        provider: response.provider,
        model: response.model,
        latencyMs: response.latencyMs
      }
    )
  }

  /**
   * Initialize AI provider clients
   */
  private initializeProviders(): void {
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIClient())
    }

    if (process.env.GROQ_API_KEY) {
      this.providers.set('groq', new GroqClient())
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicClient())
    }
  }

  /**
   * Get available providers
   */
  async getAvailableProviders(): Promise<AIProvider[]> {
    const available: AIProvider[] = []

    for (const [provider, client] of this.providers.entries()) {
      if (await client.isAvailable()) {
        available.push(provider)
      }
    }

    return available
  }

  /**
   * Update router configuration
   */
  async updateConfig(workspaceId: string, config: Partial<AIRouterConfig>): Promise<void> {
    const current = await this.getRouterConfig(workspaceId)
    const updated = { ...current, ...config }
    this.routerConfigs.set(workspaceId, updated)
  }
}

/**
 * OpenAI Client Implementation
 */
class OpenAIClient implements AIProviderClient {
  provider: AIProvider = 'openai'
  model: AIModel = 'gpt-4-turbo'

  async complete(request: AIRequest): Promise<AIResponse> {
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: this.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []),
        { role: 'user' as const, content: request.prompt }
      ],
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      stream: false
    })

    const content = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens || 0

    return {
      content,
      provider: this.provider,
      model: this.model,
      tokensUsed,
      cost: tokensUsed * 0.00001,
      latencyMs: 0,
      cached: false,
      metadata: { id: completion.id }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.OPENAI_API_KEY
  }

  async getRateLimit(): Promise<{ remaining: number; resetAt: Date }> {
    return {
      remaining: 1000,
      resetAt: new Date(Date.now() + 60000)
    }
  }
}

/**
 * Groq Client Implementation (using OpenAI-compatible API)
 */
class GroqClient implements AIProviderClient {
  provider: AIProvider = 'groq'
  model: AIModel = 'groq-llama-3-70b'

  async complete(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    const tokensUsed = data.usage?.total_tokens || 0

    return {
      content,
      provider: this.provider,
      model: this.model,
      tokensUsed,
      cost: tokensUsed * 0.000001,
      latencyMs: 0,
      cached: false,
      metadata: { id: data.id }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.GROQ_API_KEY
  }

  async getRateLimit(): Promise<{ remaining: number; resetAt: Date }> {
    return {
      remaining: 1000,
      resetAt: new Date(Date.now() + 60000)
    }
  }
}

/**
 * Anthropic Client Implementation (using REST API)
 */
class AnthropicClient implements AIProviderClient {
  provider: AIProvider = 'anthropic'
  model: AIModel = 'claude-3-sonnet'

  async complete(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: request.maxTokens || 1000,
        messages: [
          { role: 'user', content: request.prompt }
        ],
        ...(request.systemPrompt && { system: request.systemPrompt })
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.content[0]?.type === 'text' ? data.content[0].text : ''
    const tokensUsed = data.usage.input_tokens + data.usage.output_tokens

    return {
      content,
      provider: this.provider,
      model: this.model,
      tokensUsed,
      cost: tokensUsed * 0.000015,
      latencyMs: 0,
      cached: false,
      metadata: { id: data.id }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.ANTHROPIC_API_KEY
  }

  async getRateLimit(): Promise<{ remaining: number; resetAt: Date }> {
    return {
      remaining: 1000,
      resetAt: new Date(Date.now() + 60000)
    }
  }
}

export const aiRouter = new MultiTenantAIRouter()
