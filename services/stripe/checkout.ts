import { getStripe, STRIPE_PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { Plan } from '@/types'

type SubscriptionAudience = 'b2b' | 'b2c'

export async function createCheckoutSession(
  workspaceId: string,
  plan: Plan,
  billingCycle: 'monthly' | 'yearly' = 'monthly',
  whatsappAddon: boolean = false,
  affiliateConversionId?: string,
  trialDays: number = 14
) {
  try {
    logger.info({ workspaceId, plan, billingCycle, whatsappAddon, trialDays }, 'Creating Stripe checkout session')

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { users: true },
    })

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const owner = workspace.users[0]
    if (!owner) {
      throw new Error('Workspace owner not found')
    }

    const planConfig = plan === 'BASIC' ? STRIPE_PLANS.BASIC : STRIPE_PLANS.PRO
    const subscriptionPriceId = billingCycle === 'yearly' ? planConfig.yearlyPriceId : planConfig.priceId

    if (!subscriptionPriceId) {
      throw new Error(`Price ID not configured for ${plan} ${billingCycle}`)
    }

    const lineItems: any[] = [
      {
        price: subscriptionPriceId,
        quantity: 1,
      },
    ]

    if (planConfig.setupFeeId) {
      lineItems.push({
        price: planConfig.setupFeeId,
        quantity: 1,
      })
    }

    if (whatsappAddon && STRIPE_PLANS.WHATSAPP_ADDON?.priceId) {
      lineItems.push({
        price: STRIPE_PLANS.WHATSAPP_ADDON.priceId,
        quantity: 1,
      })
    }

    const stripe = getStripe()
    
    const metadata: Record<string, string> = {
      audience: 'b2b',
      workspaceId,
      plan,
      billingCycle,
      whatsappAddon: whatsappAddon.toString(),
      trialDays: trialDays.toString(),
    }
    
    if (affiliateConversionId) {
      metadata.affiliateConversionId = affiliateConversionId
    }
    
    const sessionConfig: any = {
      mode: 'subscription',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: owner.email,
      client_reference_id: workspaceId,
      metadata,
      subscription_data: {
        metadata,
        trial_period_days: trialDays > 0 ? trialDays : undefined,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    logger.info({ sessionId: session.id, workspaceId, plan, trialDays }, 'Checkout session created')

    return session
  } catch (error) {
    logger.error({ error, workspaceId, plan }, 'Error creating checkout session')
    throw error
  }
}

export async function createBuddyCheckoutSession(
  userId: string,
  email: string,
  name?: string
) {
  try {
    logger.info({ userId, email }, 'Creating Gym Buddy checkout session')

    const planConfig = STRIPE_PLANS.GYM_BUDDY
    
    if (!planConfig.priceId) {
      throw new Error('GYM_BUDDY price ID not configured')
    }

    const stripe = getStripe()
    
    const metadata: Record<string, string> = {
      audience: 'b2c',
      buddyUserId: userId,
      product: 'gym_buddy',
      plan: 'GYM_BUDDY',
    }
    
    const sessionConfig: any = {
      mode: 'subscription',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/gymbuddy/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gymbuddy/start`,
      customer_email: email,
      client_reference_id: userId,
      metadata,
      subscription_data: {
        metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    logger.info({ sessionId: session.id, userId }, 'Gym Buddy checkout session created')

    return session
  } catch (error) {
    logger.error({ error, userId }, 'Error creating Gym Buddy checkout session')
    throw error
  }
}

export async function createPortalSession(workspaceId: string) {
  try {
    logger.info({ workspaceId }, 'Creating Stripe portal session')

    const subscription = await prisma.subscription.findFirst({
      where: { workspaceId },
    })

    if (!subscription) {
      throw new Error('No subscription found')
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
    })

    logger.info({ sessionId: session.id, workspaceId }, 'Portal session created')

    return session
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error creating portal session')
    throw error
  }
}

export async function createBuddyPortalSession(userId: string) {
  try {
    logger.info({ userId }, 'Creating Gym Buddy portal session')

    const subscription = await prisma.subscription.findFirst({
      where: { userId, kind: 'B2C' },
    })

    if (!subscription) {
      throw new Error('No subscription found')
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/gymbuddy/dashboard`,
    })

    logger.info({ sessionId: session.id, userId }, 'Gym Buddy portal session created')

    return session
  } catch (error) {
    logger.error({ error, userId }, 'Error creating Gym Buddy portal session')
    throw error
  }
}
