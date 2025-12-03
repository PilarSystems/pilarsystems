/**
 * Performance Monitoring Utilities
 * 
 * Utilities for tracking API performance, latency, and metrics.
 * Part of Phase E API performance optimization.
 */

import { logger } from '@/lib/logger'

export interface PerformanceMetrics {
  requestId: string
  method: string
  path: string
  startTime: number
  endTime?: number
  latencyMs?: number
  status?: number
  cached?: boolean
  dbQueries?: number
  externalCalls?: number
}

const metricsBuffer: PerformanceMetrics[] = []
const MAX_BUFFER_SIZE = 100

/**
 * Track a request's performance
 */
export function trackRequest(metrics: PerformanceMetrics): void {
  if (metrics.startTime && !metrics.endTime) {
    metrics.endTime = Date.now()
    metrics.latencyMs = metrics.endTime - metrics.startTime
  }

  metricsBuffer.push(metrics)

  // Keep buffer size manageable
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift()
  }

  // Log slow requests
  if (metrics.latencyMs && metrics.latencyMs > 1000) {
    logger.warn({
      ...metrics,
      message: 'Slow request detected',
    }, `Slow request: ${metrics.path} took ${metrics.latencyMs}ms`)
  }
}

/**
 * Get recent performance metrics
 */
export function getRecentMetrics(): PerformanceMetrics[] {
  return [...metricsBuffer]
}

/**
 * Calculate average latency for recent requests
 */
export function getAverageLatency(): number {
  const validMetrics = metricsBuffer.filter(m => m.latencyMs !== undefined)
  if (validMetrics.length === 0) return 0
  
  const sum = validMetrics.reduce((acc, m) => acc + (m.latencyMs || 0), 0)
  return Math.round(sum / validMetrics.length)
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  totalRequests: number
  averageLatencyMs: number
  p95LatencyMs: number
  slowRequests: number
  cachedRequests: number
} {
  const validMetrics = metricsBuffer.filter(m => m.latencyMs !== undefined)
  
  if (validMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageLatencyMs: 0,
      p95LatencyMs: 0,
      slowRequests: 0,
      cachedRequests: 0,
    }
  }

  const latencies = validMetrics.map(m => m.latencyMs!).sort((a, b) => a - b)
  const sum = latencies.reduce((acc, l) => acc + l, 0)
  const p95Index = Math.floor(latencies.length * 0.95)

  return {
    totalRequests: metricsBuffer.length,
    averageLatencyMs: Math.round(sum / latencies.length),
    p95LatencyMs: latencies[p95Index] || 0,
    slowRequests: latencies.filter(l => l > 1000).length,
    cachedRequests: metricsBuffer.filter(m => m.cached).length,
  }
}

/**
 * Create a timer for measuring operation duration
 */
export function createTimer() {
  const startTime = Date.now()
  
  return {
    startTime,
    elapsed(): number {
      return Date.now() - startTime
    },
    log(operation: string): void {
      const elapsed = Date.now() - startTime
      if (elapsed > 100) {
        logger.info({ operation, durationMs: elapsed }, `Operation timing: ${operation}`)
      }
    },
  }
}

/**
 * Decorator for timing async functions
 */
export function withTiming<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  operationName: string
): T {
  return (async (...args: unknown[]) => {
    const timer = createTimer()
    try {
      const result = await fn(...args)
      timer.log(operationName)
      return result
    } catch (error) {
      timer.log(`${operationName} (failed)`)
      throw error
    }
  }) as T
}

/**
 * Clear metrics buffer (for testing)
 */
export function clearMetrics(): void {
  metricsBuffer.length = 0
}
