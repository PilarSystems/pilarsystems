import { openai, AI_MODELS } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { twilioClient, TWILIO_PHONE_NUMBER } from '@/lib/twilio'
import { logger } from '@/lib/logger'

export async function processMissedCall(
  workspaceId: string,
  from: string,
  callSid: string,
  recordingUrl?: string,
  transcriptionText?: string
) {
  try {
    logger.info({ workspaceId, from, callSid }, 'Processing missed call')

    let lead = await prisma.lead.findFirst({
      where: { workspaceId, phone: from },
    })

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          workspaceId,
          name: from,
          phone: from,
          source: 'phone',
          status: 'new',
        },
      })
      logger.info({ leadId: lead.id }, 'Created new lead from phone call')
    }

    const aiAnalysis = await analyzeCall(transcriptionText || 'No voicemail left')

    const callLog = await prisma.callLog.create({
      data: {
        workspaceId,
        leadId: lead.id,
        phoneNumber: from,
        direction: 'inbound',
        status: 'missed',
        recordingUrl,
        transcript: transcriptionText,
        aiSummary: aiAnalysis.summary,
        aiActions: aiAnalysis.actions,
      },
    })

    logger.info({ callLogId: callLog.id }, 'Created call log with AI analysis')

    await prisma.task.create({
      data: {
        workspaceId,
        leadId: lead.id,
        title: 'Callback: Missed Call',
        description: `Missed call from ${from}. ${aiAnalysis.summary}`,
        priority: aiAnalysis.priority,
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      },
    })

    if (aiAnalysis.shouldSendSMS) {
      await twilioClient.messages.create({
        body: aiAnalysis.smsMessage,
        from: TWILIO_PHONE_NUMBER,
        to: from,
      })

      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'sms',
          direction: 'outbound',
          content: aiAnalysis.smsMessage,
          aiGenerated: true,
        },
      })

      logger.info({ leadId: lead.id }, 'Sent SMS follow-up')
    }

    return { success: true, leadId: lead.id, callLogId: callLog.id }
  } catch (error) {
    logger.error({ error, workspaceId, from }, 'Error processing missed call')
    throw error
  }
}

async function analyzeCall(transcriptionText: string) {
  try {
    const systemPrompt = `You are an AI assistant analyzing a missed call for a fitness studio.

Voicemail/Transcription: ${transcriptionText}

Analyze the call and provide:
1. A brief summary (1-2 sentences)
2. Suggested actions for the team
3. Priority level (high, medium, low)
4. Whether to send an SMS follow-up
5. SMS message content if applicable

Respond in JSON format:
{
  "summary": "brief summary",
  "actions": ["action1", "action2"],
  "priority": "high" | "medium" | "low",
  "shouldSendSMS": true | false,
  "smsMessage": "message content"
}`

    const completion = await openai.chat.completions.create({
      model: AI_MODELS.GPT4_MINI,
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      summary: result.summary || 'Missed call - no voicemail',
      actions: result.actions || ['Call back customer'],
      priority: result.priority || 'medium',
      shouldSendSMS: result.shouldSendSMS || true,
      smsMessage:
        result.smsMessage ||
        'Hi! We missed your call. How can we help you? Reply or call us back anytime.',
    }
  } catch (error) {
    logger.error({ error }, 'Error analyzing call')
    return {
      summary: 'Missed call - analysis failed',
      actions: ['Call back customer'],
      priority: 'medium' as const,
      shouldSendSMS: true,
      smsMessage: 'Hi! We missed your call. How can we help you?',
    }
  }
}

export async function transcribeVoicemail(recordingUrl: string): Promise<string> {
  try {
    const response = await fetch(recordingUrl)
    const audioBuffer = await response.arrayBuffer()
    const audioFile = new File([audioBuffer], 'voicemail.mp3', { type: 'audio/mpeg' })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'de',
    })

    return transcription.text
  } catch (error) {
    logger.error({ error, recordingUrl }, 'Error transcribing voicemail')
    return 'Transcription failed'
  }
}
