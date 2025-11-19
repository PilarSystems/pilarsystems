import { prisma } from './prisma'
import { logger } from './logger'

export interface AuditLogData {
  workspaceId?: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success?: boolean
  errorMessage?: string
}

/**
 * Audit logging service for security and compliance
 */
export class AuditService {
  /**
   * Log an action
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          workspaceId: data.workspaceId,
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          changes: data.changes || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success !== false,
          errorMessage: data.errorMessage,
        },
      })

      logger.info(
        {
          workspaceId: data.workspaceId,
          userId: data.userId,
          action: data.action,
          resource: data.resource,
        },
        'Audit log created'
      )
    } catch (error) {
      logger.error({ error, data }, 'Failed to create audit log')
    }
  }

  /**
   * Log provisioning action
   */
  async logProvisioning(
    workspaceId: string,
    action: string,
    resource: string,
    resourceId: string,
    success: boolean,
    error?: string
  ): Promise<void> {
    await this.log({
      workspaceId,
      action,
      resource,
      resourceId,
      success,
      errorMessage: error,
    })
  }

  /**
   * Log authentication action
   */
  async logAuth(
    userId: string,
    action: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    error?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource: 'auth',
      success,
      ipAddress,
      userAgent,
      errorMessage: error,
    })
  }

  /**
   * Log data access
   */
  async logDataAccess(
    workspaceId: string,
    userId: string,
    resource: string,
    resourceId: string,
    action: 'read' | 'create' | 'update' | 'delete'
  ): Promise<void> {
    await this.log({
      workspaceId,
      userId,
      action: `${resource}.${action}`,
      resource,
      resourceId,
    })
  }

  /**
   * Get audit logs for a workspace
   */
  async getWorkspaceLogs(
    workspaceId: string,
    options?: {
      limit?: number
      offset?: number
      action?: string
      resource?: string
      startDate?: Date
      endDate?: Date
    }
  ) {
    return prisma.auditLog.findMany({
      where: {
        workspaceId,
        ...(options?.action && { action: options.action }),
        ...(options?.resource && { resource: options.resource }),
        ...(options?.startDate &&
          options?.endDate && {
            createdAt: {
              gte: options.startDate,
              lte: options.endDate,
            },
          }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: options?.limit || 100,
      skip: options?.offset || 0,
    })
  }

  /**
   * Get audit logs for a user
   */
  async getUserLogs(
    userId: string,
    options?: {
      limit?: number
      offset?: number
    }
  ) {
    return prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: options?.limit || 100,
      skip: options?.offset || 0,
    })
  }
}

export const auditService = new AuditService()
