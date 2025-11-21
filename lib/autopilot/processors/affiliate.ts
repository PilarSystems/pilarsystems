/**
 * Affiliate Autopilot 2.0 Processors
 * 
 * Handles affiliate.* events for automated affiliate management
 */

import { EventProcessor, AutopilotEvent, EventResult } from '../event-bus'
import { JobProcessor, AutopilotJob, JobResult } from '../job-queue'
import { prisma } from '@/lib/prisma'
import { DistributedLockManager } from '../distributed-lock-manager'
import { rateLimiter } from '../rate-limiter'

const lockManager = new DistributedLockManager()

/**
 * Affiliate Conversion Recorded Event Processor
 * Tracks conversions and updates affiliate stats
 */
class AffiliateConversionRecordedProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'affiliate.conversion_recorded'
  }

  getHandlerName(): string {
    return 'AffiliateConversionRecordedProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { affiliateId, affiliateLinkId, setupFeeAmount, recurringAmount, stripeSubscriptionId } = event.payload

    try {
      const result = await lockManager.withLock(
        `affiliate:${affiliateId}`,
        workspaceId,
        async () => {
          const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId }
          })

          if (!affiliate) {
            return { success: false, error: 'Affiliate not found' }
          }

          const commissionSetup = setupFeeAmount ? (setupFeeAmount * affiliate.commissionSetup / 100) : 0
          const commissionRecurring = recurringAmount ? (recurringAmount * affiliate.commissionRecurring / 100) : 0
          const totalCommission = commissionSetup + commissionRecurring

          await prisma.affiliateConversion.create({
            data: {
              affiliateId,
              affiliateLinkId,
              stripeSubscriptionId,
              status: 'approved',
              setupFeeAmount,
              recurringAmount,
              commissionSetup,
              commissionRecurring,
              totalCommission,
              paidOut: false
            }
          })

          await prisma.activityLog.create({
            data: {
              workspaceId,
              actionType: 'affiliate.conversion',
              description: `Conversion recorded for affiliate ${affiliateId}`,
              metadata: {
                affiliateId,
                setupFeeAmount,
                recurringAmount,
                totalCommission,
                stripeSubscriptionId
              }
            }
          })

          return { success: true, result: { totalCommission } }
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
 * Affiliate Payout Failure Event Processor
 * Handles failed payouts with retry logic
 */
class AffiliatePayoutFailureProcessor implements EventProcessor {
  canHandle(eventType: string): boolean {
    return eventType === 'affiliate.payout_failure'
  }

  getHandlerName(): string {
    return 'AffiliatePayoutFailureProcessor'
  }

  async process(event: AutopilotEvent): Promise<EventResult> {
    const { workspaceId } = event
    const { affiliateId, payoutId, reason, retryCount } = event.payload

    try {
      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'affiliate.payout_failure',
          description: `Payout failed for affiliate ${affiliateId}: ${reason}`,
          metadata: {
            affiliateId,
            payoutId,
            reason,
            retryCount: retryCount || 0
          }
        }
      })

      if ((retryCount || 0) < 3) {
        const retryDelay = Math.pow(2, retryCount || 0) * 60 * 60 * 1000
        return {
          success: true,
          result: { willRetry: true },
          reschedule: new Date(Date.now() + retryDelay)
        }
      }

      await prisma.affiliatePayout.update({
        where: { id: payoutId },
        data: {
          status: 'failed',
          notes: `Failed after ${retryCount} retries: ${reason}`
        }
      })

      return { success: true, result: { willRetry: false } }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Monthly Payout Prepare Job Processor
 * Prepares monthly payouts for all affiliates
 */
class MonthlyPayoutPrepareProcessor implements JobProcessor {
  canHandle(jobType: string): boolean {
    return jobType === 'affiliate.monthly_payout_prepare'
  }

  getProcessorName(): string {
    return 'MonthlyPayoutPrepareProcessor'
  }

  async process(job: AutopilotJob): Promise<JobResult> {
    const { workspaceId } = job
    const { month, year } = job.payload

    try {
      const idempotencyKey = `payout:${workspaceId}:${year}-${month}`

      const existing = await prisma.activityLog.findFirst({
        where: {
          workspaceId,
          actionType: 'affiliate.payout_prepared',
          metadata: {
            path: ['idempotencyKey'],
            equals: idempotencyKey
          }
        }
      })

      if (existing) {
        return { success: true, result: { skipped: true, reason: 'Already prepared' } }
      }

      const affiliates = await prisma.affiliate.findMany({
        where: {
          status: 'active'
        }
      })

      let totalPayouts = 0
      let totalAmount = 0

      for (const affiliate of affiliates) {
        const result = await lockManager.withLock(
          `affiliate:${affiliate.id}:payout`,
          workspaceId,
          async () => {
            const unpaidConversions = await prisma.affiliateConversion.findMany({
              where: {
                affiliateId: affiliate.id,
                paidOut: false,
                status: 'approved'
              }
            })

            const pendingAmount = unpaidConversions.reduce(
              (sum, conv) => sum + (conv.totalCommission || 0),
              0
            )

            if (pendingAmount < 50) {
              return { skipped: true, reason: 'Below minimum payout threshold' }
            }

            const payout = await prisma.affiliatePayout.create({
              data: {
                affiliateId: affiliate.id,
                amount: pendingAmount,
                method: affiliate.payoutMethod || 'manual',
                status: 'pending',
                notes: `Monthly payout for ${month}/${year}`
              }
            })

            await prisma.activityLog.create({
              data: {
                workspaceId,
                actionType: 'affiliate.payout_pending',
                description: `Payout pending for affiliate ${affiliate.id}`,
                metadata: {
                  affiliateId: affiliate.id,
                  payoutId: payout.id,
                  amount: pendingAmount,
                  month,
                  year,
                  idempotencyKey: `${idempotencyKey}:${affiliate.id}`
                }
              }
            })

            totalPayouts++
            totalAmount += pendingAmount

            return { success: true, amount: pendingAmount }
          }
        )

        if (!result) {
          console.warn(`Failed to acquire lock for affiliate ${affiliate.id}`)
        }
      }

      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'affiliate.payout_prepared',
          description: `Monthly payouts prepared: ${totalPayouts} affiliates, $${totalAmount.toFixed(2)}`,
          metadata: {
            month,
            year,
            totalPayouts,
            totalAmount,
            idempotencyKey
          }
        }
      })

      return {
        success: true,
        result: {
          totalPayouts,
          totalAmount,
          month,
          year
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

/**
 * Monthly Payout Finalize Job Processor
 * Finalizes monthly payouts and resets pending amounts
 */
class MonthlyPayoutFinalizeProcessor implements JobProcessor {
  canHandle(jobType: string): boolean {
    return jobType === 'affiliate.monthly_payout_finalize'
  }

  getProcessorName(): string {
    return 'MonthlyPayoutFinalizeProcessor'
  }

  async process(job: AutopilotJob): Promise<JobResult> {
    const { workspaceId } = job
    const { month, year } = job.payload

    try {
      const idempotencyKey = `payout:${workspaceId}:${year}-${month}`

      const existing = await prisma.activityLog.findFirst({
        where: {
          workspaceId,
          actionType: 'affiliate.payout_finalized',
          metadata: {
            path: ['idempotencyKey'],
            equals: idempotencyKey
          }
        }
      })

      if (existing) {
        return { success: true, result: { skipped: true, reason: 'Already finalized' } }
      }

      const pendingPayouts = await prisma.activityLog.findMany({
        where: {
          workspaceId,
          actionType: 'affiliate.payout_pending',
          metadata: {
            path: ['month'],
            equals: month
          }
        }
      })

      let successCount = 0
      let failureCount = 0

      for (const payout of pendingPayouts) {
        const metadata = payout.metadata as any
        const affiliateId = metadata.affiliateId
        const amount = metadata.amount

        try {
          const result = await lockManager.withLock(
            `affiliate:${affiliateId}:payout`,
            workspaceId,
            async () => {
              const payoutId = metadata.payoutId

              await prisma.affiliatePayout.update({
                where: { id: payoutId },
                data: {
                  status: 'completed',
                  completedAt: new Date()
                }
              })

              await prisma.affiliateConversion.updateMany({
                where: {
                  affiliateId,
                  paidOut: false,
                  status: 'approved'
                },
                data: {
                  paidOut: true,
                  paidOutAt: new Date()
                }
              })

              await prisma.activityLog.create({
                data: {
                  workspaceId,
                  actionType: 'affiliate.payout_completed',
                  description: `Payout completed for affiliate ${affiliateId}: $${amount.toFixed(2)}`,
                  metadata: {
                    affiliateId,
                    payoutId,
                    amount,
                    month,
                    year
                  }
                }
              })

              return { success: true }
            }
          )

          if (result?.success) {
            successCount++
          } else {
            failureCount++
          }
        } catch (error) {
          console.error(`Failed to finalize payout for affiliate ${affiliateId}:`, error)
          failureCount++
        }
      }

      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'affiliate.payout_finalized',
          description: `Monthly payouts finalized: ${successCount} succeeded, ${failureCount} failed`,
          metadata: {
            month,
            year,
            successCount,
            failureCount,
            idempotencyKey
          }
        }
      })

      return {
        success: true,
        result: {
          successCount,
          failureCount,
          month,
          year
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Processing failed' }
    }
  }
}

export const affiliateProcessors = {
  events: [
    new AffiliateConversionRecordedProcessor(),
    new AffiliatePayoutFailureProcessor()
  ],
  jobs: [
    new MonthlyPayoutPrepareProcessor(),
    new MonthlyPayoutFinalizeProcessor()
  ]
}
