/**
 * Multi-Channel Analytics API
 * Get analytics for message delivery across all channels
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { multiChannelAnalytics } from '@/services/multichannel'
import { ChannelType } from '@/services/multichannel/types'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get('workspaceId')
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const period = searchParams.get('period') as 'hour' | 'day' | 'week' | 'month' | null
    const channel = searchParams.get('channel') as ChannelType | null
    const type = searchParams.get('type') // 'overview', 'daily', 'realtime', 'channel'

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    // Default date range: last 30 days
    const endDate = endDateStr ? new Date(endDateStr) : new Date()
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    logger.info(
      { workspaceId, type, startDate, endDate },
      'Analytics request received'
    )

    switch (type) {
      case 'realtime': {
        const stats = await multiChannelAnalytics.getRealTimeStats(workspaceId)
        return NextResponse.json(stats)
      }

      case 'daily': {
        const breakdown = await multiChannelAnalytics.getDailyBreakdown(
          workspaceId,
          startDate,
          endDate
        )
        return NextResponse.json({ breakdown })
      }

      case 'channel': {
        if (!channel) {
          return NextResponse.json(
            { error: 'channel parameter is required for channel-specific analytics' },
            { status: 400 }
          )
        }
        const channelAnalytics = await multiChannelAnalytics.getChannelPerformance(
          workspaceId,
          channel,
          startDate,
          endDate
        )
        return NextResponse.json(channelAnalytics)
      }

      case 'overview':
      default: {
        const analytics = await multiChannelAnalytics.getAnalytics(
          workspaceId,
          startDate,
          endDate,
          period || 'day'
        )
        return NextResponse.json(analytics)
      }
    }
  } catch (error) {
    logger.error({ error }, 'Analytics request failed')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analytics failed' },
      { status: 500 }
    )
  }
}
