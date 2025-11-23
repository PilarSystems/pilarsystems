import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getConfig } from '@/lib/config/env'
import QRCode from 'qrcode'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const config = getConfig()
    
    if (!config.affiliatesEnabled) {
      return NextResponse.json(
        { error: 'Affiliate-Programm ist derzeit nicht verfügbar' },
        { status: 503 }
      )
    }

    const { code } = await params

    const link = await prisma.affiliateLink.findUnique({
      where: { code },
      include: { affiliate: true },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Affiliate-Link nicht gefunden' },
        { status: 404 }
      )
    }

    const url = link.url || `${config.appUrl}?ref=${code}`
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    logger.info({ affiliateLinkId: link.id, code }, 'QR code generated')

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    })
  } catch (error) {
    logger.error({ error }, 'Failed to generate QR code')
    return NextResponse.json(
      { error: 'Fehler beim Generieren des QR-Codes' },
      { status: 500 }
    )
  }
}
