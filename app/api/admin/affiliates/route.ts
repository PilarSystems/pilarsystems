import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const affiliates = await prisma.affiliate.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    const affiliatesWithStats = affiliates.map(affiliate => {
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

      return {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        company: affiliate.company,
        phone: affiliate.phone,
        status: affiliate.status,
        commissionSetup: affiliate.commissionSetup,
        commissionRecurring: affiliate.commissionRecurring,
        createdAt: affiliate.createdAt,
        stats: {
          totalClicks,
          totalConversions,
          totalCommission: Math.round(totalCommission * 100) / 100,
          paidOut: Math.round(paidOut * 100) / 100,
          pending: Math.round(pending * 100) / 100,
        },
      }
    })

    const overallStats = {
      totalAffiliates: affiliates.length,
      activeAffiliates: affiliates.filter(a => a.status === 'active').length,
      pendingAffiliates: affiliates.filter(a => a.status === 'pending').length,
      totalClicks: affiliatesWithStats.reduce((sum, a) => sum + a.stats.totalClicks, 0),
      totalConversions: affiliatesWithStats.reduce((sum, a) => sum + a.stats.totalConversions, 0),
      totalCommission: affiliatesWithStats.reduce((sum, a) => sum + a.stats.totalCommission, 0),
      totalPaidOut: affiliatesWithStats.reduce((sum, a) => sum + a.stats.paidOut, 0),
      totalPending: affiliatesWithStats.reduce((sum, a) => sum + a.stats.pending, 0),
    }

    return NextResponse.json({
      success: true,
      affiliates: affiliatesWithStats,
      stats: overallStats,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get admin affiliates')
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { affiliateId, status } = body

    if (!affiliateId || !status) {
      return NextResponse.json(
        { error: 'affiliateId and status are required' },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliate.update({
      where: { id: affiliateId },
      data: { status },
    })

    logger.info({ affiliateId, status }, 'Affiliate status updated')

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        status: affiliate.status,
      },
    })
  } catch (error) {
    logger.error({ error }, 'Failed to update affiliate status')
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
