/**
 * Database Client Module
 * 
 * This module provides access to the Prisma database client.
 * Currently bridges to the existing lib/prisma.ts client to avoid
 * duplicate client instantiation.
 */

export { prisma } from '@/lib/prisma';

export type { PrismaClient } from '@prisma/client';
