import { AsyncLocalStorage } from 'async_hooks'

export interface TenantContext {
  workspaceId: string
  userId?: string
}

export const tenantContext = new AsyncLocalStorage<TenantContext>()

export function getTenantContext(): TenantContext | undefined {
  return tenantContext.getStore()
}

export function getWorkspaceId(): string {
  const context = getTenantContext()
  if (!context?.workspaceId) {
    throw new Error('No tenant context available. Ensure withTenant wrapper is used.')
  }
  return context.workspaceId
}

export function getWorkspaceIdOrNull(): string | null {
  const context = getTenantContext()
  return context?.workspaceId || null
}
