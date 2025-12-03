/**
 * Multi-Channel Communication Tracing & Error Handling
 * 
 * Utilities for request tracing, performance monitoring, and graceful degradation.
 * Part of Phase E error handling and performance optimization.
 */

import { logger } from '@/lib/logger'
import { createTimer } from '@/lib/api/performance'

// Request trace context
export interface TraceContext {
  traceId: string
  spanId: string
  parentSpanId?: string
  startTime: number
  metadata: Record<string, unknown>
}

// Channel health status
export interface ChannelHealth {
  channel: string
  isHealthy: boolean
  lastError?: string
  lastErrorTime?: Date
  failureCount: number
  lastSuccessTime?: Date
}

// In-memory channel health tracking
const channelHealthMap = new Map<string, ChannelHealth>()

/**
 * Generate a unique trace ID
 */
export function generateTraceId(): string {
  return `tr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Generate a unique span ID
 */
export function generateSpanId(): string {
  return `sp_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Create a new trace context for a request
 */
export function createTraceContext(metadata: Record<string, unknown> = {}): TraceContext {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    startTime: Date.now(),
    metadata,
  }
}

/**
 * Create a child span from a parent trace context
 */
export function createChildSpan(parent: TraceContext, metadata: Record<string, unknown> = {}): TraceContext {
  return {
    traceId: parent.traceId,
    spanId: generateSpanId(),
    parentSpanId: parent.spanId,
    startTime: Date.now(),
    metadata: { ...parent.metadata, ...metadata },
  }
}

/**
 * Log trace completion
 */
export function completeTrace(context: TraceContext, result: { success: boolean; error?: string }): void {
  const duration = Date.now() - context.startTime
  
  logger.info({
    traceId: context.traceId,
    spanId: context.spanId,
    parentSpanId: context.parentSpanId,
    durationMs: duration,
    success: result.success,
    error: result.error,
    ...context.metadata,
  }, `Trace completed: ${result.success ? 'success' : 'failure'}`)
}

/**
 * Update channel health status
 */
export function updateChannelHealth(
  workspaceId: string,
  channel: string,
  success: boolean,
  error?: string
): void {
  const key = `${workspaceId}:${channel}`
  const existing = channelHealthMap.get(key) || {
    channel,
    isHealthy: true,
    failureCount: 0,
  }

  if (success) {
    existing.isHealthy = true
    existing.failureCount = 0
    existing.lastSuccessTime = new Date()
  } else {
    existing.failureCount++
    existing.lastError = error
    existing.lastErrorTime = new Date()
    
    // Mark as unhealthy after 3 consecutive failures
    if (existing.failureCount >= 3) {
      existing.isHealthy = false
    }
  }

  channelHealthMap.set(key, existing)
}

/**
 * Get channel health status
 */
export function getChannelHealth(workspaceId: string, channel: string): ChannelHealth | null {
  const key = `${workspaceId}:${channel}`
  return channelHealthMap.get(key) || null
}

/**
 * Check if channel is healthy for sending
 */
export function isChannelHealthy(workspaceId: string, channel: string): boolean {
  const health = getChannelHealth(workspaceId, channel)
  if (!health) return true // Assume healthy if no data
  
  // Allow recovery after 5 minutes
  if (!health.isHealthy && health.lastErrorTime) {
    const timeSinceError = Date.now() - health.lastErrorTime.getTime()
    if (timeSinceError > 5 * 60 * 1000) {
      return true // Allow retry after 5 minutes
    }
  }
  
  return health.isHealthy
}

/**
 * Get all channel health statuses
 */
export function getAllChannelHealth(): ChannelHealth[] {
  return Array.from(channelHealthMap.values())
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelayMs?: number
    maxDelayMs?: number
    shouldRetry?: (error: unknown) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    shouldRetry = () => true,
  } = options

  let lastError: unknown
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs
      )
      
      logger.warn({
        attempt: attempt + 1,
        maxRetries,
        delayMs: delay,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Retrying operation after failure')
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Timeout wrapper for operations
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  operationName: string = 'Operation'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([operation, timeoutPromise])
}

/**
 * Circuit breaker for external services
 */
export class CircuitBreaker {
  private failureCount = 0
  private lastFailureTime?: Date
  private isOpen = false
  private readonly threshold: number
  private readonly resetTimeMs: number

  constructor(threshold = 5, resetTimeMs = 60000) {
    this.threshold = threshold
    this.resetTimeMs = resetTimeMs
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit should be reset
    if (this.isOpen && this.lastFailureTime) {
      const timeSinceFailure = Date.now() - this.lastFailureTime.getTime()
      if (timeSinceFailure >= this.resetTimeMs) {
        this.isOpen = false
        this.failureCount = 0
      }
    }

    // If circuit is open, fail fast
    if (this.isOpen) {
      throw new Error('Circuit breaker is open - service unavailable')
    }

    try {
      const result = await operation()
      this.failureCount = 0 // Reset on success
      return result
    } catch (error) {
      this.failureCount++
      this.lastFailureTime = new Date()
      
      if (this.failureCount >= this.threshold) {
        this.isOpen = true
        logger.warn({
          threshold: this.threshold,
          resetTimeMs: this.resetTimeMs,
        }, 'Circuit breaker opened due to failures')
      }
      
      throw error
    }
  }

  getStatus(): { isOpen: boolean; failureCount: number } {
    return {
      isOpen: this.isOpen,
      failureCount: this.failureCount,
    }
  }
}

/**
 * Graceful degradation wrapper
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  options: { name?: string } = {}
): Promise<T> {
  const { name = 'operation' } = options
  
  try {
    return await primary()
  } catch (error) {
    logger.warn({
      name,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 'Primary operation failed, using fallback')
    
    return fallback()
  }
}
