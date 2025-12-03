/**
 * API Response Utilities
 * 
 * Centralized utilities for consistent API responses with caching,
 * error handling, and performance optimization.
 * Part of Phase E API performance optimization.
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    timestamp: string
    requestId?: string
    latencyMs?: number
  }
}

export interface CacheOptions {
  maxAge?: number // seconds
  staleWhileRevalidate?: number // seconds
  private?: boolean
  noStore?: boolean
}

/**
 * Standard error codes for API responses
 */
export const ErrorCodes = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

/**
 * Generate cache control headers
 */
export function getCacheHeaders(options: CacheOptions = {}): Record<string, string> {
  const {
    maxAge = 0,
    staleWhileRevalidate = 0,
    private: isPrivate = false,
    noStore = false,
  } = options

  if (noStore) {
    return {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    }
  }

  const directives: string[] = []
  
  if (isPrivate) {
    directives.push('private')
  } else {
    directives.push('public')
  }

  if (maxAge > 0) {
    directives.push(`max-age=${maxAge}`)
  }

  if (staleWhileRevalidate > 0) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`)
  }

  return {
    'Cache-Control': directives.join(', '),
  }
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  options: {
    status?: number
    cache?: CacheOptions
    requestId?: string
    startTime?: number
  } = {}
): NextResponse {
  const { status = 200, cache, requestId, startTime } = options
  
  const response: APIResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      latencyMs: startTime ? Date.now() - startTime : undefined,
    },
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getCacheHeaders(cache),
  }

  if (requestId) {
    headers['X-Request-Id'] = requestId
  }

  if (startTime) {
    headers['X-Response-Time'] = `${Date.now() - startTime}ms`
  }

  return NextResponse.json(response, { status, headers })
}

/**
 * Create an error API response
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  options: {
    status?: number
    details?: unknown
    requestId?: string
    startTime?: number
  } = {}
): NextResponse {
  const { status = 500, details, requestId, startTime } = options

  const statusMap: Record<ErrorCode, number> = {
    [ErrorCodes.BAD_REQUEST]: 400,
    [ErrorCodes.UNAUTHORIZED]: 401,
    [ErrorCodes.FORBIDDEN]: 403,
    [ErrorCodes.NOT_FOUND]: 404,
    [ErrorCodes.CONFLICT]: 409,
    [ErrorCodes.RATE_LIMITED]: 429,
    [ErrorCodes.VALIDATION_ERROR]: 422,
    [ErrorCodes.INTERNAL_ERROR]: 500,
    [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
    [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 502,
  }

  const response: APIResponse = {
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      latencyMs: startTime ? Date.now() - startTime : undefined,
    },
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getCacheHeaders({ noStore: true }),
  }

  if (requestId) {
    headers['X-Request-Id'] = requestId
  }

  return NextResponse.json(response, { 
    status: status || statusMap[code] || 500,
    headers,
  })
}

/**
 * Wrapper for API route handlers with automatic error handling and timing
 */
export function withAPIHandler<T>(
  handler: (request: Request, context: { requestId: string; startTime: number }) => Promise<T>
) {
  return async (request: Request): Promise<NextResponse> => {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    try {
      const result = await handler(request, { requestId, startTime })
      
      if (result instanceof NextResponse) {
        return result
      }

      return successResponse(result, { requestId, startTime })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      logger.error({
        error,
        requestId,
        method: request.method,
        url: request.url,
        latencyMs: Date.now() - startTime,
      }, 'API request failed')

      // Handle specific error types
      if (error instanceof ValidationError) {
        return errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          error.message,
          { details: error.details, requestId, startTime }
        )
      }

      if (error instanceof AuthorizationError) {
        return errorResponse(
          ErrorCodes.UNAUTHORIZED,
          error.message,
          { requestId, startTime }
        )
      }

      if (error instanceof NotFoundError) {
        return errorResponse(
          ErrorCodes.NOT_FOUND,
          error.message,
          { requestId, startTime }
        )
      }

      return errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        errorMessage,
        { details: error, requestId, startTime }
      )
    }
  }
}

/**
 * Custom error classes for typed error handling
 */
export class ValidationError extends Error {
  details?: unknown
  
  constructor(message: string, details?: unknown) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends Error {
  retryAfter?: number
  
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

export class ExternalServiceError extends Error {
  service: string
  
  constructor(service: string, message: string) {
    super(message)
    this.name = 'ExternalServiceError'
    this.service = service
  }
}
