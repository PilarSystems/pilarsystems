import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { hashIP } from '@/lib/affiliate'
import { getConfig } from '@/lib/config/env'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trackSchema = z.object({
  code: z.string(),
  referer: z.string().optional(),
  landingPage: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const config = getConfig()
    
    if (!config.affiliatesEnabled) {
      return NextResponse.json({ success: false }, { status: 503 })
    }

    const body = await request.json()
    const data = trackSchema.parse(body)

    const link = await prisma.affiliateLink.findUnique({
      where: { code: data.code },
      include: { affiliate: true },
    })

    if (!link || !link.active || link.affiliate.status !== 'active') {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0'
    const userAgent = request.headers.get('user-agent') || ''

    const ipHash = hashIP(ip, userAgent)

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentClick = await prisma.affiliateClick.findFirst({
      where: {
        affiliateLinkId: link.id,
        ipHash,
        createdAt: { gte: oneHourAgo },
      },
    })

    if (recentClick) {
      return NextResponse.json({ success: true, duplicate: true })
    }

    await prisma.affiliateClick.create({
      data: {
        affiliateLinkId: link.id,
        ipHash,
        userAgent,
        referer: data.referer,
        landingPage: data.landingPage,
      },
    })

    logger.info(
      { affiliateLinkId: link.id, code: data.code },
      'Affiliate click tracked'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to track affiliate click')
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
