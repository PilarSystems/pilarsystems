/**
 * PILAR AUTOPILOT v5.0 - AI-Onboarding Wizard
 * 
 * Multi-step wizard with template-based defaults + AI customization
 * Generates: AI rules, WhatsApp followups, email templates, brand voice, CRM defaults
 */

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { openaiAdapter } from '@/lib/integrations/openai-adapter'

export const WizardInputSchema = z.object({
  studioType: z.enum(['fitness', 'yoga', 'crossfit', 'martial_arts', 'dance', 'pilates', 'other']),
  brandTone: z.enum(['professional', 'friendly', 'motivational', 'casual', 'luxury']),
  language: z.enum(['de', 'en']),
  targetAudience: z.string().optional(),
  businessGoals: z.array(z.string()).optional(),
  customization: z.string().optional(),
})

export type WizardInput = z.infer<typeof WizardInputSchema>

export interface WizardOutput {
  aiRules: Array<{
    name: string
    description: string
    condition: string
    action: string
    priority: number
  }>
  followupTemplates: Array<{
    name: string
    delayHours: number
    content: string
    type: 'whatsapp' | 'email' | 'sms'
  }>
  brandVoice: {
    tone: string
    style: string
    keywords: string[]
    doNots: string[]
  }
  crmDefaults: {
    leadStatuses: string[]
    tags: string[]
    customFields: Record<string, string>
  }
}

/**
 * Template-based defaults by studio type
 */
const STUDIO_TEMPLATES: Record<string, Partial<WizardOutput>> = {
  fitness: {
    aiRules: [
      {
        name: 'Probetraining Anfrage',
        description: 'Automatische Antwort auf Probetraining-Anfragen',
        condition: 'message contains "probetraining" or "trial"',
        action: 'send_template: trial_booking',
        priority: 10,
      },
      {
        name: 'Preisanfrage',
        description: 'Automatische Preisauskunft',
        condition: 'message contains "preis" or "kosten" or "price"',
        action: 'send_template: pricing_info',
        priority: 8,
      },
    ],
    followupTemplates: [
      {
        name: 'Willkommens-Nachricht',
        delayHours: 1,
        content: 'Willkommen! 🎉 Schön, dass du dich für unser Studio interessierst. Hast du Fragen?',
        type: 'whatsapp',
      },
      {
        name: 'Probetraining Erinnerung',
        delayHours: 24,
        content: 'Hey! Hast du schon einen Termin für dein Probetraining gebucht? 💪',
        type: 'whatsapp',
      },
    ],
    crmDefaults: {
      leadStatuses: ['Neu', 'Kontaktiert', 'Probetraining gebucht', 'Probetraining absolviert', 'Mitglied', 'Abgelehnt'],
      tags: ['Fitness', 'Anfänger', 'Fortgeschritten', 'Gewichtsverlust', 'Muskelaufbau'],
      customFields: {
        fitness_level: 'Anfänger',
        goals: 'Gewichtsverlust',
      },
    },
  },
  yoga: {
    aiRules: [
      {
        name: 'Kursplan Anfrage',
        description: 'Automatische Antwort auf Kursplan-Anfragen',
        condition: 'message contains "kursplan" or "schedule"',
        action: 'send_template: schedule_info',
        priority: 10,
      },
    ],
    followupTemplates: [
      {
        name: 'Willkommens-Nachricht',
        delayHours: 1,
        content: 'Namaste 🙏 Schön, dass du dich für unser Yoga-Studio interessierst.',
        type: 'whatsapp',
      },
    ],
    crmDefaults: {
      leadStatuses: ['Neu', 'Kontaktiert', 'Probestunde gebucht', 'Mitglied'],
      tags: ['Yoga', 'Anfänger', 'Meditation', 'Entspannung'],
      customFields: {
        experience_level: 'Anfänger',
        preferred_style: 'Hatha',
      },
    },
  },
}

/**
 * Generate AI-customized configuration
 */
export async function generateWizardConfig(
  workspaceId: string,
  input: WizardInput
): Promise<WizardOutput> {
  try {
    logger.info({ workspaceId, input }, 'Generating AI wizard config')

    const template = STUDIO_TEMPLATES[input.studioType] || STUDIO_TEMPLATES.fitness

    const prompt = buildCustomizationPrompt(input, template)
    const aiResponse = await generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    if (!aiResponse.ok || !aiResponse.data) {
      logger.warn({ workspaceId }, 'AI generation failed, using template defaults')
      return buildDefaultOutput(template, input)
    }

    const customized = parseAIResponse(aiResponse.data, template, input)

    logger.info({ workspaceId }, 'AI wizard config generated successfully')
    return customized
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to generate wizard config')
    return buildDefaultOutput(STUDIO_TEMPLATES[input.studioType] || STUDIO_TEMPLATES.fitness, input)
  }
}

/**
 * Build AI customization prompt
 */
function buildCustomizationPrompt(input: WizardInput, template: Partial<WizardOutput>): string {
  const language = input.language === 'de' ? 'Deutsch' : 'English'
  
  return `Du bist ein Experte für Fitness-Studio-Automatisierung. Erstelle eine personalisierte Konfiguration für ein ${input.studioType}-Studio.

**Studio-Details:**
- Typ: ${input.studioType}
- Ton: ${input.brandTone}
- Sprache: ${language}
- Zielgruppe: ${input.targetAudience || 'Allgemein'}
- Ziele: ${input.businessGoals?.join(', ') || 'Mitgliedergewinnung'}
- Anpassungen: ${input.customization || 'Keine'}

**Aufgabe:**
Erstelle 3-5 zusätzliche AI-Regeln und 2-3 Followup-Templates, die perfekt zu diesem Studio passen.

**Format (JSON):**
{
  "aiRules": [
    {
      "name": "Regel Name",
      "description": "Beschreibung",
      "condition": "Bedingung",
      "action": "Aktion",
      "priority": 5
    }
  ],
  "followupTemplates": [
    {
      "name": "Template Name",
      "delayHours": 24,
      "content": "Nachricht in ${language}",
      "type": "whatsapp"
    }
  ],
  "brandVoice": {
    "tone": "${input.brandTone}",
    "style": "Beschreibung des Stils",
    "keywords": ["keyword1", "keyword2"],
    "doNots": ["dont1", "dont2"]
  }
}

Antworte NUR mit dem JSON, keine Erklärungen.`
}

/**
 * Parse AI response
 */
function parseAIResponse(
  aiText: string,
  template: Partial<WizardOutput>,
  input: WizardInput
): WizardOutput {
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      aiRules: [...(template.aiRules || []), ...(parsed.aiRules || [])],
      followupTemplates: [...(template.followupTemplates || []), ...(parsed.followupTemplates || [])],
      brandVoice: parsed.brandVoice || {
        tone: input.brandTone,
        style: 'Professional and friendly',
        keywords: [],
        doNots: [],
      },
      crmDefaults: template.crmDefaults || {
        leadStatuses: ['Neu', 'Kontaktiert', 'Mitglied'],
        tags: [],
        customFields: {},
      },
    }
  } catch (error: any) {
    logger.error({ error }, 'Failed to parse AI response')
    return buildDefaultOutput(template, input)
  }
}

/**
 * Build default output from template
 */
function buildDefaultOutput(template: Partial<WizardOutput>, input: WizardInput): WizardOutput {
  return {
    aiRules: template.aiRules || [],
    followupTemplates: template.followupTemplates || [],
    brandVoice: template.brandVoice || {
      tone: input.brandTone,
      style: 'Professional and friendly',
      keywords: [],
      doNots: [],
    },
    crmDefaults: template.crmDefaults || {
      leadStatuses: ['Neu', 'Kontaktiert', 'Mitglied'],
      tags: [],
      customFields: {},
    },
  }
}

/**
 * Save wizard config to workspace
 */
export async function saveWizardConfig(
  workspaceId: string,
  config: WizardOutput
): Promise<void> {
  try {
    logger.info({ workspaceId }, 'Saving wizard config to workspace')

    for (const rule of config.aiRules) {
      await prisma.aiRule.create({
        data: {
          workspaceId,
          name: rule.name,
          description: rule.description,
          condition: rule.condition,
          action: rule.action,
          priority: rule.priority,
          enabled: true,
        },
      })
    }

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        studioInfo: {
          brandVoice: config.brandVoice,
          crmDefaults: config.crmDefaults,
          followupTemplates: config.followupTemplates,
        },
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'ai_wizard_completed',
        description: 'AI-Onboarding Wizard completed',
        metadata: {
          rulesCount: config.aiRules.length,
          templatesCount: config.followupTemplates.length,
        },
      },
    })

    logger.info({ workspaceId }, 'Wizard config saved successfully')
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to save wizard config')
    throw error
  }
}

/**
 * Run automated smoke tests after wizard completion
 */
export async function runWizardSmokeTests(workspaceId: string): Promise<{
  passed: boolean
  tests: Array<{ name: string; passed: boolean; error?: string }>
}> {
  const tests: Array<{ name: string; passed: boolean; error?: string }> = []

  try {
    const rulesCount = await prisma.aiRule.count({ where: { workspaceId } })
    tests.push({
      name: 'AI Rules Created',
      passed: rulesCount > 0,
      error: rulesCount === 0 ? 'No AI rules found' : undefined,
    })

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { studioInfo: true },
    })
    tests.push({
      name: 'Studio Info Populated',
      passed: workspace?.studioInfo !== null,
      error: !workspace?.studioInfo ? 'Studio info not set' : undefined,
    })

    const activityLog = await prisma.activityLog.findFirst({
      where: {
        workspaceId,
        actionType: 'ai_wizard_completed',
      },
    })
    tests.push({
      name: 'Activity Log Entry',
      passed: activityLog !== null,
      error: !activityLog ? 'No activity log entry' : undefined,
    })

    const passed = tests.every((t) => t.passed)
    logger.info({ workspaceId, passed, tests }, 'Wizard smoke tests completed')

    return { passed, tests }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Wizard smoke tests failed')
    return {
      passed: false,
      tests: [{ name: 'Smoke Tests', passed: false, error: error.message }],
    }
  }
}
