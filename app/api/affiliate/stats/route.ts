import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getConfig } from '@/lib/config/env'

export const dynamic = 'force-dynamic'


export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const config = getConfig()
    
    if (!config.affiliatesEnabled) {
      return NextResponse.json(
        { error: 'Affiliate-Programm ist derzeit nicht verfügbar' },
        { status: 503 }
      )
    }

    const email = request.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse erforderlich' },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { email },
      include: {
        links: {
          include: {
            _count: {
              select: {
                clicks: true,
                conversions: true,
              },
            },
          },
        },
        conversions: {
          where: {
            status: 'approved',
          },
        },
        payouts: true,
      },
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate nicht gefunden' },
        { status: 404 }
      )
    }

    const totalClicks = affiliate.links.reduce(
      (sum, link) => sum + link._count.clicks,
      0
    )

    const totalConversions = affiliate.conversions.length

    const totalCommission = affiliate.conversions.reduce(
      (sum, conv) => sum + (conv.totalCommission || 0),
      0
    )

    const paidOut = affiliate.payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const pending = totalCommission - paidOut

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        status: affiliate.status,
        commissionSetup: affiliate.commissionSetup,
        commissionRecurring: affiliate.commissionRecurring,
      },
      stats: {
        totalClicks,
        totalConversions,
        totalCommission: Math.round(totalCommission * 100) / 100,
        paidOut: Math.round(paidOut * 100) / 100,
        pending: Math.round(pending * 100) / 100,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      },
      links: affiliate.links.map(link => ({
        id: link.id,
        code: link.code,
        name: link.name,
        url: link.url,
        active: link.active,
        clicks: link._count.clicks,
        conversions: link._count.conversions,
      })),
      recentConversions: affiliate.conversions.slice(0, 10).map(conv => ({
        id: conv.id,
        status: conv.status,
        setupFeeAmount: conv.setupFeeAmount,
        recurringAmount: conv.recurringAmount,
        totalCommission: conv.totalCommission,
        paidOut: conv.paidOut,
        createdAt: conv.createdAt,
      })),
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get affiliate stats')
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
