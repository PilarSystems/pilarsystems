import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'
import { twilioClient, TWILIO_PHONE_NUMBER } from '@/lib/twilio'
import { logger } from '@/lib/logger'
import { openai, AI_MODELS } from '@/lib/openai'

export async function processScheduledFollowups() {
  try {
    logger.info('Processing scheduled follow-ups')

    const dueFollowups = await prisma.followup.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: new Date(),
        },
      },
      include: {
        lead: true,
        workspace: true,
      },
    })

    logger.info({ count: dueFollowups.length }, 'Found due follow-ups')

    for (const followup of dueFollowups) {
      try {
        await executeFollowup(followup)
      } catch (error) {
        logger.error({ error, followupId: followup.id }, 'Error executing follow-up')
        await prisma.followup.update({
          where: { id: followup.id },
          data: { status: 'failed' },
        })
      }
    }

    logger.info('Completed processing scheduled follow-ups')
  } catch (error) {
    logger.error({ error }, 'Error processing scheduled follow-ups')
  }
}

async function executeFollowup(followup: any) {
  try {
    logger.info({ followupId: followup.id, type: followup.type }, 'Executing follow-up')

    const message = await generateFollowupMessage(
      followup.workspace.id,
      followup.lead.id,
      followup.type
    )

    switch (followup.type) {
      case 'whatsapp':
        if (followup.lead.phone) {
          await sendWhatsAppMessage(followup.lead.phone, message)
          await prisma.message.create({
            data: {
              workspaceId: followup.workspaceId,
              leadId: followup.leadId,
              channel: 'whatsapp',
              direction: 'outbound',
              content: message,
              aiGenerated: true,
            },
          })
        }
        break

      case 'email':
        if (followup.lead.email) {
          await sendEmail(
            followup.lead.email,
            'Following up on your inquiry',
            `<p>${message.replace(/\n/g, '<br>')}</p>`
          )
          await prisma.message.create({
            data: {
              workspaceId: followup.workspaceId,
              leadId: followup.leadId,
              channel: 'email',
              direction: 'outbound',
              content: message,
              aiGenerated: true,
            },
          })
        }
        break

      case 'sms':
        if (followup.lead.phone) {
          await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: followup.lead.phone,
          })
          await prisma.message.create({
            data: {
              workspaceId: followup.workspaceId,
              leadId: followup.leadId,
              channel: 'sms',
              direction: 'outbound',
              content: message,
              aiGenerated: true,
            },
          })
        }
        break
    }

    await prisma.followup.update({
      where: { id: followup.id },
      data: {
        status: 'sent',
        completedAt: new Date(),
      },
    })

    await scheduleNextFollowup(followup.workspaceId, followup.leadId, followup.type)

    logger.info({ followupId: followup.id }, 'Follow-up executed successfully')
  } catch (error) {
    logger.error({ error, followupId: followup.id }, 'Error executing follow-up')
    throw error
  }
}

async function generateFollowupMessage(
  workspaceId: string,
  leadId: string,
  channel: string
): Promise<string> {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        calendarEvents: {
          where: {
            status: 'scheduled',
          },
        },
      },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })

    const recentMessages = lead.messages
      .map((m) => `${m.direction}: ${m.content}`)
      .join('\n')

    const systemPrompt = `You are an AI assistant for ${workspace?.name || 'a fitness studio'}.

Generate a personalized follow-up message for a lead via ${channel}.

Lead Information:
- Name: ${lead.name}
- Classification: ${lead.classification || 'Unknown'}
- Status: ${lead.status}
- Recent interactions: ${recentMessages || 'None'}
- Scheduled events: ${lead.calendarEvents.length}

Studio Information:
${JSON.stringify(workspace?.studioInfo || {}, null, 2)}

Create a warm, personalized follow-up that:
- References previous interactions if any
- Offers value (trial session, consultation, etc.)
- Has a clear call-to-action
- Feels natural and not automated

Keep it concise (${channel === 'sms' ? '160' : '200'} characters max for ${channel}).`

    const completion = await openai.chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
      max_tokens: 150,
    })

    return completion.choices[0].message.content || 'Hi! Just following up on your inquiry. How can we help?'
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error generating follow-up message')
    return 'Hi! Just following up on your inquiry. How can we help?'
  }
}

async function scheduleNextFollowup(
  workspaceId: string,
  leadId: string,
  channel: 'whatsapp' | 'email' | 'sms'
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        followups: {
          where: { status: 'sent' },
          orderBy: { completedAt: 'desc' },
        },
      },
    })

    if (!lead) return

    if (lead.status === 'converted' || lead.status === 'lost') {
      return
    }

    const rules = await prisma.aiRule.findMany({
      where: {
        workspaceId,
        ruleType: 'followup',
        active: true,
      },
    })

    let delayHours = 48 // Default: 2 days

    if (lead.classification === 'A') {
      delayHours = 24 // 1 day for hot leads
    } else if (lead.classification === 'B') {
      delayHours = 48 // 2 days for warm leads
    } else {
      delayHours = 72 // 3 days for cold leads
    }

    if (lead.followups.length >= 5) {
      logger.info({ leadId }, 'Max follow-ups reached, not scheduling more')
      return
    }

    const scheduledAt = new Date()
    scheduledAt.setHours(scheduledAt.getHours() + delayHours)

    await prisma.followup.create({
      data: {
        workspaceId,
        leadId,
        type: channel,
        scheduledAt,
        status: 'pending',
        content: 'Automated follow-up',
      },
    })

    logger.info({ leadId, scheduledAt }, 'Scheduled next follow-up')
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error scheduling next follow-up')
  }
}

export async function createFollowupSequence(
  workspaceId: string,
  leadId: string,
  sequenceType: 'trial' | 'inquiry' | 'callback'
) {
  try {
    logger.info({ workspaceId, leadId, sequenceType }, 'Creating follow-up sequence')

    const sequences = {
      trial: [
        { delay: 1, channel: 'whatsapp' as const, message: 'Trial reminder - 1 day before' },
        { delay: 24, channel: 'whatsapp' as const, message: 'Trial reminder - 1 hour before' },
        { delay: 48, channel: 'email' as const, message: 'Post-trial follow-up' },
      ],
      inquiry: [
        { delay: 24, channel: 'whatsapp' as const, message: 'Initial follow-up' },
        { delay: 72, channel: 'email' as const, message: 'Second follow-up' },
        { delay: 168, channel: 'whatsapp' as const, message: 'Final follow-up' },
      ],
      callback: [
        { delay: 2, channel: 'sms' as const, message: 'Immediate callback reminder' },
        { delay: 24, channel: 'whatsapp' as const, message: 'Follow-up if no response' },
      ],
    }

    const sequence = sequences[sequenceType]

    for (const step of sequence) {
      const scheduledAt = new Date()
      scheduledAt.setHours(scheduledAt.getHours() + step.delay)

      await prisma.followup.create({
        data: {
          workspaceId,
          leadId,
          type: step.channel,
          scheduledAt,
          status: 'pending',
          content: step.message,
        },
      })
    }

    logger.info({ leadId, sequenceType }, 'Follow-up sequence created')
  } catch (error) {
    logger.error({ error, workspaceId, leadId }, 'Error creating follow-up sequence')
  }
}
