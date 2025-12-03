/**
 * API utilities module exports
 * 
 * Part of Phase E API performance optimization.
 */

export {
  successResponse,
  errorResponse,
  withAPIHandler,
  getCacheHeaders,
  ErrorCodes,
  ValidationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  ExternalServiceError,
  type APIResponse,
  type CacheOptions,
  type ErrorCode,
} from './response'

export {
  trackRequest,
  getRecentMetrics,
  getAverageLatency,
  getPerformanceSummary,
  createTimer,
  withTiming,
  clearMetrics,
  type PerformanceMetrics,
} from './performance'
