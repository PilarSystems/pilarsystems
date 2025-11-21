export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getAllIntegrationStatuses } from '@/lib/integrations'

/**
 * GET /api/provisioning/status?workspaceId=xxx
 * Get integration status for a workspace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        twilioSubaccount: true,
        whatsappIntegration: true,
        emailCredential: true,
        oauthTokens: {
          where: {
            provider: 'google_calendar',
          },
        },
      },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const integrationStatuses = getAllIntegrationStatuses()

    const calendarToken = workspace.oauthTokens.find(t => t.provider === 'google_calendar')

    const status = {
      phone: workspace.twilioSubaccount?.phoneNumber 
        ? 'ready' 
        : integrationStatuses.twilio.available 
          ? 'not_configured' 
          : 'not_configured',
      whatsapp: workspace.whatsappIntegration?.phoneNumberId 
        ? 'ready' 
        : integrationStatuses.whatsapp.available 
          ? 'not_configured' 
          : 'not_configured',
      email: workspace.emailCredential?.smtpHost 
        ? 'ready' 
        : integrationStatuses.email.available 
          ? 'not_configured' 
          : 'not_configured',
      calendar: calendarToken?.accessToken 
        ? 'ready' 
        : integrationStatuses.googleCalendar.available 
          ? 'not_configured' 
          : 'not_configured',
      ai: process.env.OPENAI_API_KEY ? 'ready' : 'not_configured',
      webhooks: 'ready',
    }

    return NextResponse.json(status)
  } catch (error) {
    logger.error({ error }, 'Failed to get provisioning status')
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
