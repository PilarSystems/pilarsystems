import { getStripe, STRIPE_PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { Plan } from '@/types'

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
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
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: 'Your 14-day free trial starts now. You won\'t be charged until the trial ends.',
        },
        terms_of_service_acceptance: {
          message: `By continuing, you agree to our [Terms of Service](${process.env.NEXT_PUBLIC_APP_URL}/agb) and [Privacy Policy](${process.env.NEXT_PUBLIC_APP_URL}/datenschutz).`,
        },
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
