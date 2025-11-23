import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const userId = searchParams.get('userId')

    if (!workspaceId && !userId) {
      return NextResponse.json(
        { error: 'Either workspaceId or userId is required' },
        { status: 400 }
      )
    }

    if (workspaceId && userId) {
      logger.warn({ workspaceId, userId }, 'Both workspaceId and userId provided, using workspaceId')
    }

    const subscription = await prisma.subscription.findFirst({
      where: workspaceId 
        ? { workspaceId, kind: 'B2B' }
        : { userId, kind: 'B2C' },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      audience: subscription.kind === 'B2B' ? 'b2b' : 'b2c',
      status: subscription.status,
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      whatsappAddon: subscription.whatsappAddon,
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to get subscription status')
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}
