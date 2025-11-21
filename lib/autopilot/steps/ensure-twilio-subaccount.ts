/**
 * PILAR AUTOPILOT - Step 2: Ensure Twilio Subaccount
 * 
 * Creates Twilio subaccount for workspace (idempotent)
 */

import { twilioAdapter } from '@/lib/integrations/twilio-adapter'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { StepResult } from './ensure-subscription'

export async function ensureTwilioSubaccount(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 2: Ensuring Twilio subaccount')

    const result = await twilioAdapter.ensureSubaccount(workspaceId)

    if (!result.ok) {
      if (result.code === 'INTEGRATION_OFFLINE') {
        return {
          name: 'ensure_twilio_subaccount',
          status: 'skipped',
          details: 'Twilio not configured (ENV missing)',
        }
      }

      return {
        name: 'ensure_twilio_subaccount',
        status: 'failed',
        details: result.error || 'Failed to create Twilio subaccount',
        error: result.code,
      }
    }

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'twilio_subaccount_created',
        description: 'Twilio subaccount provisioned',
        metadata: {
          subaccountSid: result.data?.subaccountSid,
        },
      },
    })

    logger.info(
      {
        workspaceId,
        subaccountSid: result.data?.subaccountSid,
      },
      'Twilio subaccount ensured'
    )

    return {
      name: 'ensure_twilio_subaccount',
      status: 'completed',
      details: `Twilio subaccount created: ${result.data?.subaccountSid}`,
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to ensure Twilio subaccount')
    return {
      name: 'ensure_twilio_subaccount',
      status: 'failed',
      details: 'Failed to create Twilio subaccount',
      error: error.message,
    }
  }
}
