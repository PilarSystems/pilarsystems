export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/services/stripe/checkout'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'PRO']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  whatsappAddon: z.boolean(),
  userId: z.string(),
  email: z.string().email(),
  affiliateRef: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, billingCycle, whatsappAddon, userId, email, affiliateRef } = checkoutSchema.parse(body)

    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: userId },
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'My Studio',
          ownerId: userId,
        },
      })
    }

    let affiliateConversionId: string | undefined
    if (affiliateRef) {
      const affiliateLink = await prisma.affiliateLink.findUnique({
        where: { code: affiliateRef },
        include: { affiliate: true },
      })

      if (affiliateLink && affiliateLink.active && affiliateLink.affiliate.status === 'active') {
        const conversion = await prisma.affiliateConversion.create({
          data: {
            affiliateId: affiliateLink.affiliateId,
            affiliateLinkId: affiliateLink.id,
            status: 'pending',
          },
        })
        affiliateConversionId = conversion.id
        logger.info({ conversionId: conversion.id, affiliateRef }, 'Affiliate conversion pending')
      }
    }

    const session = await createCheckoutSession(workspace.id, plan, billingCycle, whatsappAddon, affiliateConversionId)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    logger.error({ error }, 'Failed to create checkout session')
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
