import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs';
import { createCheckoutSession } from '@/services/stripe/checkout'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'PRO']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  whatsappAddon: z.boolean().default(false),
  userId: z.string(),
  email: z.string().email(),
  affiliateRef: z.string().optional(),
  trialDays: z.number().min(0).max(30).default(14),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, billingCycle, whatsappAddon, userId, email, affiliateRef, trialDays } = checkoutSchema.parse(body)

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
      logger.info({ workspaceId: workspace.id, userId }, 'Workspace created for new user')
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        workspaceId: workspace.id,
        status: { in: ['active', 'trialing'] },
      },
    })

    if (existingSubscription) {
      logger.warn({ workspaceId: workspace.id }, 'Workspace already has active subscription')
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      )
    }

    let affiliateConversionId: string | undefined
    if (affiliateRef) {
      const affiliateLink = await prisma.affiliateLink.findUnique({
        where: { code: affiliateRef },
        include: { affiliate: true },
      })

      if (affiliateLink && affiliateLink.active && affiliateLink.affiliate.status === 'active') {
        const existingConversion = await prisma.affiliateConversion.findFirst({
          where: {
            affiliateLinkId: affiliateLink.id,
            status: 'pending',
            createdAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000), // Within last hour
            },
          },
        })

        if (existingConversion) {
          affiliateConversionId = existingConversion.id
          logger.info({ conversionId: existingConversion.id }, 'Reusing existing affiliate conversion')
        } else {
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
    }

    const session = await createCheckoutSession(
      workspace.id,
      plan,
      billingCycle,
      whatsappAddon,
      affiliateConversionId,
      trialDays
    )

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Failed to create checkout session')
    
    if (error.message?.includes('Price ID not configured')) {
      return NextResponse.json(
        { error: 'Plan configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
