/**
 * PILAR AUTOPILOT - Step 1: Ensure Subscription Linked
 * 
 * Verifies that workspace has an active subscription
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface StepResult {
  name: string
  status: 'completed' | 'skipped' | 'failed'
  details: string
  error?: string
}

export async function ensureSubscriptionLinked(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 1: Ensuring subscription linked')

    const subscription = await prisma.subscription.findFirst({
      where: {
        workspaceId,
        status: 'active',
      },
    })

    if (!subscription) {
      return {
        name: 'ensure_subscription',
        status: 'failed',
        details: 'No active subscription found for workspace',
        error: 'SUBSCRIPTION_NOT_FOUND',
      }
    }

    logger.info(
      {
        workspaceId,
        subscriptionId: subscription.id,
        plan: subscription.plan,
      },
      'Subscription verified'
    )

    return {
      name: 'ensure_subscription',
      status: 'completed',
      details: `Subscription verified: ${subscription.plan} plan`,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to verify subscription')
    return {
      name: 'ensure_subscription',
      status: 'failed',
      details: 'Failed to verify subscription',
      error: error.message,
    }
  }
}
