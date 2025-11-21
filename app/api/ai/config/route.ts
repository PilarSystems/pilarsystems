/**
 * AI Router Configuration API
 * 
 * Endpoints for managing AI router configuration per workspace
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiRouter } from '@/lib/ai/multi-tenant-router'
import { identityEngine } from '@/lib/auth/identity-engine'

export const runtime = 'nodejs'

/**
 * PUT /api/ai/config - Update AI router configuration
 */
export async function PUT(request: NextRequest) {
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
    const { primaryProvider, primaryModel, fallbackProviders, maxRetries, timeoutMs } = body

    await aiRouter.updateConfig(validation.workspaceId, {
      primaryProvider,
      primaryModel,
      fallbackProviders,
      maxRetries,
      timeoutMs
    })

    return NextResponse.json({
      success: true,
      message: 'AI router configuration updated'
    })
  } catch (error: any) {
    console.error('Error updating AI config:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update configuration' },
      { status: 500 }
    )
  }
}
