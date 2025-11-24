export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { calendarOAuthService } from '@/services/calendar/oauth'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const action = searchParams.get('action')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    if (action === 'auth_url') {
      try {
        const authUrl = calendarOAuthService.getAuthUrl(workspaceId)
        return NextResponse.json({ authUrl })
      } catch (error) {
        logger.error({ error, workspaceId }, 'Failed to generate auth URL')
        if (error instanceof Error && error.message.includes('Google OAuth credentials not configured')) {
          return NextResponse.json({ 
            error: 'Google Calendar integration not configured', 
            details: 'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables' 
          }, { status: 503 })
        }
        throw error
      }
    }

    if (action === 'status') {
      try {
        const status = await calendarOAuthService.getStatus(workspaceId)
        return NextResponse.json(status)
      } catch (error) {
        logger.error({ error, workspaceId }, 'Failed to get calendar status')
        return NextResponse.json({ 
          error: 'Failed to get calendar status',
          connected: false 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    logger.error({ error }, 'Calendar API error')
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
