/**
 * Billing Autopilot Processors
 * 
 * Handles billing.* events for automated billing management
 */

import { EventProcessor, AutopilotEvent, EventResult } from '../event-bus'
import { JobProcessor, AutopilotJob, JobResult } from '../job-queue'
import { prisma } from '@/lib/prisma'
import { policyEngine } from '@/lib/operator/policy-engine'
import { DistributedLockManager } from '../distributed-lock-manager'

const lockManager = new DistributedLockManager()

/**
 * Billing Invoice Created Event Processor
 * Handles Stripe invoice.created webhook events
 */
class BillingInvoiceCreatedProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'billing.invoice_created'
  }

  getHandlerName(): string {
    return 'BillingInvoiceCreatedProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { invoiceId, customerId, amount, dueDate } = event.payload

    try {
      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'billing.invoice_created',
          description: `Invoice created: ${invoiceId} for $${(amount / 100).toFixed(2)}`,
          metadata: {
            invoiceId,
            customerId,
            amount,
            dueDate
          }
        }
      })

      return { success: true, result: { invoiceId } }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Billing Invoice Paid Event Processor
 * Handles Stripe invoice.paid webhook events
 */
class BillingInvoicePaidProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'billing.invoice_paid'
  }

  getHandlerName(): string {
    return 'BillingInvoicePaidProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { invoiceId, customerId, amount, paidAt } = event.payload

    try {
      const result = await lockManager.withLock(
        `billing:${workspaceId}`,
        workspaceId,
        async () => {
          const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { subscription: true }
          })

          if (!workspace?.subscription) {
            return { success: false, error: 'Subscription not found' }
          }

          await prisma.subscription.update({
            where: { id: workspace.subscription.id },
            data: {
              status: 'active',
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          })

          await prisma.activityLog.create({
            data: {
              workspaceId,
              actionType: 'billing.invoice_paid',
              description: `Invoice paid: ${invoiceId} for $${(amount / 100).toFixed(2)}`,
              metadata: {
                invoiceId,
                customerId,
                amount,
                paidAt
              }
            }
          })

          return { success: true, result: { invoiceId } }
        }
      )

      if (!result) {
        return {
          success: false,
          error: 'Failed to acquire lock',
          reschedule: new Date(Date.now() + 2000)
        }
      }

      return result
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Billing Payment Failed Event Processor
 * Handles Stripe invoice.payment_failed webhook events
 */
class BillingPaymentFailedProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'billing.payment_failed'
  }

  getHandlerName(): string {
    return 'BillingPaymentFailedProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { invoiceId, customerId, amount, attemptCount, nextRetryAt } = event.payload

    try {
      const result = await lockManager.withLock(
        `billing:${workspaceId}`,
        workspaceId,
        async () => {
          const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { subscription: true }
          })

          if (!workspace?.subscription) {
            return { success: false, error: 'Subscription not found' }
          }

          if (attemptCount >= 3) {
            await prisma.subscription.update({
              where: { id: workspace.subscription.id },
              data: {
                status: 'past_due'
              }
            })

            const policy = await policyEngine.getPolicy(workspaceId)
            if (policy.overagePolicy === 'drop') {
              await prisma.workspace.update({
                where: { id: workspaceId },
                data: {
                  studioInfo: {
                    ...((workspace as any).studioInfo || {}),
                    operatorConfig: {
                      ...(((workspace as any).studioInfo as any)?.operatorConfig || {}),
                      enabled: false
                    }
                  }
                }
              })
            }
          }

          await prisma.activityLog.create({
            data: {
              workspaceId,
              actionType: 'billing.payment_failed',
              description: `Payment failed (attempt ${attemptCount}): ${invoiceId} for $${(amount / 100).toFixed(2)}`,
              metadata: {
                invoiceId,
                customerId,
                amount,
                attemptCount,
                nextRetryAt
              }
            }
          })

          return { success: true, result: { invoiceId, attemptCount } }
        }
      )

      if (!result) {
        return {
          success: false,
          error: 'Failed to acquire lock',
          reschedule: new Date(Date.now() + 2000)
        }
      }

      return result
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Billing Reconcile Daily Job Processor
 * Reconciles billing data daily per workspace
 */
class BillingReconcileDailyProcessor implements JobProcessor {
  canHandle(jobType: string): boolean {
    return jobType === 'billing.reconcile_daily'
  }

  getProcessorName(): string {
    return 'BillingReconcileDailyProcessor'
  }

  async process(job: AutopilotJob): Promise<JobResult> {
    const { workspaceId } = job
    const { date } = job.payload

    try {
      const idempotencyKey = `reconcile:${workspaceId}:${date}`

      const existing = await prisma.activityLog.findFirst({
        where: {
          workspaceId,
          actionType: 'billing.reconcile_completed',
          metadata: {
            path: ['idempotencyKey'],
            equals: idempotencyKey
          }
        }
      })

      if (existing) {
        return { success: true, result: { skipped: true, reason: 'Already reconciled' } }
      }

      const result = await lockManager.withLock(
        `billing:reconcile:${workspaceId}`,
        workspaceId,
        async () => {
          const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
              subscription: true,
              studioInfo: true
            }
          })

          if (!workspace?.subscription) {
            return { success: false, error: 'Subscription not found' }
          }

          const now = new Date()
          const subscriptionExpired = workspace.subscription.currentPeriodEnd < now

          if (subscriptionExpired && workspace.subscription.status === 'active') {
            await prisma.subscription.update({
              where: { id: workspace.subscription.id },
              data: {
                status: 'past_due'
              }
            })
          }

          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          const recentActivity = await prisma.activityLog.count({
            where: {
              workspaceId,
              actionType: { startsWith: 'billing.' },
              createdAt: { gte: oneDayAgo }
            }
          })

          const policy = await policyEngine.getPolicy(workspaceId)
          const healthScore = await policyEngine.getHealthScore(workspaceId)

          await prisma.activityLog.create({
            data: {
              workspaceId,
              actionType: 'billing.reconcile_completed',
              description: `Daily billing reconciliation completed`,
              metadata: {
                date,
                subscriptionStatus: workspace.subscription.status,
                subscriptionExpired,
                recentActivity,
                healthScore,
                idempotencyKey
              }
            }
          })

          return {
            success: true,
            result: {
              subscriptionStatus: workspace.subscription.status,
              subscriptionExpired,
              recentActivity,
              healthScore
            }
          }
        }
      )

      if (!result) {
        return {
          success: false,
          error: 'Failed to acquire lock',
          reschedule: new Date(Date.now() + 5000)
        }
      }

      return result
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

export const billingProcessors = {
  events: [
    new BillingInvoiceCreatedProcessor(),
    new BillingInvoicePaidProcessor(),
    new BillingPaymentFailedProcessor()
  ],
  jobs: [
    new BillingReconcileDailyProcessor()
  ]
}
