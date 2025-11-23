export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'


export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const callLogs: any[] = []

    return NextResponse.json(callLogs)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch call logs')
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    )
  }
}
