import { PrismaClient } from '@prisma/client'
import { createTenantAwarePrismaClient } from './prisma-tenant'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createTenantAwarePrismaClient> | undefined
}

const basePrisma = new PrismaClient()
export const prisma = globalForPrisma.prisma ?? createTenantAwarePrismaClient(basePrisma)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
