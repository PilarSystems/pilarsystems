/**
 * Log Service
 * 
 * Service for creating and managing message logs.
 */

import { v4 as uuidv4 } from 'uuid'
import { MessageLog, LogLevel, LogType, LogFilter, LogStats } from './log.types'
import { getLogStore } from './log.store'
import { Channel, Intent, Module, OrchestratorResult } from '../orchestrator/orchestrator.types'

const logStore = getLogStore()

/**
 * Create a message received log
 */
export function logMessageReceived(
  tenantId: string,
  channel: Channel,
  content: string,
  metadata: {
    userId?: string
    userName?: string
    phoneNumber?: string
    email?: string
    sessionId?: string
    callId?: string
    messageId?: string
    rawRequest?: any
  }
): MessageLog {
  const log: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.MESSAGE_RECEIVED,
    channel,
    content,
    ...metadata,
  }

  logStore.append(log)
  return log
}

/**
 * Create a message sent log
 */
export function logMessageSent(
  tenantId: string,
  channel: Channel,
  content: string,
  metadata: {
    userId?: string
    sessionId?: string
    callId?: string
    messageId?: string
    latency?: number
    rawResponse?: any
  }
): MessageLog {
  const log: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.MESSAGE_SENT,
    channel,
    content,
    ...metadata,
  }

  logStore.append(log)
  return log
}

/**
 * Create an orchestrator result log
 */
export function logOrchestratorResult(
  tenantId: string,
  channel: Channel,
  result: OrchestratorResult,
  metadata: {
    userId?: string
    userName?: string
    phoneNumber?: string
    email?: string
    sessionId?: string
    callId?: string
  }
): void {
  const intentLog: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.INTENT_DETECTED,
    channel,
    content: result.message.content,
    intent: result.intent.intent,
    intentConfidence: result.intent.confidence,
    entities: result.intent.entities,
    ...metadata,
  }
  logStore.append(intentLog)

  const routingLog: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.ROUTING_DECISION,
    channel,
    intent: result.routing.intent,
    module: result.routing.module,
    routingParams: result.routing.params,
    ...metadata,
  }
  logStore.append(routingLog)

  const moduleLog: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.MODULE_EXECUTION,
    channel,
    module: result.routing.module,
    processingTime: result.response.metadata.processingTime,
    ...metadata,
  }
  logStore.append(moduleLog)

  const responseLog: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.INFO,
    type: LogType.AI_RESPONSE,
    channel,
    response: result.response.content,
    responseMetadata: result.response.metadata,
    latency: result.response.metadata.processingTime,
    ...metadata,
  }
  logStore.append(responseLog)

  if (!result.success && result.error) {
    logError(tenantId, channel, result.error, {
      ...metadata,
      rawRequest: result.message,
      rawResponse: result.response,
    })
  }
}

/**
 * Create an error log
 */
export function logError(
  tenantId: string,
  channel: Channel,
  error: string | Error,
  metadata: {
    userId?: string
    sessionId?: string
    callId?: string
    rawRequest?: any
    rawResponse?: any
  }
): MessageLog {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined

  const log: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level: LogLevel.ERROR,
    type: LogType.ERROR,
    channel,
    error: errorMessage,
    errorStack,
    ...metadata,
  }

  logStore.append(log)
  return log
}

/**
 * Create a system log
 */
export function logSystem(
  tenantId: string,
  message: string,
  level: LogLevel = LogLevel.INFO,
  metadata?: Record<string, any>
): MessageLog {
  const log: MessageLog = {
    id: uuidv4(),
    tenantId,
    timestamp: new Date(),
    level,
    type: LogType.SYSTEM,
    channel: Channel.WEB,
    content: message,
    metadata,
  }

  logStore.append(log)
  return log
}

/**
 * Get logs with filtering
 */
export function getLogs(filter: LogFilter): MessageLog[] {
  return logStore.getLogs(filter)
}

/**
 * Get log by ID
 */
export function getLogById(tenantId: string, logId: string): MessageLog | undefined {
  return logStore.getLogById(tenantId, logId)
}

/**
 * Clear logs for a tenant
 */
export function clearLogs(tenantId: string): void {
  logStore.clearLogs(tenantId)
}

/**
 * Get log statistics
 */
export function getLogStats(tenantId: string): LogStats {
  const logs = logStore.getLogs({ tenantId })

  const stats: LogStats = {
    totalLogs: logs.length,
    byChannel: {
      [Channel.WHATSAPP]: 0,
      [Channel.VOICE]: 0,
      [Channel.EMAIL]: 0,
      [Channel.WEB]: 0,
      [Channel.SMS]: 0,
    },
    byLevel: {
      [LogLevel.INFO]: 0,
      [LogLevel.WARNING]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.DEBUG]: 0,
    },
    byType: {
      [LogType.MESSAGE_RECEIVED]: 0,
      [LogType.MESSAGE_SENT]: 0,
      [LogType.INTENT_DETECTED]: 0,
      [LogType.ROUTING_DECISION]: 0,
      [LogType.MODULE_EXECUTION]: 0,
      [LogType.AI_RESPONSE]: 0,
      [LogType.ERROR]: 0,
      [LogType.SYSTEM]: 0,
    },
    averageLatency: 0,
    errorRate: 0,
  }

  let totalLatency = 0
  let latencyCount = 0
  let errorCount = 0

  logs.forEach(log => {
    if (log.channel) {
      stats.byChannel[log.channel]++
    }

    stats.byLevel[log.level]++

    stats.byType[log.type]++

    if (log.latency) {
      totalLatency += log.latency
      latencyCount++
    }

    if (log.level === LogLevel.ERROR) {
      errorCount++
    }
  })

  stats.averageLatency = latencyCount > 0 ? totalLatency / latencyCount : 0
  stats.errorRate = logs.length > 0 ? errorCount / logs.length : 0

  return stats
}
