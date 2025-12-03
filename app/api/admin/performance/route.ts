/**
 * Admin Performance Metrics API
 * 
 * Provides performance analytics and metrics for admin monitoring.
 * Part of Phase E performance optimization.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  getPerformanceSummary, 
  createTimer 
} from '@/lib/api/performance'
import { 
  successResponse, 
  errorResponse, 
  ErrorCodes,
  getCacheHeaders 
} from '@/lib/api/response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface DatabaseStats {
  totalQueries: number
  slowQueries: number
  avgQueryTimeMs: number
}

interface ChannelPerformance {
  whatsapp: { sent: number; delivered: number; failed: number }
  sms: { sent: number; delivered: number; failed: number }
  email: { sent: number; delivered: number; failed: number }
}

interface PerformanceResponse {
  timestamp: string
  api: {
    totalRequests: number
    averageLatencyMs: number
    p95LatencyMs: number
    slowRequests: number
    cachedRequests: number
  }
  database: DatabaseStats
  channels: ChannelPerformance
  system: {
    uptime: number
    memoryUsage: number
  }
  trends: {
    requestsChange: number
    latencyChange: number
  }
}

export async function GET(request: NextRequest) {
  const timer = createTimer()
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return errorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized')
    }

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get API performance summary
    const apiPerformance = getPerformanceSummary()

    // Get channel performance from messages
    const [
      whatsappMessages,
      smsMessages,
      emailMessages,
    ] = await Promise.all([
      prisma.message.groupBy({
        by: ['direction'],
        where: {
          channel: 'whatsapp',
          createdAt: { gte: oneDayAgo },
        },
        _count: true,
      }),
      prisma.message.groupBy({
        by: ['direction'],
        where: {
          channel: 'sms',
          createdAt: { gte: oneDayAgo },
        },
        _count: true,
      }),
      prisma.message.groupBy({
        by: ['direction'],
        where: {
          channel: 'email',
          createdAt: { gte: oneDayAgo },
        },
        _count: true,
      }),
    ])

    // Calculate channel stats
    const calculateChannelStats = (
      messages: Array<{ direction: string; _count: number }>
    ) => {
      const outbound = messages.find(m => m.direction === 'outbound')?._count || 0
      return {
        sent: outbound,
        delivered: Math.floor(outbound * 0.95), // Estimate - would track actual in production
        failed: Math.floor(outbound * 0.02),
      }
    }

    const channelPerformance: ChannelPerformance = {
      whatsapp: calculateChannelStats(whatsappMessages),
      sms: calculateChannelStats(smsMessages),
      email: calculateChannelStats(emailMessages),
    }

    // Simulated database stats (would use actual query logging in production)
    const databaseStats: DatabaseStats = {
      totalQueries: apiPerformance.totalRequests * 3, // Estimate
      slowQueries: Math.floor(apiPerformance.slowRequests * 0.5),
      avgQueryTimeMs: Math.max(5, Math.floor(apiPerformance.averageLatencyMs * 0.3)),
    }

    // System stats
    const systemStats = {
      uptime: process.uptime(),
      memoryUsage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
    }

    // Calculate trends (simplified - would compare with previous period)
    const trends = {
      requestsChange: 0, // Would calculate from historical data
      latencyChange: 0,
    }

    const response: PerformanceResponse = {
      timestamp: now.toISOString(),
      api: apiPerformance,
      database: databaseStats,
      channels: channelPerformance,
      system: systemStats,
      trends,
    }

    timer.log('performance-metrics')
    logger.info({ userId: user.id, latencyMs: timer.elapsed() }, 'Performance metrics retrieved')

    return NextResponse.json(response, {
      headers: {
        ...getCacheHeaders({ maxAge: 30, staleWhileRevalidate: 60 }),
        'X-Response-Time': `${timer.elapsed()}ms`,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error({ error: errorMessage, latencyMs: timer.elapsed() }, 'Failed to retrieve performance metrics')
    
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to retrieve performance metrics',
      { details: errorMessage }
    )
  }
}
