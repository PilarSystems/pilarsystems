import { getOpenAI, AI_MODELS } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { LeadClassification, Priority } from '@/types'

export async function classifyAndPrioritizeLead(
  workspaceId: string,
  leadId: string
): Promise<{
  classification: LeadClassification
  priority: Priority
  reasoning: string
  suggestedActions: string[]
}> {
  try {
    logger.info({ workspaceId, leadId }, 'Classifying and prioritizing lead')

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        callLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        calendarEvents: true,
        tasks: true,
      },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    const rules = await prisma.aiRule.findMany({
      where: {
        workspaceId,
        ruleType: 'classification',
        active: true,
      },
    })

    const context = {
      leadInfo: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        createdAt: lead.createdAt,
      },
      interactions: {
        totalMessages: lead.messages.length,
        totalCalls: lead.callLogs.length,
        scheduledEvents: lead.calendarEvents.length,
        recentMessages: lead.messages.slice(0, 5).map((m) => ({
          channel: m.channel,
          direction: m.direction,
          content: m.content.substring(0, 200),
          createdAt: m.createdAt,
        })),
        recentCalls: lead.callLogs.slice(0, 3).map((c) => ({
          status: c.status,
          summary: c.aiSummary,
          createdAt: c.createdAt,
        })),
      },
      customRules: rules.map((r) => ({
        conditions: r.conditions,
        actions: r.actions,
      })),
    }

    const systemPrompt = `You are an AI lead classification engine for a fitness studio.

Analyze the lead and classify them:

Classification Levels:
- A: High intent, ready to buy, actively engaging, asking about pricing/booking
- B: Medium intent, interested but needs nurturing, asking questions
- C: Low intent, just browsing, minimal engagement

Priority Levels:
- high: Urgent, hot lead, immediate action needed
- medium: Normal follow-up, standard timeline
- low: Long-term nurture, no urgency

Lead Context:
${JSON.stringify(context, null, 2)}

Respond in JSON format:
{
  "classification": "A" | "B" | "C",
  "priority": "high" | "medium" | "low",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation",
  "suggestedActions": ["action1", "action2", "action3"]
}`

    const completion = await getOpenAI().chat.completions.create({
      model: AI_MODELS.GPT4,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        classification: result.classification || 'C',
        priority: result.priority || 'medium',
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        leadId,
        actionType: 'lead_classified',
        description: `Lead classified as ${result.classification} with ${result.priority} priority`,
        metadata: result,
      },
    })

    logger.info({ leadId, result }, 'Lead classified successfully')

    return {
      classification: result.classification || 'C',
      priority: result.priority || 'medium',
      reasoning: result.reasoning || '',
      suggestedActions: result.suggestedActions || [],
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error classifying lead')
    throw error
  }
}

export async function applyAIRules(workspaceId: string, leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    const rules = await prisma.aiRule.findMany({
      where: {
        workspaceId,
        active: true,
      },
    })

    for (const rule of rules) {
      const shouldApply = evaluateRuleConditions(rule.conditions, lead)

      if (shouldApply) {
        await applyRuleActions(workspaceId, leadId, rule.actions)

        logger.info({ leadId, ruleId: rule.id }, 'Applied AI rule')
      }
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error applying AI rules')
  }
}

function evaluateRuleConditions(conditions: any, lead: any): boolean {
  try {
    if (conditions.classification && lead.classification !== conditions.classification) {
      return false
    }
    if (conditions.source && lead.source !== conditions.source) {
      return false
    }
    if (conditions.status && lead.status !== conditions.status) {
      return false
    }
    return true
  } catch (error) {
    logger.error({ error }, 'Error evaluating rule conditions')
    return false
  }
}

async function applyRuleActions(workspaceId: string, leadId: string, actions: any) {
  try {
    if (actions.assignTo) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { assignedToId: actions.assignTo },
      })
    }

    if (actions.createTask) {
      await prisma.task.create({
        data: {
          workspaceId,
          leadId,
          title: actions.createTask.title,
          description: actions.createTask.description,
          priority: actions.createTask.priority || 'medium',
          status: 'pending',
        },
      })
    }

    if (actions.scheduleFollowup) {
      const scheduledAt = new Date()
      scheduledAt.setHours(scheduledAt.getHours() + (actions.scheduleFollowup.delayHours || 24))

      await prisma.followup.create({
        data: {
          workspaceId,
          leadId,
          type: actions.scheduleFollowup.channel || 'whatsapp',
          scheduledAt,
          status: 'pending',
          content: actions.scheduleFollowup.message || 'Follow-up reminder',
        },
      })
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error applying rule actions')
  }
}
