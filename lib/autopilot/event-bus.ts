/**
 * Autopilot Event Bus
 * 
 * Central event processing system for PILAR AUTOPILOT v6
 * Handles event creation, processing, and retry logic
 */

import { prisma } from '@/lib/db'
import crypto from 'crypto'

export type EventType =
  | 'coach.morning_nudge'
  | 'coach.missed_training_nudge'
  | 'coach.weekly_checkin'
  | 'coach.goal_progress_report'
  | 'coach.nutrition_reminder'
  | 'coach.motivation_message'
  | 'health.webhook_check'
  | 'health.queue_check'
  | 'health.rate_limit_check'
  | 'health.integration_check'
  | 'health.ai_provider_check'
  | 'provisioning.workspace_setup'
  | 'provisioning.twilio_retry'
  | 'provisioning.whatsapp_retry'
  | 'provisioning.webhook_recreate'
  | 'support.auto_reply_request'
  | 'support.escalation_needed'
  | 'support.incident_created'

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface AutopilotEvent {
  id: string
  workspaceId: string
  type: EventType
  payload: Record<string, any>
  status: EventStatus
  scheduledAt: Date
  attempts: number
  maxAttempts: number
  idempotencyKey: string
  lockedAt?: Date | null
  lockedBy?: string | null
  error?: string | null
  processedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventOptions {
  workspaceId: string
  type: EventType
  payload: Record<string, any>
  scheduledAt?: Date
  maxAttempts?: number
  idempotencyKey?: string
}

export interface EventProcessor {
  canHandle(eventType: EventType): boolean
  process(event: AutopilotEvent): Promise<EventResult>
  getHandlerName(): string
}

export interface EventResult {
  success: boolean
  result?: any
  error?: string
  reschedule?: Date
}

class EventBus {
  private processors: Map<EventType, EventProcessor[]> = new Map()
  private processingLock = new Set<string>()

  /**
   * Register an event processor
   */
  register(eventType: EventType, processor: EventProcessor): void {
    const processors = this.processors.get(eventType) || []
    processors.push(processor)
    this.processors.set(eventType, processors)
  }

  /**
   * Create a new event with idempotency
   */
  async createEvent(options: CreateEventOptions): Promise<AutopilotEvent> {
    const idempotencyKey = options.idempotencyKey || this.generateIdempotencyKey(options)

    const existing = await prisma.autopilotEvent.findUnique({
      where: { idempotencyKey }
    })

    if (existing) {
      return existing as AutopilotEvent
    }

    const event = await prisma.autopilotEvent.create({
      data: {
        workspaceId: options.workspaceId,
        type: options.type,
        payload: options.payload,
        scheduledAt: options.scheduledAt || new Date(),
        maxAttempts: options.maxAttempts || 3,
        idempotencyKey,
        status: 'pending'
      }
    })

    return event as AutopilotEvent
  }

  /**
   * Process pending events
   */
  async processPendingEvents(limit: number = 100): Promise<number> {
    const events = await prisma.autopilotEvent.findMany({
      where: {
        status: 'pending',
        scheduledAt: { lte: new Date() },
        lockedAt: null
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit
    })

    let processed = 0

    for (const event of events) {
      if (this.processingLock.has(event.id)) continue

      try {
        this.processingLock.add(event.id)
        await this.processEvent(event as AutopilotEvent)
        processed++
      } catch (error) {
        console.error(`Error processing event ${event.id}:`, error)
      } finally {
        this.processingLock.delete(event.id)
      }
    }

    return processed
  }

  /**
   * Process a single event
   */
  private async processEvent(event: AutopilotEvent): Promise<void> {
    const locked = await this.lockEvent(event.id)
    if (!locked) return

    try {
      await prisma.autopilotEvent.update({
        where: { id: event.id },
        data: {
          status: 'processing',
          attempts: { increment: 1 }
        }
      })

      const processors = this.processors.get(event.type) || []

      if (processors.length === 0) {
        throw new Error(`No processor registered for event type: ${event.type}`)
      }

      const results = await Promise.allSettled(
        processors.map(processor => processor.process(event))
      )

      const allSucceeded = results.every(
        result => result.status === 'fulfilled' && result.value.success
      )

      if (allSucceeded) {
        await prisma.autopilotEvent.update({
          where: { id: event.id },
          data: {
            status: 'completed',
            processedAt: new Date(),
            lockedAt: null,
            lockedBy: null
          }
        })
      } else {
        const errors = results
          .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
          .map(r => r.status === 'rejected' ? r.reason : (r as any).value.error)
          .join('; ')

        await this.handleEventFailure(event, errors)
      }
    } catch (error) {
      await this.handleEventFailure(event, error instanceof Error ? error.message : String(error))
    }
  }

  /**
   * Handle event processing failure
   */
  private async handleEventFailure(event: AutopilotEvent, error: string): Promise<void> {
    const updatedEvent = await prisma.autopilotEvent.findUnique({
      where: { id: event.id }
    })

    if (!updatedEvent) return

    const shouldRetry = updatedEvent.attempts < updatedEvent.maxAttempts

    if (shouldRetry) {
      const backoffMs = Math.pow(2, updatedEvent.attempts) * 1000
      const retryAt = new Date(Date.now() + backoffMs)

      await prisma.autopilotEvent.update({
        where: { id: event.id },
        data: {
          status: 'pending',
          scheduledAt: retryAt,
          error,
          lockedAt: null,
          lockedBy: null
        }
      })
    } else {
      await prisma.autopilotEvent.update({
        where: { id: event.id },
        data: {
          status: 'failed',
          error,
          processedAt: new Date(),
          lockedAt: null,
          lockedBy: null
        }
      })
    }
  }

  /**
   * Lock an event for processing
   */
  private async lockEvent(eventId: string): Promise<boolean> {
    try {
      const result = await prisma.autopilotEvent.updateMany({
        where: {
          id: eventId,
          lockedAt: null
        },
        data: {
          lockedAt: new Date(),
          lockedBy: 'event-bus'
        }
      })

      return result.count > 0
    } catch (error) {
      return false
    }
  }

  /**
   * Generate idempotency key
   */
  private generateIdempotencyKey(options: CreateEventOptions): string {
    const payload = JSON.stringify({
      workspaceId: options.workspaceId,
      type: options.type,
      payload: options.payload,
      scheduledAt: options.scheduledAt?.toISOString()
    })

    return crypto.createHash('sha256').update(payload).digest('hex')
  }

  /**
   * Get event statistics
   */
  async getStats(workspaceId?: string) {
    const where = workspaceId ? { workspaceId } : {}

    const [total, pending, processing, completed, failed] = await Promise.all([
      prisma.autopilotEvent.count({ where }),
      prisma.autopilotEvent.count({ where: { ...where, status: 'pending' } }),
      prisma.autopilotEvent.count({ where: { ...where, status: 'processing' } }),
      prisma.autopilotEvent.count({ where: { ...where, status: 'completed' } }),
      prisma.autopilotEvent.count({ where: { ...where, status: 'failed' } })
    ])

    return { total, pending, processing, completed, failed }
  }

  /**
   * Clean up old completed events
   */
  async cleanup(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const result = await prisma.autopilotEvent.deleteMany({
      where: {
        status: 'completed',
        processedAt: { lt: cutoffDate }
      }
    })

    return result.count
  }
}

export const eventBus = new EventBus()
