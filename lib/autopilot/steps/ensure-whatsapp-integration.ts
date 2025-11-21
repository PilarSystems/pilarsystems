/**
 * PILAR AUTOPILOT - Step 4: Ensure WhatsApp Integration
 * 
 * Sets up WhatsApp integration from ENV (idempotent)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt } from '@/lib/encryption'
import type { StepResult } from './ensure-subscription'

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID

export async function ensureWhatsAppIntegration(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 4: Ensuring WhatsApp integration')

    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      return {
        name: 'ensure_whatsapp_integration',
        status: 'skipped',
        details: 'WhatsApp not configured (ENV missing)',
      }
    }

    const existing = await prisma.whatsAppIntegration.findUnique({
      where: { workspaceId },
    })

    if (existing && existing.phoneNumberId && existing.accessToken) {
      logger.info({ workspaceId }, 'WhatsApp integration already exists')
      
      await prisma.integration.upsert({
        where: {
          workspaceId_type: {
            workspaceId,
            type: 'whatsapp',
          },
        },
        create: {
          workspaceId,
          type: 'whatsapp',
          status: 'active',
          config: JSON.stringify({
            phoneNumberId: existing.phoneNumberId,
          }),
        },
        update: {
          status: 'active',
        },
      })

      return {
        name: 'ensure_whatsapp_integration',
        status: 'completed',
        details: 'WhatsApp integration already configured',
      }
    }

    await prisma.whatsAppIntegration.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID || '',
        phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        phoneNumber: '', // Will be populated when number is purchased
        accessToken: encrypt(WHATSAPP_API_TOKEN),
        webhookVerifyToken: WHATSAPP_VERIFY_TOKEN || '',
      },
      update: {
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID || '',
        phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        phoneNumber: '', // Will be populated when number is purchased
        accessToken: encrypt(WHATSAPP_API_TOKEN),
        webhookVerifyToken: WHATSAPP_VERIFY_TOKEN || '',
      },
    })

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'whatsapp',
        },
      },
      create: {
        workspaceId,
        type: 'whatsapp',
        status: 'active',
        config: JSON.stringify({
          phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        }),
      },
      update: {
        status: 'active',
        config: JSON.stringify({
          phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        }),
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'whatsapp_integration_configured',
        description: 'WhatsApp integration configured',
        metadata: {
          phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        },
      },
    })

    logger.info({ workspaceId }, 'WhatsApp integration ensured')

    return {
      name: 'ensure_whatsapp_integration',
      status: 'completed',
      details: 'WhatsApp integration configured',
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to ensure WhatsApp integration')
    return {
      name: 'ensure_whatsapp_integration',
      status: 'failed',
      details: 'Failed to configure WhatsApp',
      error: error.message,
    }
  }
}
