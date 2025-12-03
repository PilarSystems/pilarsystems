/**
 * Email Webhook Handler (STUB)
 */

import { orchestrate } from '../orchestrator/orchestrator.service'
import { Channel } from '../orchestrator/orchestrator.types'

export interface EmailWebhookPayload {
  from: string
  to: string
  subject: string
  body: string
  html?: string
  timestamp: string
  messageId?: string
  inReplyTo?: string
}

async function extractTenantId(payload: EmailWebhookPayload, queryParams?: Record<string, string>): Promise<string | undefined> {
  if (queryParams?.tenantId) {
    return queryParams.tenantId
  }
  return undefined
}

export async function processEmailWebhook(
  payload: EmailWebhookPayload,
  queryParams?: Record<string, string>
): Promise<{ success: boolean; message?: string; response?: string; error?: string }> {
  try {
    const tenantId = await extractTenantId(payload, queryParams)

    console.log(`[EMAIL STUB] Email received from ${payload.from}: ${payload.subject}`)

    const result = await orchestrate({
      channel: Channel.EMAIL,
      payload: {
        from: payload.from,
        sender: payload.from,
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        html: payload.html,
        messageId: payload.messageId,
        inReplyTo: payload.inReplyTo,
      },
      timestamp: new Date(payload.timestamp),
      tenantId,
    })

    return {
      success: true,
      message: 'Email processed',
      response: result.response.content,
    }
  } catch (error) {
    console.error('Error processing email webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendEmailResponse(
  to: string,
  subject: string,
  _body: string,
  _inReplyTo?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[STUB] Sending email to ${to}: ${subject}`)

  return {
    success: true,
    messageId: `email_${Date.now()}`,
  }
}
