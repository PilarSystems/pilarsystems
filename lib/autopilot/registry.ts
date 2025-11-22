/**
 * Autopilot Processor Registry
 * 
 * Central registration point for all event and job processors.
 * Import this module once in server-side entry points to ensure processors are registered.
 */

import { eventBus, EventType } from './event-bus'
import { jobQueue } from './job-queue'
import { coachProcessors } from './processors/coach'
import { affiliateProcessors } from './processors/affiliate'
import { billingProcessors } from './processors/billing'

let registered = false

/**
 * Register all autopilot processors with the event bus and job queue
 */
export function registerAutopilotProcessors() {
  if (registered) {
    return
  }

  const coachEventTypes: EventType[] = [
    'coach.message_received',
    'coach.lead_qualified',
    'coach.followup_due',
    'coach.session_reminder'
  ]

  const affiliateEventTypes: EventType[] = [
    'affiliate.conversion_recorded',
    'affiliate.payout_failure'
  ]

  const billingEventTypes: EventType[] = [
    'billing.invoice_created',
    'billing.invoice_paid',
    'billing.payment_failed'
  ]

  coachProcessors.events.forEach(processor => {
    coachEventTypes.forEach(type => {
      if (processor.canHandle(type)) {
        eventBus.register(type, processor)
      }
    })
  })
  coachProcessors.jobs.forEach(processor => {
    const jobTypes = ['coach.followup_check', 'coach.session_reminder_check']
    jobTypes.forEach(type => {
      if (processor.canHandle(type)) {
        jobQueue.register(type, processor)
      }
    })
  })

  affiliateProcessors.events.forEach(processor => {
    affiliateEventTypes.forEach(type => {
      if (processor.canHandle(type)) {
        eventBus.register(type, processor)
      }
    })
  })
  affiliateProcessors.jobs.forEach(processor => {
    const jobTypes = ['affiliate.monthly_payout_prepare', 'affiliate.monthly_payout_finalize']
    jobTypes.forEach(type => {
      if (processor.canHandle(type)) {
        jobQueue.register(type, processor)
      }
    })
  })

  billingProcessors.events.forEach(processor => {
    billingEventTypes.forEach(type => {
      if (processor.canHandle(type)) {
        eventBus.register(type, processor)
      }
    })
  })
  billingProcessors.jobs.forEach(processor => {
    const jobTypes = ['billing.reconcile_daily']
    jobTypes.forEach(type => {
      if (processor.canHandle(type)) {
        jobQueue.register(type, processor)
      }
    })
  })

  registered = true
}

registerAutopilotProcessors()

export const AUTOPILOT_PROCESSORS_REGISTERED = true
