export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { handleStripeWebhook } from '@/services/stripe/webhooks'
import { logger } from '@/lib/logger'
import { processWebhookWithIdempotency } from '@/lib/queue/webhook-processor'
import { resolveTenantFromWebhook } from '@/lib/tenant/with-tenant'
import { enqueueWebhook } from '@/lib/queue/webhook-queue'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      logger.warn('Stripe webhook received but STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    logger.info({ eventType: event.type, eventId: event.id }, 'Received Stripe webhook')

    const customerId = (event.data.object as any).customer || (event.data.object as any).id
    const workspaceId = customerId ? await resolveTenantFromWebhook('stripe', customerId) : null

    if (workspaceId) {
      await enqueueWebhook(workspaceId, 'stripe', event)
    }

    await processWebhookWithIdempotency(
      'stripe',
      event.id,
      workspaceId,
      event,
      async () => {
        await handleStripeWebhook(event)
      }
    )

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error({ error }, 'Stripe webhook error')
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
