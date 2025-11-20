import { PrismaClient } from '@prisma/client'
import { getTenantContext } from './tenant/context'

const TENANT_SCOPED_MODELS = new Set([
  'user',
  'wizardProgress',
  'integration',
  'lead',
  'message',
  'callLog',
  'followup',
  'calendarEvent',
  'aiRule',
  'activityLog',
  'task',
  'provisioningJob',
  'twilioSubaccount',
  'whatsAppIntegration',
  'oAuthToken',
  'emailCredential',
  'n8nWorkflow',
  'auditLog',
  'conversationState'
])

function shouldScopeModel(model: string): boolean {
  return TENANT_SCOPED_MODELS.has(model.toLowerCase())
}

export function createTenantAwarePrismaClient(prismaClient: PrismaClient) {
  return prismaClient.$extends({
    name: 'tenantScope',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: any) {
          const context = getTenantContext()
          
          if (!context?.workspaceId || !shouldScopeModel(model)) {
            return query(args)
          }

          const readOps = ['findFirst', 'findMany', 'findUnique', 'count', 'aggregate', 'groupBy']
          const writeOps = ['update', 'updateMany', 'delete', 'deleteMany', 'upsert']

          if (readOps.includes(operation)) {
            const newArgs = {
              ...args,
              where: {
                ...(args.where || {}),
                workspaceId: context.workspaceId
              }
            }
            return query(newArgs)
          }

          if (operation === 'create') {
            const data = args.data || {}
            if (!data.workspaceId) {
              const newArgs = {
                ...args,
                data: {
                  ...data,
                  workspaceId: context.workspaceId
                }
              }
              return query(newArgs)
            }
            return query(args)
          }

          if (operation === 'createMany') {
            const data = Array.isArray(args.data) ? args.data : [args.data]
            const dataWithWorkspace = data.map((item: any) => ({
              ...item,
              workspaceId: item.workspaceId || context.workspaceId
            }))
            const newArgs = {
              ...args,
              data: dataWithWorkspace
            }
            return query(newArgs)
          }

          if (writeOps.includes(operation)) {
            const newArgs = {
              ...args,
              where: {
                ...(args.where || {}),
                workspaceId: context.workspaceId
              }
            }
            return query(newArgs)
          }

          return query(args)
        }
      }
    }
  })
}
