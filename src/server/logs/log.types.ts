/**
 * Log Types
 * 
 * TypeScript types for the Live Message Console logging system.
 */

import { Channel, Intent, Module } from '../orchestrator/orchestrator.types'

export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

export enum LogType {
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_SENT = 'message_sent',
  INTENT_DETECTED = 'intent_detected',
  ROUTING_DECISION = 'routing_decision',
  MODULE_EXECUTION = 'module_execution',
  AI_RESPONSE = 'ai_response',
  ERROR = 'error',
  SYSTEM = 'system',
}

export interface MessageLog {
  id: string
  tenantId: string
  timestamp: Date
  level: LogLevel
  type: LogType
  channel: Channel
  
  userId?: string
  userName?: string
  phoneNumber?: string
  email?: string
  sessionId?: string
  callId?: string
  
  messageId?: string
  content?: string
  
  intent?: Intent
  intentConfidence?: number
  entities?: Record<string, any>
  
  module?: Module
  routingParams?: Record<string, any>
  
  response?: string
  responseMetadata?: Record<string, any>
  
  latency?: number
  processingTime?: number
  
  error?: string
  errorStack?: string
  
  rawRequest?: any
  rawResponse?: any
  
  metadata?: Record<string, any>
}

export interface LogFilter {
  tenantId?: string
  channel?: Channel
  level?: LogLevel
  type?: LogType
  startDate?: Date
  endDate?: Date
  userId?: string
  sessionId?: string
  limit?: number
  offset?: number
}

export interface LogStats {
  totalLogs: number
  byChannel: Record<Channel, number>
  byLevel: Record<LogLevel, number>
  byType: Record<LogType, number>
  averageLatency: number
  errorRate: number
}
