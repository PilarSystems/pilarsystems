/**
 * Multi-Channel Status API
 * Get channel availability and configuration status
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { multiChannelOrchestrator } from '@/services/multichannel'
import { smsService } from '@/services/multichannel/sms.service'
import { emailOutreachService } from '@/services/multichannel/email.service'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    logger.info({ workspaceId }, 'Channel status request received')

    // Get channel availability
    const channels = await multiChannelOrchestrator.getAvailableChannels(workspaceId)

    // Get additional status info
    const [smsEnabled, emailEnabled] = await Promise.all([
      smsService.isEnabled(workspaceId),
      emailOutreachService.isEnabled(workspaceId),
    ])

    // Get templates for each channel
    const [smsTemplates, emailTemplates] = await Promise.all([
      smsService.getTemplates(workspaceId),
      emailOutreachService.getTemplates(workspaceId),
    ])

    return NextResponse.json({
      workspaceId,
      channels: {
        whatsapp: {
          enabled: channels.whatsapp,
          status: channels.whatsapp ? 'active' : 'not_configured',
        },
        sms: {
          enabled: smsEnabled,
          status: smsEnabled ? 'active' : 'not_configured',
          templateCount: smsTemplates.length,
        },
        email: {
          enabled: emailEnabled,
          status: emailEnabled ? 'active' : 'not_configured',
          templateCount: emailTemplates.length,
        },
      },
      features: {
        sequencesEnabled: true,
        analyticsEnabled: true,
        templatesEnabled: true,
      },
    })
  } catch (error) {
    logger.error({ error }, 'Channel status request failed')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Status check failed' },
      { status: 500 }
    )
  }
}
