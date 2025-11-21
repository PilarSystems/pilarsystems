/**
 * PILAR AUTOPILOT - Error Taxonomy
 * 
 * Defines error classes and classification logic for self-healing system
 */

export enum AutopilotErrorClass {
  PROVISIONING_ERROR = 'PROVISIONING_ERROR',
  WEBHOOK_ERROR = 'WEBHOOK_ERROR',
  INTEGRATION_OFFLINE = 'INTEGRATION_OFFLINE',
  RATE_LIMITED = 'RATE_LIMITED',
  THIRD_PARTY_AUTH_FAILED = 'THIRD_PARTY_AUTH_FAILED',
  TRANSIENT_NETWORK = 'TRANSIENT_NETWORK',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ClassifiedError {
  class: AutopilotErrorClass
  retryable: boolean
  message: string
  originalError?: any
  code?: string
  statusCode?: number
}

/**
 * Classify an error to determine retry strategy
 */
export function classifyError(error: any): ClassifiedError {
  const message = error?.message || error?.toString() || 'Unknown error'
  const code = error?.code || error?.error?.code
  const statusCode = error?.statusCode || error?.status || error?.response?.status

  if (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    message.includes('network') ||
    message.includes('timeout')
  ) {
    return {
      class: AutopilotErrorClass.TRANSIENT_NETWORK,
      retryable: true,
      message: `Network error: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    statusCode === 429 ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  ) {
    return {
      class: AutopilotErrorClass.RATE_LIMITED,
      retryable: true,
      message: `Rate limited: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    statusCode === 401 ||
    statusCode === 403 ||
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('invalid token') ||
    message.includes('expired token') ||
    message.includes('authentication failed')
  ) {
    return {
      class: AutopilotErrorClass.THIRD_PARTY_AUTH_FAILED,
      retryable: false,
      message: `Authentication failed: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    statusCode === 503 ||
    statusCode === 502 ||
    statusCode === 504 ||
    message.includes('service unavailable') ||
    message.includes('bad gateway')
  ) {
    return {
      class: AutopilotErrorClass.INTEGRATION_OFFLINE,
      retryable: true,
      message: `Integration offline: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    message.includes('missing') ||
    message.includes('not configured') ||
    message.includes('invalid configuration') ||
    message.includes('env') ||
    message.includes('environment variable')
  ) {
    return {
      class: AutopilotErrorClass.CONFIGURATION_ERROR,
      retryable: false,
      message: `Configuration error: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    statusCode === 404 ||
    message.includes('not found') ||
    message.includes('does not exist')
  ) {
    return {
      class: AutopilotErrorClass.RESOURCE_NOT_FOUND,
      retryable: false,
      message: `Resource not found: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    statusCode === 400 ||
    statusCode === 422 ||
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return {
      class: AutopilotErrorClass.VALIDATION_ERROR,
      retryable: false,
      message: `Validation error: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (
    message.includes('provisioning') ||
    message.includes('subaccount') ||
    message.includes('number purchase') ||
    message.includes('KYC') ||
    message.includes('business verification')
  ) {
    return {
      class: AutopilotErrorClass.PROVISIONING_ERROR,
      retryable: false,
      message: `Provisioning error: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  if (message.includes('webhook')) {
    return {
      class: AutopilotErrorClass.WEBHOOK_ERROR,
      retryable: true,
      message: `Webhook error: ${message}`,
      originalError: error,
      code,
      statusCode,
    }
  }

  return {
    class: AutopilotErrorClass.UNKNOWN_ERROR,
    retryable: true,
    message: `Unknown error: ${message}`,
    originalError: error,
    code,
    statusCode,
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryable(error: any): boolean {
  const classified = classifyError(error)
  return classified.retryable
}

/**
 * Get human-readable error message for dashboard/logs
 */
export function getErrorMessage(error: any): string {
  const classified = classifyError(error)
  return classified.message
}

/**
 * Get error class for monitoring/alerting
 */
export function getErrorClass(error: any): AutopilotErrorClass {
  const classified = classifyError(error)
  return classified.class
}
