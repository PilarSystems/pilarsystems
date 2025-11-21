/**
 * PILAR AUTOPILOT - Step 7: Run Smoke Tests
 * 
 * Runs basic smoke tests to verify integrations (optional)
 */

import { twilioAdapter } from '@/lib/integrations/twilio-adapter'
import { whatsappAdapter } from '@/lib/integrations/whatsapp-adapter'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { StepResult } from './ensure-subscription'

export async function runSmokeTests(
  workspaceId: string
): Promise<StepResult> {
  try {
    logger.info({ workspaceId }, 'Step 7: Running smoke tests')

    const results: string[] = []

    const twilioStatus = await twilioAdapter.getStatus(workspaceId)
    if (twilioStatus.ok && twilioStatus.data?.active) {
      results.push(`✓ Twilio: ${twilioStatus.data.number}`)
    } else {
      results.push('○ Twilio: Not configured')
    }

    const whatsappStatus = await whatsappAdapter.getStatus(workspaceId)
    if (whatsappStatus.ok && whatsappStatus.data?.connected) {
      results.push('✓ WhatsApp: Connected')
    } else {
      results.push('○ WhatsApp: Not configured')
    }

    const aiRulesCount = await prisma.aiRule.count({
      where: { workspaceId, active: true },
    })
    results.push(`✓ AI Rules: ${aiRulesCount} active`)

    await prisma.activityLog.create({
      data: {
        workspaceId,
        actionType: 'smoke_tests_completed',
        description: 'Provisioning smoke tests completed',
        metadata: {
          results,
        },
      },
    })

    logger.info({ workspaceId, results }, 'Smoke tests completed')

    return {
      name: 'run_smoke_tests',
      status: 'completed',
      details: results.join(', '),
    }
  } catch (error: any) {
    logger.error({ error, workspaceId }, 'Failed to run smoke tests')
    return {
      name: 'run_smoke_tests',
      status: 'failed',
      details: 'Failed to run smoke tests',
      error: error.message,
    }
  }
}
