import { stripe, STRIPE_PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { Plan } from '@/types'

export async function createCheckoutSession(
  workspaceId: string,
  plan: Plan,
  whatsappAddon: boolean = false
) {
  try {
    logger.info({ workspaceId, plan, whatsappAddon }, 'Creating Stripe checkout session')

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

    const lineItems: any[] = [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
      {
        price: planConfig.setupFeeId,
        quantity: 1,
      },
    ]

    if (whatsappAddon) {
      lineItems.push({
        price: STRIPE_PLANS.WHATSAPP_ADDON.priceId,
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: owner.email,
      client_reference_id: workspaceId,
      metadata: {
        workspaceId,
        plan,
        whatsappAddon: whatsappAddon.toString(),
      },
      subscription_data: {
        metadata: {
          workspaceId,
          plan,
          whatsappAddon: whatsappAddon.toString(),
        },
      },
    })

    logger.info({ sessionId: session.id, workspaceId }, 'Checkout session created')

    return session
  } catch (error) {
    logger.error({ error, workspaceId, plan }, 'Error creating checkout session')
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
