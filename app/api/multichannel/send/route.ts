/**
 * Multi-Channel Send API
 * Send messages via WhatsApp, SMS, or Email
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { multiChannelOrchestrator } from '@/services/multichannel'
import { ChannelType } from '@/services/multichannel/types'
import { logger } from '@/lib/logger'

interface SendMessageRequest {
  workspaceId: string
  leadId?: string
  channel: ChannelType
  to: string
  content: string
  subject?: string
  html?: string
  templateId?: string
  templateVariables?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json()

    // Validate required fields
    if (!body.workspaceId || !body.channel || !body.to || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: workspaceId, channel, to, content' },
        { status: 400 }
      )
    }

    // Validate channel
    const validChannels: ChannelType[] = ['whatsapp', 'sms', 'email']
    if (!validChannels.includes(body.channel)) {
      return NextResponse.json(
        { error: `Invalid channel. Must be one of: ${validChannels.join(', ')}` },
        { status: 400 }
      )
    }

    logger.info(
      { workspaceId: body.workspaceId, channel: body.channel, to: body.to },
      'Multi-channel send request received'
    )

    const result = await multiChannelOrchestrator.sendMessage({
      workspaceId: body.workspaceId,
      leadId: body.leadId,
      channel: body.channel,
      to: body.to,
      content: body.content,
      subject: body.subject,
      html: body.html,
      templateId: body.templateId,
      templateVariables: body.templateVariables,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        externalId: result.externalId,
        channel: result.channel,
        status: result.status,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          channel: result.channel,
          status: result.status,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    logger.error({ error }, 'Multi-channel send failed')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Send failed' },
      { status: 500 }
    )
  }
}
