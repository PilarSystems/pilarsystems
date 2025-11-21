/**
 * PILAR AUTOPILOT - Step 5: Ensure Email Credentials
 * 
 * Sets up email credentials if provided (optional, idempotent)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt } from '@/lib/encryption'
import type { StepResult } from './ensure-subscription'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

export async function ensureEmailCredentials(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 5: Ensuring email credentials')

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
      return {
        name: 'ensure_email_credentials',
        status: 'skipped',
        details: 'Email not configured (ENV missing)',
      }
    }

    const existing = await prisma.emailCredential.findUnique({
      where: { workspaceId },
    })

    if (existing) {
      logger.info({ workspaceId }, 'Email credentials already exist')
      return {
        name: 'ensure_email_credentials',
        status: 'completed',
        details: 'Email credentials already configured',
      }
    }

    await prisma.emailCredential.create({
      data: {
        workspaceId,
        provider: 'custom',
        email: SMTP_USER,
        smtpHost: SMTP_HOST,
        smtpPort: parseInt(SMTP_PORT || '587'),
        username: SMTP_USER,
        password: encrypt(SMTP_PASSWORD),
        imapHost: SMTP_HOST,
        imapPort: 993,
      },
    })

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'email',
        },
      },
      create: {
        workspaceId,
        type: 'email',
        status: 'active',
        config: JSON.stringify({
          provider: 'custom',
          email: SMTP_USER,
        }),
      },
      update: {
        status: 'active',
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'email_credentials_configured',
        description: 'Email credentials configured',
        metadata: {
          provider: 'smtp',
          email: SMTP_USER,
        },
      },
    })

    logger.info({ workspaceId }, 'Email credentials ensured')

    return {
      name: 'ensure_email_credentials',
      status: 'completed',
      details: 'Email credentials configured',
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to ensure email credentials')
    return {
      name: 'ensure_email_credentials',
      status: 'failed',
      details: 'Failed to configure email',
      error: error.message,
    }
  }
}
