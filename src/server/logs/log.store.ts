/**
 * Log Store
 * 
 * In-memory store for message logs with tenant isolation.
 * For production, this should be replaced with a database or Redis.
 */

import { MessageLog, LogFilter } from './log.types'

class LogStore {
  private logs: Map<string, MessageLog[]> = new Map()
  private maxLogsPerTenant = 1000

  /**
   * Append a log entry
   */
  append(log: MessageLog): void {
    const tenantLogs = this.logs.get(log.tenantId) || []
    
    tenantLogs.unshift(log)
    
    if (tenantLogs.length > this.maxLogsPerTenant) {
      tenantLogs.pop()
    }
    
    this.logs.set(log.tenantId, tenantLogs)
  }

  /**
   * Get logs with filtering
   */
  getLogs(filter: LogFilter): MessageLog[] {
    const tenantLogs = this.logs.get(filter.tenantId || '') || []
    
    let filtered = tenantLogs
    
    if (filter.channel) {
      filtered = filtered.filter(log => log.channel === filter.channel)
    }
    
    if (filter.level) {
      filtered = filtered.filter(log => log.level === filter.level)
    }
    
    if (filter.type) {
      filtered = filtered.filter(log => log.type === filter.type)
    }
    
    if (filter.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filter.startDate!)
    }
    
    if (filter.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filter.endDate!)
    }
    
    if (filter.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId)
    }
    
    if (filter.sessionId) {
      filtered = filtered.filter(log => log.sessionId === filter.sessionId)
    }
    
    const offset = filter.offset || 0
    const limit = filter.limit || 100
    
    return filtered.slice(offset, offset + limit)
  }

  /**
   * Get log by ID
   */
  getLogById(tenantId: string, logId: string): MessageLog | undefined {
    const tenantLogs = this.logs.get(tenantId) || []
    return tenantLogs.find(log => log.id === logId)
  }

  /**
   * Clear logs for a tenant
   */
  clearLogs(tenantId: string): void {
    this.logs.delete(tenantId)
  }

  /**
   * Get total log count for a tenant
   */
  getLogCount(tenantId: string): number {
    return (this.logs.get(tenantId) || []).length
  }

  /**
   * Get all tenant IDs with logs
   */
  getTenantIds(): string[] {
    return Array.from(this.logs.keys())
  }
}

let logStoreInstance: LogStore | null = null

export function getLogStore(): LogStore {
  if (!logStoreInstance) {
    logStoreInstance = new LogStore()
  }
  return logStoreInstance
}
