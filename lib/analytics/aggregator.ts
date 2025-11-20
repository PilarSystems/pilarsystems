import { prisma } from '@/lib/prisma'
import { setCachedAnalytics, invalidateAnalyticsCache } from './cache'

export async function aggregateWorkspaceAnalytics(workspaceId: string): Promise<void> {
  try {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalLeads,
      newLeadsThisWeek,
      convertedLeads,
      totalCalls,
      totalMessages,
      upcomingAppointments
    ] = await Promise.all([
      prisma.lead.count({
        where: { workspaceId }
      }),
      prisma.lead.count({
        where: {
          workspaceId,
          createdAt: { gte: oneWeekAgo }
        }
      }),
      prisma.lead.count({
        where: {
          workspaceId,
          status: 'converted'
        }
      }),
      prisma.callLog.count({
        where: { workspaceId }
      }),
      prisma.message.count({
        where: { workspaceId }
      }),
      prisma.calendarEvent.count({
        where: {
          workspaceId,
          startTime: { gte: now },
          status: 'scheduled'
        }
      })
    ])

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    const avgResponseTime = 0

    await setCachedAnalytics(workspaceId, {
      totalLeads,
      newLeadsThisWeek,
      conversionRate,
      avgResponseTime,
      totalCalls,
      totalMessages,
      upcomingAppointments
    }, 300)

  } catch (error) {
    console.error('Failed to aggregate analytics:', error)
    throw error
  }
}

export async function invalidateWorkspaceAnalytics(workspaceId: string): Promise<void> {
  await invalidateAnalyticsCache(workspaceId)
}
