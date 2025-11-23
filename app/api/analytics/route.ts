export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const analytics = {
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

    return NextResponse.json(analytics)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch analytics')
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
