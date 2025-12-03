/**
 * Analytics API Route
 * 
 * Provides analytics data for the dashboard with caching support.
 * Part of Phase E performance optimization.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  getCachedAnalytics, 
  setCachedAnalytics 
} from '@/lib/analytics/cache'
import { 
  getCacheHeaders,
  createTimer 
} from '@/lib/api'

interface AnalyticsResponse {
  leadConversion: {
    totalLeads: number
    showedUp: number
    converted: number
    conversionRate: number
  }
  channelPerformance: {
    whatsapp: number
    email: number
    phone: number
    website: number
  }
  revenueMetrics: {
    mrr: number
    newMembers: number
    churnRate: number
  }
  cached?: boolean
  cachedAt?: string
}

export async function GET(request: NextRequest) {
  const timer = createTimer()
  
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's workspace
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { workspaceId: true },
    })

    const workspaceId = dbUser?.workspaceId

    // Check cache first if workspace exists
    if (workspaceId) {
      const cached = await getCachedAnalytics(workspaceId)
      if (cached) {
        timer.log('analytics-cached')
        
        return NextResponse.json({
          leadConversion: {
            totalLeads: cached.totalLeads,
            showedUp: Math.floor(cached.totalLeads * 0.65), // Estimate
            converted: Math.floor(cached.conversionRate * cached.totalLeads / 100),
            conversionRate: cached.conversionRate,
          },
          channelPerformance: {
            whatsapp: Math.floor(cached.totalMessages * 0.4),
            email: Math.floor(cached.totalMessages * 0.3),
            phone: cached.totalCalls,
            website: Math.floor(cached.totalLeads * 0.2),
          },
          revenueMetrics: {
            mrr: 0, // Would come from Stripe integration
            newMembers: cached.newLeadsThisWeek,
            churnRate: 0,
          },
          cached: true,
          cachedAt: cached.cachedAt,
        } as AnalyticsResponse, {
          headers: {
            ...getCacheHeaders({ maxAge: 60, staleWhileRevalidate: 300 }),
            'X-Cache': 'HIT',
            'X-Response-Time': `${timer.elapsed()}ms`,
          },
        })
      }
    }

    // Calculate fresh analytics
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    let totalLeads = 0
    let newLeadsThisWeek = 0
    let convertedLeads = 0
    let totalCalls = 0
    let totalMessages = 0
    let upcomingAppointments = 0

    if (workspaceId) {
      const [
        leadsCount,
        newLeadsCount,
        convertedCount,
        callsCount,
        messagesCount,
        appointmentsCount,
        messagesByChannel,
      ] = await Promise.all([
        prisma.lead.count({
          where: { workspaceId },
        }),
        prisma.lead.count({
          where: {
            workspaceId,
            createdAt: { gte: oneWeekAgo },
          },
        }),
        prisma.lead.count({
          where: {
            workspaceId,
            status: 'converted',
          },
        }),
        prisma.callLog.count({
          where: { workspaceId },
        }),
        prisma.message.count({
          where: { workspaceId },
        }),
        prisma.calendarEvent.count({
          where: {
            workspaceId,
            startTime: { gte: now },
            status: 'scheduled',
          },
        }),
        prisma.message.groupBy({
          by: ['channel'],
          where: {
            workspaceId,
            createdAt: { gte: oneMonthAgo },
          },
          _count: true,
        }),
      ])

      totalLeads = leadsCount
      newLeadsThisWeek = newLeadsCount
      convertedLeads = convertedCount
      totalCalls = callsCount
      totalMessages = messagesCount
      upcomingAppointments = appointmentsCount

      // Cache the results
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
      await setCachedAnalytics(workspaceId, {
        totalLeads,
        newLeadsThisWeek,
        conversionRate,
        avgResponseTime: 0,
        totalCalls,
        totalMessages,
        upcomingAppointments,
      }, 300) // 5 minute TTL

      // Build channel performance from grouped messages
      const channelMap = new Map<string, number>()
      for (const group of messagesByChannel) {
        channelMap.set(group.channel, group._count)
      }

      const analytics: AnalyticsResponse = {
        leadConversion: {
          totalLeads,
          showedUp: Math.floor(totalLeads * 0.65), // Estimate based on appointments
          converted: convertedLeads,
          conversionRate: Math.round(conversionRate),
        },
        channelPerformance: {
          whatsapp: channelMap.get('whatsapp') || 0,
          email: channelMap.get('email') || 0,
          phone: totalCalls,
          website: Math.floor(totalLeads * 0.2), // Estimate
        },
        revenueMetrics: {
          mrr: 0,
          newMembers: newLeadsThisWeek,
          churnRate: 0,
        },
        cached: false,
      }

      timer.log('analytics-fresh')
      logger.info({ workspaceId, latencyMs: timer.elapsed() }, 'Analytics fetched')

      return NextResponse.json(analytics, {
        headers: {
          ...getCacheHeaders({ maxAge: 60, staleWhileRevalidate: 300, private: true }),
          'X-Cache': 'MISS',
          'X-Response-Time': `${timer.elapsed()}ms`,
        },
      })
    }

    // Return empty analytics for users without workspace
    const emptyAnalytics: AnalyticsResponse = {
      leadConversion: {
        totalLeads: 0,
        showedUp: 0,
        converted: 0,
        conversionRate: 0,
      },
      channelPerformance: {
        whatsapp: 0,
        email: 0,
        phone: 0,
        website: 0,
      },
      revenueMetrics: {
        mrr: 0,
        newMembers: 0,
        churnRate: 0,
      },
    }

    return NextResponse.json(emptyAnalytics)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error({ error: errorMessage, latencyMs: timer.elapsed() }, 'Failed to fetch analytics')
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
