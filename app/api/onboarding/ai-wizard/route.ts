/**
 * PILAR AUTOPILOT v5.0 - AI-Onboarding Wizard Endpoint
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { generateWizardConfig, saveWizardConfig, runWizardSmokeTests, WizardInputSchema } from '@/lib/onboarding/ai-wizard'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workspaceId, ...input } = body

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'workspaceId required' },
        { status: 400 }
      )
    }

    const validatedInput = WizardInputSchema.parse(input)

    logger.info({ workspaceId }, 'AI wizard started')

    const config = await generateWizardConfig(workspaceId, validatedInput)

    await saveWizardConfig(workspaceId, config)

    const smokeTests = await runWizardSmokeTests(workspaceId)

    return NextResponse.json({
      success: true,
      config,
      smokeTests,
    })
  } catch (error: any) {
    logger.error({ error }, 'AI wizard endpoint failed')
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
