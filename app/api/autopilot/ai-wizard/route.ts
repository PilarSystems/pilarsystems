/**
 * AI Wizard Autopilot API
 * 
 * Endpoints for automated AI configuration and optimization
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiWizardAutopilot } from '@/lib/autopilot/ai-wizard-autopilot'
import { identityEngine } from '@/lib/auth/identity-engine'

/**
 * POST /api/autopilot/ai-wizard - Auto-generate AI configuration
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'admin')

    if (!validation.valid || !validation.workspaceId) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, studioInfo, config } = body

    if (action === 'generate') {
      await aiWizardAutopilot.autoGenerateConfig(
        validation.workspaceId,
        studioInfo
      )

      return NextResponse.json({
        success: true,
        message: 'AI configuration generated'
      })
    } else if (action === 'optimize') {
      await aiWizardAutopilot.optimizeConfig(validation.workspaceId)

      return NextResponse.json({
        success: true,
        message: 'AI configuration optimized'
      })
    } else if (action === 'update_config') {
      await aiWizardAutopilot.updateConfig(validation.workspaceId, config)

      return NextResponse.json({
        success: true,
        message: 'Autopilot configuration updated'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: generate, optimize, or update_config' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error in AI wizard autopilot:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/autopilot/ai-wizard - Get autopilot configuration
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'read')

    if (!validation.valid || !validation.workspaceId) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const config = await aiWizardAutopilot.getConfig(validation.workspaceId)

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('Error getting AI wizard config:', error)
    return NextResponse.json(
      { error: 'Failed to get configuration' },
      { status: 500 }
    )
  }
}
