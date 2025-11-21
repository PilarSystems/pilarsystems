/**
 * AI-Wizard Autopilot
 * 
 * Automated AI configuration generation and optimization
 * Enhances existing AI wizard with autopilot capabilities
 */

import { PrismaClient } from '@prisma/client'
import { aiRouter } from '@/lib/ai/multi-tenant-router'
import { eventBus } from '@/lib/autopilot/event-bus'

const prisma = new PrismaClient()

export interface WizardAutopilotConfig {
  workspaceId: string
  autoOptimize: boolean
  optimizationInterval: number // hours
  performanceThreshold: number // 0-100
  autoGenerateRules: boolean
  maxRulesPerWorkspace: number
}

export interface RulePerformanceMetrics {
  ruleId: string
  matches: number
  successes: number
  failures: number
  avgLatency: number
  lastFired: Date
  score: number // 0-100
}

export class AIWizardAutopilot {
  /**
   * Auto-generate AI configuration for new workspace
   */
  async autoGenerateConfig(workspaceId: string, studioInfo: any): Promise<void> {
    try {
      const systemPrompt = await this.generateSystemPrompt(studioInfo)

      const rules = await this.generateInitialRules(workspaceId, studioInfo)

      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          studioInfo: {
            ...(studioInfo || {}),
            aiConfig: {
              provider: 'openai',
              model: 'gpt-4-turbo',
              systemPrompt,
              temperature: 0.7,
              maxTokens: 1000,
              autoOptimize: true
            }
          }
        }
      })

      for (const rule of rules) {
        await prisma.aiRule.create({
          data: {
            workspaceId,
            ...rule
          }
        })
      }

      await eventBus.createEvent({
        workspaceId,
        type: 'provisioning.workspace_setup',
        payload: {
          rulesCount: rules.length,
          systemPrompt: systemPrompt.substring(0, 100)
        }
      })
    } catch (error) {
      console.error('Error auto-generating AI config:', error)
      throw error
    }
  }

  /**
   * Optimize AI configuration based on performance
   */
  async optimizeConfig(workspaceId: string): Promise<void> {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: {
          studioInfo: true,
          aiRules: {
            where: { active: true }
          }
        }
      })

      if (!workspace) {
        throw new Error(`Workspace ${workspaceId} not found`)
      }

      const metrics = await this.analyzeRulePerformance(workspaceId)

      const underperforming = metrics.filter(m => m.score < 50)

      for (const metric of underperforming) {
        await prisma.aiRule.update({
          where: { id: metric.ruleId },
          data: { active: false }
        })
      }

      if (underperforming.length > 0) {
        const studioInfo = workspace.studioInfo as any
        const newRules = await this.generateReplacementRules(
          workspaceId,
          studioInfo,
          underperforming
        )

        for (const rule of newRules) {
          await prisma.aiRule.create({
            data: {
              workspaceId,
              ...rule
            }
          })
        }
      }

      await eventBus.createEvent({
        workspaceId,
        type: 'provisioning.workspace_setup',
        payload: {
          disabledRules: underperforming.length,
          newRules: underperforming.length,
          avgScore: metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length
        }
      })
    } catch (error) {
      console.error('Error optimizing AI config:', error)
      throw error
    }
  }

  /**
   * Generate system prompt based on studio info
   */
  private async generateSystemPrompt(studioInfo: any): Promise<string> {
    const studioName = studioInfo?.name || 'Fitness Studio'
    const studioType = studioInfo?.type || 'gym'
    const language = studioInfo?.language || 'de'

    const prompt = `Generate a professional system prompt for an AI fitness coach assistant for ${studioName}, a ${studioType}. The assistant should be motivational, knowledgeable, and supportive. Language: ${language}.`

    try {
      const response = await aiRouter.route({
        workspaceId: 'system',
        prompt,
        maxTokens: 500
      })

      return response.content
    } catch (error) {
      console.error('Error generating system prompt:', error)
      return `Du bist ein professioneller Fitness-Coach für ${studioName}. Du bist motivierend, unterstützend und hilfst Mitgliedern dabei, ihre Fitnessziele zu erreichen.`
    }
  }

  /**
   * Generate initial AI rules for workspace
   */
  private async generateInitialRules(workspaceId: string, studioInfo: any): Promise<any[]> {
    const rules = [
      {
        ruleType: 'greeting',
        trigger: 'new_lead',
        conditions: JSON.stringify([
          { type: 'keyword_match', operator: 'contains', value: 'hallo|hi|hey' }
        ]),
        actions: JSON.stringify([
          {
            type: 'send_template',
            parameters: {
              template: 'welcome_message',
              delay: 0
            }
          }
        ]),
        priority: 10,
        active: true
      },
      {
        ruleType: 'training_reminder',
        trigger: 'scheduled',
        conditions: JSON.stringify([
          { type: 'time_based', operator: 'equals', value: '08:00' }
        ]),
        actions: JSON.stringify([
          {
            type: 'send_text',
            parameters: {
              message: 'Guten Morgen! Bereit für dein Training heute? 💪'
            }
          }
        ]),
        priority: 8,
        active: true
      },
      {
        ruleType: 'missed_training',
        trigger: 'event',
        conditions: JSON.stringify([
          { type: 'lead_property', operator: 'equals', value: 'missed_training' }
        ]),
        actions: JSON.stringify([
          {
            type: 'send_text',
            parameters: {
              message: 'Kein Problem! Wann passt es dir besser? Ich helfe dir, einen neuen Termin zu finden.'
            }
          }
        ]),
        priority: 7,
        active: true
      },
      {
        ruleType: 'goal_progress',
        trigger: 'scheduled',
        conditions: JSON.stringify([
          { type: 'time_based', operator: 'equals', value: 'weekly' }
        ]),
        actions: JSON.stringify([
          {
            type: 'send_text',
            parameters: {
              message: 'Wie läuft es mit deinen Fitnesszielen diese Woche? 🎯'
            }
          }
        ]),
        priority: 6,
        active: true
      },
      {
        ruleType: 'nutrition_tip',
        trigger: 'scheduled',
        conditions: JSON.stringify([
          { type: 'time_based', operator: 'equals', value: 'daily' }
        ]),
        actions: JSON.stringify([
          {
            type: 'send_text',
            parameters: {
              message: 'Tipp des Tages: Vergiss nicht, genug Wasser zu trinken! 💧'
            }
          }
        ]),
        priority: 5,
        active: true
      }
    ]

    return rules
  }

  /**
   * Generate replacement rules for underperforming ones
   */
  private async generateReplacementRules(
    workspaceId: string,
    studioInfo: any,
    underperforming: RulePerformanceMetrics[]
  ): Promise<any[]> {
    return this.generateInitialRules(workspaceId, studioInfo)
  }

  /**
   * Analyze rule performance
   */
  private async analyzeRulePerformance(workspaceId: string): Promise<RulePerformanceMetrics[]> {
    const rules = await prisma.aiRule.findMany({
      where: {
        workspaceId,
        active: true
      }
    })

    const metrics: RulePerformanceMetrics[] = []

    for (const rule of rules) {
      const executions = await prisma.autopilotEvent.count({
        where: {
          workspaceId,
          type: 'ai_rule.executed',
          payload: {
            path: ['ruleId'],
            equals: rule.id
          }
        }
      })

      const failures = await prisma.autopilotEvent.count({
        where: {
          workspaceId,
          type: 'ai_rule.failed',
          payload: {
            path: ['ruleId'],
            equals: rule.id
          }
        }
      })

      const successes = executions - failures
      const successRate = executions > 0 ? (successes / executions) * 100 : 0

      const usageScore = Math.min(executions / 10, 100) // Max score at 10+ executions
      const score = (successRate * 0.7) + (usageScore * 0.3)

      metrics.push({
        ruleId: rule.id,
        matches: executions,
        successes,
        failures,
        avgLatency: 0, // Would need to track this separately
        lastFired: rule.updatedAt,
        score
      })
    }

    return metrics
  }

  /**
   * Get autopilot configuration
   */
  async getConfig(workspaceId: string): Promise<WizardAutopilotConfig> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true }
    })

    const studioInfo = workspace?.studioInfo as any
    const aiConfig = studioInfo?.aiConfig || {}

    return {
      workspaceId,
      autoOptimize: aiConfig.autoOptimize !== false,
      optimizationInterval: aiConfig.optimizationInterval || 24,
      performanceThreshold: aiConfig.performanceThreshold || 50,
      autoGenerateRules: aiConfig.autoGenerateRules !== false,
      maxRulesPerWorkspace: aiConfig.maxRulesPerWorkspace || 20
    }
  }

  /**
   * Update autopilot configuration
   */
  async updateConfig(
    workspaceId: string,
    config: Partial<WizardAutopilotConfig>
  ): Promise<void> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true }
    })

    const studioInfo = workspace?.studioInfo as any || {}
    const aiConfig = studioInfo.aiConfig || {}

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        studioInfo: {
          ...studioInfo,
          aiConfig: {
            ...aiConfig,
            ...config
          }
        }
      }
    })
  }
}

export const aiWizardAutopilot = new AIWizardAutopilot()
