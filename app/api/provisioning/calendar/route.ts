export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { calendarOAuthService } from '@/services/calendar/oauth'
import { isFeatureEnabled, disabledFeatureResponse } from '@/lib/features'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('google_calendar')) {
      logger.warn('Calendar provisioning requested but feature is disabled')
      return NextResponse.json(disabledFeatureResponse('google_calendar'), { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const action = searchParams.get('action')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    if (action === 'auth_url') {
      const authUrl = calendarOAuthService.getAuthUrl(workspaceId)
      return NextResponse.json({ authUrl })
    }

    if (action === 'status') {
      const status = await calendarOAuthService.getStatus(workspaceId)
      return NextResponse.json(status)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    logger.error({ error }, 'Calendar API error')
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
