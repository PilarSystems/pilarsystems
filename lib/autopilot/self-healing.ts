/**
 * PILAR AUTOPILOT - Self-Healing System
 * 
 * Provides retry logic with exponential backoff, circuit breakers, and error recovery
 */

import { classifyError, AutopilotErrorClass } from './errors'
import { logger } from '@/lib/logger'

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  jitter?: boolean
  onRetry?: (attempt: number, error: any) => void
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitter: true,
  onRetry: () => {},
}

/**
 * Exponential backoff with jitter
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  const exponentialDelay = Math.min(
    options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt),
    options.maxDelayMs
  )

  if (options.jitter) {
    const jitterAmount = exponentialDelay * 0.25
    return exponentialDelay + (Math.random() * jitterAmount * 2 - jitterAmount)
  }

  return exponentialDelay
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }
  let lastError: any

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const classified = classifyError(error)

      if (!classified.retryable) {
        logger.warn(
          {
            errorClass: classified.class,
            message: classified.message,
            attempt,
          },
          'Non-retryable error encountered'
        )
        throw error
      }

      if (attempt >= opts.maxRetries) {
        logger.error(
          {
            errorClass: classified.class,
            message: classified.message,
            attempts: attempt + 1,
          },
          'Max retries exhausted'
        )
        throw error
      }

      const delay = calculateDelay(attempt, opts)
      logger.info(
        {
          errorClass: classified.class,
          attempt: attempt + 1,
          maxRetries: opts.maxRetries,
          delayMs: Math.round(delay),
        },
        'Retrying after error'
      )

      opts.onRetry(attempt + 1, error)
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  failures: number
  lastFailureTime: number
  state: 'closed' | 'open' | 'half-open'
}

const circuitBreakers = new Map<string, CircuitBreakerState>()

export interface CircuitBreakerOptions {
  failureThreshold?: number
  resetTimeoutMs?: number
  halfOpenAttempts?: number
}

const DEFAULT_CIRCUIT_BREAKER_OPTIONS: Required<CircuitBreakerOptions> = {
  failureThreshold: 5,
  resetTimeoutMs: 60000, // 1 minute
  halfOpenAttempts: 1,
}

/**
 * Circuit breaker pattern to prevent cascading failures
 */
export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  options: CircuitBreakerOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_CIRCUIT_BREAKER_OPTIONS, ...options }
  
  let state = circuitBreakers.get(key)
  if (!state) {
    state = { failures: 0, lastFailureTime: 0, state: 'closed' }
    circuitBreakers.set(key, state)
  }

  const now = Date.now()

  if (
    state.state === 'open' &&
    now - state.lastFailureTime > opts.resetTimeoutMs
  ) {
    logger.info({ key }, 'Circuit breaker transitioning to half-open')
    state.state = 'half-open'
    state.failures = 0
  }

  if (state.state === 'open') {
    const error = new Error(`Circuit breaker open for: ${key}`)
    logger.warn({ key, failures: state.failures }, 'Circuit breaker is open')
    throw error
  }

  try {
    const result = await fn()

    if (state.state === 'half-open') {
      logger.info({ key }, 'Circuit breaker closing after successful attempt')
      state.state = 'closed'
      state.failures = 0
    }

    return result
  } catch (error) {
    state.failures++
    state.lastFailureTime = now

    if (state.failures >= opts.failureThreshold) {
      logger.error(
        { key, failures: state.failures, threshold: opts.failureThreshold },
        'Circuit breaker opening due to failures'
      )
      state.state = 'open'
    }

    throw error
  }
}

/**
 * Combined retry + circuit breaker wrapper
 */
export async function withRetryAndCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  retryOptions: RetryOptions = {},
  circuitBreakerOptions: CircuitBreakerOptions = {}
): Promise<T> {
  return withCircuitBreaker(
    key,
    () => withRetry(fn, retryOptions),
    circuitBreakerOptions
  )
}

/**
 * Get circuit breaker state for monitoring
 */
export function getCircuitBreakerState(key: string): CircuitBreakerState | null {
  return circuitBreakers.get(key) || null
}

/**
 * Reset circuit breaker manually
 */
export function resetCircuitBreaker(key: string): void {
  const state = circuitBreakers.get(key)
  if (state) {
    state.failures = 0
    state.state = 'closed'
    state.lastFailureTime = 0
    logger.info({ key }, 'Circuit breaker manually reset')
  }
}

/**
 * Clear all circuit breakers (for testing)
 */
export function clearAllCircuitBreakers(): void {
  circuitBreakers.clear()
}
