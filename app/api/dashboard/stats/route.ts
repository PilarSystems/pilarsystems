export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const stats = {
      totalLeads: 0,
      newLeadsToday: 0,
      activeConversations: 0,
      conversionRate: 0,
      missedCalls: 0,
      scheduledEvents: 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch dashboard stats')
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
