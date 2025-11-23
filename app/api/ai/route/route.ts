
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * AI Router API
 * 
 * Endpoint for routing AI requests through multi-tenant router
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiRouter } from '@/lib/ai/multi-tenant-router'
import { identityEngine } from '@/lib/auth/identity-engine'


/**
 * POST /api/ai/route - Route AI request
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'write')

    if (!validation.valid || !validation.workspaceId) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, systemPrompt, maxTokens, temperature, metadata } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      )
    }

    const response = await aiRouter.route({
      workspaceId: validation.workspaceId,
      prompt,
      systemPrompt,
      maxTokens,
      temperature,
      metadata
    })

    return NextResponse.json({
      success: true,
      response
    })
  } catch (error: any) {
    console.error('Error routing AI request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to route AI request' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/route - Get available providers
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'read')

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const providers = await aiRouter.getAvailableProviders()

    return NextResponse.json({
      success: true,
      providers
    })
  } catch (error) {
    console.error('Error getting providers:', error)
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    )
  }
}
