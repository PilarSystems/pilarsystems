/**
 * Multi-Channel Analytics Service
 * Aggregates and reports on message delivery across all channels
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { 
  ChannelType, 
  MessageStatus, 
  MessageAnalytics 
} from './types'

interface ChannelMetrics {
  sent: number
  delivered: number
  read: number
  failed: number
  bounced: number
  responseRate: number
  avgDeliveryTimeMs: number
}

interface AggregatedAnalytics {
  period: string
  startDate: Date
  endDate: Date
  totalMessages: number
  byChannel: Record<ChannelType, ChannelMetrics>
  overall: ChannelMetrics & {
    topPerformingChannel: ChannelType | null
    deliverySuccessRate: number
  }
  trends: {
    sentTrend: number // percentage change from previous period
    deliveryRateTrend: number
    responseRateTrend: number
  }
}

interface DailyBreakdown {
  date: string
  whatsapp: number
  sms: number
  email: number
  total: number
}

/**
 * Multi-Channel Analytics Service
 */
export class MultiChannelAnalyticsService {
  /**
   * Get aggregated analytics for a workspace
   */
  async getAnalytics(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    period: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<AggregatedAnalytics> {
    try {
      const messages = await prisma.message.findMany({
        where: {
          workspaceId,
          direction: 'outbound',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      const inboundMessages = await prisma.message.findMany({
        where: {
          workspaceId,
          direction: 'inbound',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      // Initialize metrics by channel
      const byChannel: Record<ChannelType, ChannelMetrics> = {
        whatsapp: this.createEmptyMetrics(),
        sms: this.createEmptyMetrics(),
        email: this.createEmptyMetrics(),
      }

      const overall = this.createEmptyMetrics()
      let totalDeliveryTime = 0
      let deliveryTimeCount = 0

      // Process outbound messages
      for (const message of messages) {
        const channel = message.channel as ChannelType
        const metadata = message.metadata as Record<string, unknown> | null
        const status = (metadata?.status as MessageStatus) || 'sent'
        const deliveryTimeMs = metadata?.deliveryTimeMs as number | undefined

        if (!byChannel[channel]) continue

        byChannel[channel].sent++
        overall.sent++

        switch (status) {
          case 'delivered':
            byChannel[channel].delivered++
            overall.delivered++
            break
          case 'read':
            byChannel[channel].read++
            byChannel[channel].delivered++
            overall.read++
            overall.delivered++
            break
          case 'failed':
            byChannel[channel].failed++
            overall.failed++
            break
          case 'bounced':
            byChannel[channel].bounced++
            overall.bounced++
            break
        }

        if (deliveryTimeMs) {
          totalDeliveryTime += deliveryTimeMs
          deliveryTimeCount++
        }
      }

      // Calculate response rates per channel
      const responsesByChannel: Record<ChannelType, number> = {
        whatsapp: 0,
        sms: 0,
        email: 0,
      }

      for (const message of inboundMessages) {
        const channel = message.channel as ChannelType
        if (responsesByChannel[channel] !== undefined) {
          responsesByChannel[channel]++
        }
      }

      // Finalize metrics
      for (const channel of Object.keys(byChannel) as ChannelType[]) {
        const metrics = byChannel[channel]
        metrics.responseRate =
          metrics.sent > 0
            ? (responsesByChannel[channel] / metrics.sent) * 100
            : 0
      }

      overall.avgDeliveryTimeMs =
        deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0

      const totalResponses = Object.values(responsesByChannel).reduce(
        (a, b) => a + b,
        0
      )
      overall.responseRate =
        overall.sent > 0 ? (totalResponses / overall.sent) * 100 : 0

      // Find top performing channel
      let topChannel: ChannelType | null = null
      let topDeliveryRate = 0
      for (const channel of Object.keys(byChannel) as ChannelType[]) {
        const metrics = byChannel[channel]
        const deliveryRate =
          metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0
        if (deliveryRate > topDeliveryRate) {
          topDeliveryRate = deliveryRate
          topChannel = channel
        }
      }

      // Calculate trends (compared to previous period)
      const trends = await this.calculateTrends(
        workspaceId,
        startDate,
        endDate,
        overall
      )

      return {
        period,
        startDate,
        endDate,
        totalMessages: messages.length,
        byChannel,
        overall: {
          ...overall,
          topPerformingChannel: topChannel,
          deliverySuccessRate:
            overall.sent > 0
              ? (overall.delivered / overall.sent) * 100
              : 0,
        },
        trends,
      }
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to get analytics')
      throw error
    }
  }

  /**
   * Get daily breakdown of messages
   */
  async getDailyBreakdown(
    workspaceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyBreakdown[]> {
    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
        direction: 'outbound',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        channel: true,
        createdAt: true,
      },
    })

    const dailyMap = new Map<string, DailyBreakdown>()

    for (const message of messages) {
      const dateKey = message.createdAt.toISOString().split('T')[0]
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          whatsapp: 0,
          sms: 0,
          email: 0,
          total: 0,
        })
      }

      const day = dailyMap.get(dateKey)!
      const channel = message.channel as ChannelType
      
      if (channel === 'whatsapp') day.whatsapp++
      else if (channel === 'sms') day.sms++
      else if (channel === 'email') day.email++
      
      day.total++
    }

    return Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )
  }

  /**
   * Get real-time message statistics
   */
  async getRealTimeStats(workspaceId: string): Promise<{
    last24h: { sent: number; delivered: number; pending: number }
    lastHour: { sent: number; delivered: number; pending: number }
    activeSequences: number
  }> {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const [messagesLast24h, messagesLastHour, activeSequences] = await Promise.all([
      prisma.message.findMany({
        where: {
          workspaceId,
          direction: 'outbound',
          createdAt: { gte: oneDayAgo },
        },
      }),
      prisma.message.findMany({
        where: {
          workspaceId,
          direction: 'outbound',
          createdAt: { gte: oneHourAgo },
        },
      }),
      prisma.conversationState.count({
        where: {
          workspaceId,
          state: 'active',
        },
      }),
    ])

    const calculateStats = (messages: typeof messagesLast24h) => {
      let sent = 0
      let delivered = 0
      let pending = 0

      for (const message of messages) {
        const metadata = message.metadata as Record<string, unknown> | null
        const status = (metadata?.status as MessageStatus) || 'sent'

        sent++
        if (status === 'delivered' || status === 'read') {
          delivered++
        } else if (status === 'pending' || status === 'queued') {
          pending++
        }
      }

      return { sent, delivered, pending }
    }

    return {
      last24h: calculateStats(messagesLast24h),
      lastHour: calculateStats(messagesLastHour),
      activeSequences,
    }
  }

  /**
   * Get channel-specific performance metrics
   */
  async getChannelPerformance(
    workspaceId: string,
    channel: ChannelType,
    startDate: Date,
    endDate: Date
  ): Promise<MessageAnalytics> {
    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
        channel,
        direction: 'outbound',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const inboundCount = await prisma.message.count({
      where: {
        workspaceId,
        channel,
        direction: 'inbound',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const metrics = this.createEmptyMetrics()
    let totalDeliveryTime = 0
    let deliveryTimeCount = 0

    for (const message of messages) {
      const metadata = message.metadata as Record<string, unknown> | null
      const status = (metadata?.status as MessageStatus) || 'sent'
      const deliveryTimeMs = metadata?.deliveryTimeMs as number | undefined

      metrics.sent++

      switch (status) {
        case 'delivered':
          metrics.delivered++
          break
        case 'read':
          metrics.read++
          metrics.delivered++
          break
        case 'failed':
          metrics.failed++
          break
        case 'bounced':
          metrics.bounced++
          break
      }

      if (deliveryTimeMs) {
        totalDeliveryTime += deliveryTimeMs
        deliveryTimeCount++
      }
    }

    metrics.responseRate =
      metrics.sent > 0 ? (inboundCount / metrics.sent) * 100 : 0
    metrics.avgDeliveryTimeMs =
      deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0

    return {
      workspaceId,
      channel,
      period: 'day',
      startDate,
      endDate,
      metrics,
    }
  }

  /**
   * Get lead engagement score based on multi-channel interactions
   */
  async getLeadEngagementScore(
    workspaceId: string,
    leadId: string
  ): Promise<{
    score: number
    breakdown: {
      responseRate: number
      avgResponseTimeHours: number
      channelsEngaged: ChannelType[]
      lastInteraction: Date | null
    }
  }> {
    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
        leadId,
      },
      orderBy: { createdAt: 'desc' },
    })

    const outbound = messages.filter((m) => m.direction === 'outbound')
    const inbound = messages.filter((m) => m.direction === 'inbound')

    const channelsEngaged = [...new Set(messages.map((m) => m.channel as ChannelType))]
    const lastInteraction = messages[0]?.createdAt || null

    // Calculate response rate
    const responseRate =
      outbound.length > 0 ? (inbound.length / outbound.length) * 100 : 0

    // Calculate average response time (simplified)
    let totalResponseTime = 0
    let responseCount = 0

    for (const inboundMsg of inbound) {
      // Find the most recent outbound message before this inbound
      const precedingOutbound = outbound.find(
        (o) => o.createdAt < inboundMsg.createdAt
      )
      if (precedingOutbound) {
        const responseTime =
          inboundMsg.createdAt.getTime() - precedingOutbound.createdAt.getTime()
        totalResponseTime += responseTime
        responseCount++
      }
    }

    const avgResponseTimeMs =
      responseCount > 0 ? totalResponseTime / responseCount : 0
    const avgResponseTimeHours = avgResponseTimeMs / (1000 * 60 * 60)

    // Calculate engagement score (0-100)
    let score = 0
    score += Math.min(responseRate, 50) // Up to 50 points for response rate
    score += Math.min(channelsEngaged.length * 10, 20) // Up to 20 points for channel diversity
    score +=
      avgResponseTimeHours > 0
        ? Math.max(0, 30 - avgResponseTimeHours * 2)
        : 0 // Up to 30 points for quick responses

    return {
      score: Math.round(Math.min(score, 100)),
      breakdown: {
        responseRate,
        avgResponseTimeHours,
        channelsEngaged,
        lastInteraction,
      },
    }
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(): ChannelMetrics {
    return {
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
      bounced: 0,
      responseRate: 0,
      avgDeliveryTimeMs: 0,
    }
  }

  /**
   * Calculate trends compared to previous period
   */
  private async calculateTrends(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    currentMetrics: ChannelMetrics
  ): Promise<{
    sentTrend: number
    deliveryRateTrend: number
    responseRateTrend: number
  }> {
    const periodMs = endDate.getTime() - startDate.getTime()
    const previousStart = new Date(startDate.getTime() - periodMs)
    const previousEnd = new Date(endDate.getTime() - periodMs)

    const previousMessages = await prisma.message.findMany({
      where: {
        workspaceId,
        direction: 'outbound',
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    })

    const previousInbound = await prisma.message.count({
      where: {
        workspaceId,
        direction: 'inbound',
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    })

    let previousSent = 0
    let previousDelivered = 0

    for (const message of previousMessages) {
      const metadata = message.metadata as Record<string, unknown> | null
      const status = (metadata?.status as MessageStatus) || 'sent'

      previousSent++
      if (status === 'delivered' || status === 'read') {
        previousDelivered++
      }
    }

    const previousDeliveryRate =
      previousSent > 0 ? (previousDelivered / previousSent) * 100 : 0
    const currentDeliveryRate =
      currentMetrics.sent > 0
        ? (currentMetrics.delivered / currentMetrics.sent) * 100
        : 0

    const previousResponseRate =
      previousSent > 0 ? (previousInbound / previousSent) * 100 : 0

    return {
      sentTrend:
        previousSent > 0
          ? ((currentMetrics.sent - previousSent) / previousSent) * 100
          : 0,
      deliveryRateTrend: currentDeliveryRate - previousDeliveryRate,
      responseRateTrend: currentMetrics.responseRate - previousResponseRate,
    }
  }
}

export const multiChannelAnalytics = new MultiChannelAnalyticsService()
