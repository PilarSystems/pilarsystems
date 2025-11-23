import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { generateAffiliateCode } from '@/lib/affiliate'
import { getConfig } from '@/lib/config/env'
import { z } from 'zod'

export const dynamic = 'force-dynamic'


export const runtime = 'nodejs'

const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  company: z.string().optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const config = getConfig()
    
    if (!config.affiliatesEnabled) {
      return NextResponse.json(
        { success: false, error: 'Affiliate-Programm ist derzeit nicht verfügbar' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.affiliate.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Diese E-Mail-Adresse ist bereits registriert' },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliate.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        status: config.affiliateAutoApprove ? 'active' : 'pending',
        commissionSetup: config.affiliateCommissionSetup,
        commissionRecurring: config.affiliateCommissionRecurring,
      },
    })

    const code = generateAffiliateCode(data.name)
    const link = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate.id,
        code,
        name: 'Standard Link',
        url: `${config.appUrl}?ref=${code}`,
        active: true,
      },
    })

    logger.info(
      { affiliateId: affiliate.id, email: data.email, code },
      'Affiliate registered'
    )

    return NextResponse.json({
      success: true,
      message: config.affiliateAutoApprove
        ? 'Registrierung erfolgreich! Du kannst sofort loslegen.'
        : 'Registrierung erfolgreich! Wir prüfen deine Anfrage und melden uns bald.',
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        status: affiliate.status,
      },
      link: {
        code: link.code,
        url: link.url,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validierungsfehler',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    logger.error({ error }, 'Failed to register affiliate')
    return NextResponse.json(
      {
        success: false,
        error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      },
      { status: 500 }
    )
  }
}
