/**
 * My Affiliate Stats API Route
 * 
 * Get affiliate stats for the current authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getConfig } from '@/lib/config/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const config = getConfig()
    
    if (!config.affiliatesEnabled) {
      return NextResponse.json(
        { error: 'Affiliate-Programm ist derzeit nicht verfügbar' },
        { status: 503 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    // Get the user from the session
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Find affiliate by user email
    const affiliate = await prisma.affiliate.findUnique({
      where: { email: user.email! },
      include: {
        links: {
          where: { active: true },
          include: {
            _count: {
              select: {
                clicks: true,
                conversions: true,
              },
            },
            clicks: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
        conversions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        payouts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!affiliate) {
      return NextResponse.json({ authenticated: true, isAffiliate: false })
    }

    const totalClicks = affiliate.links.reduce(
      (sum, link) => sum + link._count.clicks,
      0
    )

    const approvedConversions = affiliate.conversions.filter(c => c.status === 'approved')
    const totalConversions = approvedConversions.length

    const totalCommission = approvedConversions.reduce(
      (sum, conv) => sum + (conv.totalCommission || 0),
      0
    )

    const paidOut = affiliate.payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const pending = totalCommission - paidOut

    // Get the primary link
    const primaryLink = affiliate.links[0]
    
    // Generate referral link and QR code URL
    const referralLink = primaryLink ? `${config.appUrl}/r/${primaryLink.code}` : null
    const qrCodeUrl = primaryLink ? `/api/affiliate/qr/${primaryLink.code}` : null

    // Build recent activity from clicks and conversions
    const recentActivity = [
      ...affiliate.links.flatMap(link => 
        link.clicks.map(click => ({
          id: click.id,
          type: 'click' as const,
          date: click.createdAt.toISOString(),
          details: `Klick über ${link.name}`,
        }))
      ),
      ...affiliate.conversions.map(conv => ({
        id: conv.id,
        type: conv.status === 'approved' ? 'customer' as const : 'lead' as const,
        date: conv.createdAt.toISOString(),
        details: conv.status === 'approved' 
          ? `Neuer Kunde - ${conv.totalCommission?.toFixed(2)}€ Provision`
          : 'Lead in Bearbeitung',
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return NextResponse.json({
      authenticated: true,
      isAffiliate: true,
      code: primaryLink?.code || '',
      referralLink: referralLink || '',
      qrCodeUrl: qrCodeUrl || '',
      stats: {
        clicks: totalClicks,
        leads: affiliate.conversions.filter(c => c.status === 'pending').length,
        customers: totalConversions,
        totalCommission: Math.round(totalCommission * 100) / 100,
        pendingCommission: Math.round(pending * 100) / 100,
        paidCommission: Math.round(paidOut * 100) / 100,
      },
      recentActivity,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get affiliate stats')
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
