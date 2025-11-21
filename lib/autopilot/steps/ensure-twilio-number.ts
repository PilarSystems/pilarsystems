/**
 * PILAR AUTOPILOT - Step 3: Ensure Twilio Number
 * 
 * Purchases phone number and sets webhooks (idempotent)
 */

import { twilioAdapter } from '@/lib/integrations/twilio-adapter'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { StepResult } from './ensure-subscription'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.com'

export async function ensureTwilioNumber(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 3: Ensuring Twilio number')

    const subaccount = await prisma.twilioSubaccount.findUnique({
      where: { workspaceId },
    })

    if (!subaccount || !subaccount.subaccountSid) {
      return {
        name: 'ensure_twilio_number',
        status: 'skipped',
        details: 'Twilio subaccount not found, skipping number purchase',
      }
    }

    const numberResult = await twilioAdapter.ensureNumber(workspaceId, {
      country: 'DE', // Default to Germany
      type: 'local',
    })

    if (!numberResult.ok) {
      if (numberResult.code === 'INTEGRATION_OFFLINE') {
        return {
          name: 'ensure_twilio_number',
          status: 'skipped',
          details: 'Twilio not configured',
        }
      }

      return {
        name: 'ensure_twilio_number',
        status: 'failed',
        details: numberResult.error || 'Failed to purchase number',
        error: numberResult.code,
      }
    }

    const webhookResult = await twilioAdapter.setWebhooks(workspaceId, {
      voice: `${APP_URL}/api/webhooks/twilio`,
      messaging: `${APP_URL}/api/webhooks/twilio`,
    })

    if (!webhookResult.ok) {
      logger.warn(
        { workspaceId, error: webhookResult.error },
        'Failed to set webhooks, but number purchased'
      )
    }

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'phone',
        },
      },
      create: {
        workspaceId,
        type: 'phone',
        status: 'active',
        config: JSON.stringify({
          phoneNumber: numberResult.data?.phoneNumber,
          phoneNumberSid: numberResult.data?.phoneNumberSid,
        }),
      },
      update: {
        status: 'active',
        config: JSON.stringify({
          phoneNumber: numberResult.data?.phoneNumber,
          phoneNumberSid: numberResult.data?.phoneNumberSid,
        }),
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'twilio_number_purchased',
        description: `Phone number purchased: ${numberResult.data?.phoneNumber}`,
        metadata: {
          phoneNumber: numberResult.data?.phoneNumber,
          phoneNumberSid: numberResult.data?.phoneNumberSid,
        },
      },
    })

    logger.info(
      {
        workspaceId,
        phoneNumber: numberResult.data?.phoneNumber,
      },
      'Twilio number ensured'
    )

    return {
      name: 'ensure_twilio_number',
      status: 'completed',
      details: `Phone number purchased: ${numberResult.data?.phoneNumber}`,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to ensure Twilio number')
    return {
      name: 'ensure_twilio_number',
      status: 'failed',
      details: 'Failed to purchase phone number',
      error: error.message,
    }
  }
}
