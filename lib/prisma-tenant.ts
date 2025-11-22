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

          if (operation === 'findUnique') {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            }
            return (prismaClient as any)[model].findFirst(newArgs)
          }

          if (['findFirst', 'findMany', 'count', 'aggregate', 'groupBy'].includes(operation)) {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
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

          if (operation === 'update') {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            }
            const result = await (prismaClient as any)[model].updateMany(newArgs)
            if (result.count === 0) {
              return null
            }
            return (prismaClient as any)[model].findFirst({
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            })
          }

          if (operation === 'updateMany') {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            }
            return query(newArgs)
          }

          if (operation === 'delete') {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            }
            const result = await (prismaClient as any)[model].deleteMany(newArgs)
            if (result.count === 0) {
              return null
            }
            return { ...args.where, workspaceId: context.workspaceId }
          }

          if (operation === 'deleteMany') {
            const newArgs = {
              ...args,
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            }
            return query(newArgs)
          }

          if (operation === 'upsert') {
            const existing = await (prismaClient as any)[model].findFirst({
              where: {
                AND: [
                  args.where || {},
                  { workspaceId: context.workspaceId }
                ]
              }
            })

            if (existing) {
              return (prismaClient as any)[model].updateMany({
                where: {
                  AND: [
                    args.where || {},
                    { workspaceId: context.workspaceId }
                  ]
                },
                data: args.update
              }).then(() => (prismaClient as any)[model].findFirst({
                where: {
                  AND: [
                    args.where || {},
                    { workspaceId: context.workspaceId }
                  ]
                }
              }))
            } else {
              // Create new record with workspaceId
              const createData = args.create || {}
              return (prismaClient as any)[model].create({
                data: {
                  ...createData,
                  workspaceId: createData.workspaceId || context.workspaceId
                }
              })
            }
          }

          return query(args)
        }
      }
    }
  })
}
