import { openai, AI_MODELS } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { logger } from '@/lib/logger'
import { AIMessageResponse, AIClassificationResult } from '@/types'

export async function processWhatsAppMessage(
  workspaceId: string,
  from: string,
  message: string,
  leadId?: string
) {
  try {
    logger.info({ workspaceId, from, message }, 'Processing WhatsApp message')

    let lead = leadId
      ? await prisma.lead.findUnique({ where: { id: leadId } })
      : await prisma.lead.findFirst({
          where: { workspaceId, phone: from },
        })

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          workspaceId,
          name: from,
          phone: from,
          source: 'whatsapp',
          status: 'new',
        },
      })
      logger.info({ leadId: lead.id }, 'Created new lead from WhatsApp')
    }

    await prisma.message.create({
      data: {
        workspaceId,
        leadId: lead.id,
        channel: 'whatsapp',
        direction: 'inbound',
        content: message,
        aiGenerated: false,
      },
    })

    const aiResponse = await generateWhatsAppResponse(workspaceId, lead.id, message)

    if (aiResponse.shouldSend) {
      await sendWhatsAppMessage(from, aiResponse.message)

      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'whatsapp',
          direction: 'outbound',
          content: aiResponse.message,
          aiGenerated: true,
        },
      })

      logger.info({ leadId: lead.id }, 'Sent AI-generated WhatsApp response')
    }

    if (lead.status === 'new') {
      const classification = await classifyLead(workspaceId, lead.id)
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          classification: classification.classification,
          priority: classification.priority,
        },
      })
      logger.info({ leadId: lead.id, classification }, 'Classified lead')
    }

    await scheduleFollowUp(workspaceId, lead.id, 'whatsapp')

    return { success: true, leadId: lead.id }
  } catch (error) {
    logger.error({ error, workspaceId, from }, 'Error processing WhatsApp message')
    throw error
  }
}

async function generateWhatsAppResponse(
  workspaceId: string,
  leadId: string,
  message: string
): Promise<AIMessageResponse> {
  try {
    const messages = await prisma.message.findMany({
      where: { workspaceId, leadId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        aiRules: {
          where: { ruleType: 'auto_reply', active: true },
        },
      },
    })

    const conversationHistory = messages
      .reverse()
      .map((m) => `${m.direction === 'inbound' ? 'Customer' : 'Studio'}: ${m.content}`)
      .join('\n')

    const systemPrompt = `You are an AI assistant for ${workspace?.name || 'a fitness studio'}. 
Your role is to respond to customer inquiries via WhatsApp in a friendly, professional manner.

Studio Information:
${JSON.stringify(workspace?.studioInfo || {}, null, 2)}

Conversation History:
${conversationHistory}

Current Message: ${message}

Generate a helpful, concise response. If the customer is asking about:
- Trial sessions: Offer to book a Probetraining
- Pricing: Provide information about membership plans
- Schedule: Share opening hours and availability
- General questions: Answer professionally and offer to help further

Keep responses under 200 characters when possible.`

    const completion = await openai.chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const response = completion.choices[0].message.content || ''

    return {
      message: response,
      shouldSend: true,
      confidence: 0.85,
      reasoning: 'Generated contextual response based on conversation history',
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error generating WhatsApp response')
    throw error
  }
}

async function classifyLead(
  workspaceId: string,
  leadId: string
): Promise<AIClassificationResult> {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        messages: true,
        callLogs: true,
      },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    const allMessages = lead.messages.map((m) => m.content).join('\n')
    const callSummaries = lead.callLogs.map((c) => c.aiSummary).join('\n')

    const systemPrompt = `You are an AI lead classifier for a fitness studio.
Analyze the lead's interactions and classify them as:
- A: High intent, ready to buy, asking about pricing/booking
- B: Medium intent, interested but needs nurturing
- C: Low intent, just browsing or asking general questions

Also determine priority (high, medium, low) based on urgency and value.

Lead Information:
Messages: ${allMessages}
Call Summaries: ${callSummaries}

Respond in JSON format:
{
  "classification": "A" | "B" | "C",
  "priority": "high" | "medium" | "low",
  "confidence": 0.0-1.0,
  "reasoning": "explanation",
  "suggestedActions": ["action1", "action2"]
}`

    const completion = await openai.chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      classification: result.classification || 'C',
      priority: result.priority || 'medium',
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning || '',
      suggestedActions: result.suggestedActions || [],
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error classifying lead')
    return {
      classification: 'C',
      priority: 'medium',
      confidence: 0.5,
      reasoning: 'Error during classification',
      suggestedActions: [],
    }
  }
}

async function scheduleFollowUp(
  workspaceId: string,
  leadId: string,
  channel: 'whatsapp' | 'email' | 'sms'
) {
  try {
    const rules = await prisma.aiRule.findMany({
      where: {
        workspaceId,
        ruleType: 'followup',
        active: true,
      },
    })

    const scheduledAt = new Date()
    scheduledAt.setHours(scheduledAt.getHours() + 24)

    await prisma.followup.create({
      data: {
        workspaceId,
        leadId,
        type: channel,
        scheduledAt,
        status: 'pending',
        content: 'Follow-up reminder',
      },
    })

    logger.info({ leadId, scheduledAt }, 'Scheduled follow-up')
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error scheduling follow-up')
  }
}
