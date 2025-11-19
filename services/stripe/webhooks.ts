import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'

export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<{ received: boolean }> {
  try {
    logger.info({ type: event.type, id: event.id }, 'Processing Stripe webhook')

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        logger.info({ type: event.type }, 'Unhandled webhook event type')
    }

    return { received: true }
  } catch (error) {
    logger.error({ error, eventType: event.type }, 'Error handling webhook')
    throw error
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    logger.info({ sessionId: session.id }, 'Handling checkout session completed')

    const workspaceId = session.metadata?.workspaceId
    const plan = session.metadata?.plan as 'BASIC' | 'PRO'
    const whatsappAddon = session.metadata?.whatsappAddon === 'true'

    if (!workspaceId || !plan) {
      throw new Error('Missing metadata in checkout session')
    }

    const stripe = getStripe()
    const stripeSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await prisma.subscription.create({
      data: {
        workspaceId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: stripeSubscription.id,
        plan,
        status: 'active',
        whatsappAddon,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      },
    })

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        subscriptionId: stripeSubscription.id,
      },
    })

    for (let step = 1; step <= 7; step++) {
      await prisma.wizardProgress.create({
        data: {
          workspaceId,
          step,
          completed: false,
        },
      })
    }

    logger.info({ workspaceId, plan }, 'Subscription created successfully')

    const affiliateConversionId = session.metadata?.affiliateConversionId
    if (affiliateConversionId) {
      try {
        const conversion = await prisma.affiliateConversion.findUnique({
          where: { id: affiliateConversionId },
          include: { affiliate: true },
        })

        if (conversion && conversion.status === 'pending') {
          const setupFeeAmount = session.amount_total ? session.amount_total / 100 : 0
          const recurringAmount = stripeSubscription.items.data[0]?.price.unit_amount 
            ? stripeSubscription.items.data[0].price.unit_amount / 100 
            : 0

          const commissionSetup = (setupFeeAmount * conversion.affiliate.commissionSetup) / 100
          const commissionRecurring = (recurringAmount * conversion.affiliate.commissionRecurring) / 100
          const totalCommission = commissionSetup + commissionRecurring

          await prisma.affiliateConversion.update({
            where: { id: affiliateConversionId },
            data: {
              status: 'approved',
              stripeCheckoutSessionId: session.id,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              setupFeeAmount,
              recurringAmount,
              commissionSetup: Math.round(commissionSetup * 100) / 100,
              commissionRecurring: Math.round(commissionRecurring * 100) / 100,
              totalCommission: Math.round(totalCommission * 100) / 100,
            },
          })

          logger.info(
            { 
              conversionId: affiliateConversionId, 
              affiliateId: conversion.affiliateId,
              totalCommission 
            }, 
            'Affiliate conversion approved'
          )
        }
      } catch (error) {
        logger.error({ error, affiliateConversionId }, 'Failed to process affiliate conversion')
      }
    }
  } catch (error) {
    logger.error({ error, sessionId: session.id }, 'Error handling checkout session')
    throw error
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    logger.info({ subscriptionId: subscription.id }, 'Handling subscription created')

    const workspaceId = subscription.metadata?.workspaceId

    if (!workspaceId) {
      logger.warn({ subscriptionId: subscription.id }, 'No workspaceId in subscription metadata')
      return
    }

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
      create: {
        workspaceId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        plan: (subscription.metadata?.plan as 'BASIC' | 'PRO') || 'BASIC',
        status: subscription.status as any,
        whatsappAddon: subscription.metadata?.whatsappAddon === 'true',
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    })

    logger.info({ subscriptionId: subscription.id }, 'Subscription record updated')
  } catch (error) {
    logger.error({ error, subscriptionId: subscription.id }, 'Error handling subscription created')
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    logger.info({ subscriptionId: subscription.id }, 'Handling subscription updated')

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    })

    logger.info({ subscriptionId: subscription.id }, 'Subscription updated')
  } catch (error) {
    logger.error({ error, subscriptionId: subscription.id }, 'Error handling subscription updated')
    throw error
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    logger.info({ subscriptionId: subscription.id }, 'Handling subscription deleted')

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
      },
    })

    logger.info({ subscriptionId: subscription.id }, 'Subscription marked as canceled')
  } catch (error) {
    logger.error({ error, subscriptionId: subscription.id }, 'Error handling subscription deleted')
    throw error
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    logger.info({ invoiceId: invoice.id }, 'Handling invoice payment succeeded')

    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    })

    if (subscription && subscription.workspaceId) {
      await prisma.activityLog.create({
        data: {
          workspaceId: subscription.workspaceId,
          actionType: 'payment_succeeded',
          description: `Payment of ${invoice.amount_paid / 100} EUR succeeded`,
          metadata: {
            invoiceId: invoice.id,
            amount: invoice.amount_paid,
          },
        },
      })
    }

    logger.info({ invoiceId: invoice.id }, 'Invoice payment logged')
  } catch (error) {
    logger.error({ error, invoiceId: invoice.id }, 'Error handling invoice payment succeeded')
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    logger.info({ invoiceId: invoice.id }, 'Handling invoice payment failed')

    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    })

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'past_due' },
      })

      if (subscription.workspaceId) {
        await prisma.activityLog.create({
          data: {
            workspaceId: subscription.workspaceId,
            actionType: 'payment_failed',
            description: `Payment of ${invoice.amount_due / 100} EUR failed`,
            metadata: {
              invoiceId: invoice.id,
              amount: invoice.amount_due,
            },
          },
        })
      }
    }

    logger.info({ invoiceId: invoice.id }, 'Invoice payment failure logged')
  } catch (error) {
    logger.error({ error, invoiceId: invoice.id }, 'Error handling invoice payment failed')
  }
}
