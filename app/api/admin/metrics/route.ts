import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'


export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const [
      totalWorkspaces,
      activeSubscriptions,
      trialingSubscriptions,
      pastDueSubscriptions,
      totalLeads,
      newLeadsToday,
      totalEvents,
      pendingEvents,
      failedEvents,
      eventsLast24h,
      totalJobs,
      pendingJobs,
      failedJobs,
      jobsLast24h,
      totalAffiliates,
      activeAffiliates,
      totalConversions,
      pendingPayouts,
    ] = await Promise.all([
      prisma.workspace.count(),
      
      prisma.subscription.count({
        where: { status: 'active' },
      }),
      
      prisma.subscription.count({
        where: { status: 'trialing' },
      }),
      
      prisma.subscription.count({
        where: { status: 'past_due' },
      }),
      
      prisma.lead.count(),
      
      prisma.lead.count({
        where: {
          createdAt: { gte: oneDayAgo },
        },
      }),
      
      prisma.autopilotEvent.count(),
      
      prisma.autopilotEvent.count({
        where: { status: 'pending' },
      }),
      
      prisma.autopilotEvent.count({
        where: { status: 'failed' },
      }),
      
      prisma.autopilotEvent.count({
        where: {
          createdAt: { gte: oneDayAgo },
        },
      }),
      
      prisma.autopilotJob.count(),
      
      prisma.autopilotJob.count({
        where: { status: 'pending' },
      }),
      
      prisma.autopilotJob.count({
        where: { status: 'failed' },
      }),
      
      prisma.autopilotJob.count({
        where: {
          createdAt: { gte: oneDayAgo },
        },
      }),
      
      prisma.affiliate.count(),
      
      prisma.affiliate.count({
        where: { status: 'active' },
      }),
      
      prisma.affiliateConversion.count({
        where: { status: 'approved' },
      }),
      
      prisma.affiliatePayout.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true },
      }),
    ])

    const recentErrors = await prisma.autopilotEvent.findMany({
      where: {
        status: 'failed',
        createdAt: { gte: oneHourAgo },
      },
      select: {
        id: true,
        type: true,
        error: true,
        createdAt: true,
        workspaceId: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const queueDepth = {
      events: pendingEvents,
      jobs: pendingJobs,
    }

    const healthStatus = {
      overall: failedEvents < 10 && failedJobs < 10 ? 'healthy' : failedEvents < 50 && failedJobs < 50 ? 'degraded' : 'unhealthy',
      events: failedEvents < 10 ? 'healthy' : failedEvents < 50 ? 'degraded' : 'unhealthy',
      jobs: failedJobs < 10 ? 'healthy' : failedJobs < 50 ? 'degraded' : 'unhealthy',
      stripe: pastDueSubscriptions < 5 ? 'healthy' : pastDueSubscriptions < 20 ? 'degraded' : 'unhealthy',
    }

    const metrics = {
      timestamp: now.toISOString(),
      workspaces: {
        total: totalWorkspaces,
      },
      subscriptions: {
        active: activeSubscriptions,
        trialing: trialingSubscriptions,
        pastDue: pastDueSubscriptions,
      },
      leads: {
        total: totalLeads,
        newToday: newLeadsToday,
      },
      events: {
        total: totalEvents,
        pending: pendingEvents,
        failed: failedEvents,
        last24h: eventsLast24h,
      },
      jobs: {
        total: totalJobs,
        pending: pendingJobs,
        failed: failedJobs,
        last24h: jobsLast24h,
      },
      affiliates: {
        total: totalAffiliates,
        active: activeAffiliates,
        conversions: totalConversions,
        pendingPayouts: pendingPayouts._sum.amount || 0,
      },
      queueDepth,
      healthStatus,
      recentErrors,
    }

    logger.info({ userId: user.id }, 'Admin metrics retrieved')

    return NextResponse.json(metrics)
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Failed to retrieve admin metrics')
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    )
  }
}
