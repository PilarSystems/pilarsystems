import { getOpenAI, AI_MODELS } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

export async function processIncomingEmail(
  workspaceId: string,
  from: string,
  subject: string,
  body: string,
  html?: string
) {
  try {
    logger.info({ workspaceId, from, subject }, 'Processing incoming email')

    let lead = await prisma.lead.findFirst({
      where: { workspaceId, email: from },
    })

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          workspaceId,
          name: from.split('@')[0],
          email: from,
          source: 'email',
          status: 'new',
        },
      })
      logger.info({ leadId: lead.id }, 'Created new lead from email')
    }

    await prisma.message.create({
      data: {
        workspaceId,
        leadId: lead.id,
        channel: 'email',
        direction: 'inbound',
        content: body,
        metadata: { subject, html },
        aiGenerated: false,
      },
    })

    const classification = await classifyEmail(subject, body)

    const aiResponse = await generateEmailResponse(
      workspaceId,
      lead.id,
      subject,
      body,
      classification
    )

    if (aiResponse.shouldSend) {
      await sendEmail(from, `Re: ${subject}`, aiResponse.html)

      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'email',
          direction: 'outbound',
          content: aiResponse.text,
          metadata: { subject: `Re: ${subject}`, html: aiResponse.html },
          aiGenerated: true,
        },
      })

      logger.info({ leadId: lead.id }, 'Sent AI-generated email response')
    }

    if (lead.status === 'new') {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          classification: classification.leadClass,
          priority: classification.priority,
        },
      })
    }

    return { success: true, leadId: lead.id }
  } catch (error) {
    logger.error({ error, workspaceId, from }, 'Error processing email')
    throw error
  }
}

async function classifyEmail(subject: string, body: string) {
  try {
    const systemPrompt = `You are an AI email classifier for a fitness studio.

Subject: ${subject}
Body: ${body}

Classify the email intent and determine:
1. Intent type (inquiry, booking, complaint, general)
2. Lead classification (A, B, C)
3. Priority (high, medium, low)
4. Whether it requires immediate response

Respond in JSON format:
{
  "intent": "inquiry" | "booking" | "complaint" | "general",
  "leadClass": "A" | "B" | "C",
  "priority": "high" | "medium" | "low",
  "requiresResponse": true | false
}`

    const completion = await getOpenAI().chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      intent: result.intent || 'general',
      leadClass: result.leadClass || 'C',
      priority: result.priority || 'medium',
      requiresResponse: result.requiresResponse !== false,
    }
  } catch (error) {
    logger.error({ error }, 'Error classifying email')
    return {
      intent: 'general',
      leadClass: 'C' as const,
      priority: 'medium' as const,
      requiresResponse: true,
    }
  }
}

async function generateEmailResponse(
  workspaceId: string,
  leadId: string,
  subject: string,
  body: string,
  classification: any
) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })

    const systemPrompt = `You are an AI assistant for ${workspace?.name || 'a fitness studio'}.

Generate a professional, helpful email response to:
Subject: ${subject}
Body: ${body}

Intent: ${classification.intent}

Studio Information:
${JSON.stringify(workspace?.studioInfo || {}, null, 2)}

Write a warm, professional response that:
- Addresses their inquiry directly
- Provides relevant information
- Offers next steps (booking, trial, etc.)
- Includes a call-to-action

Keep it concise and friendly.`

    const completion = await getOpenAI().chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseText = completion.choices[0].message.content || ''

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        ${responseText.split('\n').map((p) => `<p>${p}</p>`).join('')}
        <br>
        <p>Best regards,<br>${workspace?.name || 'The Team'}</p>
      </div>
    `

    return {
      text: responseText,
      html,
      shouldSend: classification.requiresResponse,
    }
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error generating email response')
    return {
      text: 'Thank you for your email. We will get back to you shortly.',
      html: '<p>Thank you for your email. We will get back to you shortly.</p>',
      shouldSend: false,
    }
  }
}
