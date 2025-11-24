/**
 * Agent Update API Route
 * 
 * Update agent profile for tenant
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/agent/update
 * 
 * Update agent profile
 * 
 * Request body:
 * {
 *   "name": "Studio Assistant",
 *   "voiceModel": "tts-1",
 *   "language": "de",
 *   "tone": "friendly",
 *   "greeting": "...",
 *   "studioRules": [...],
 *   "prompt": "..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "profile": {...}
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, voiceModel, language, tone, greeting, studioRules, prompt } = body

    logger.info({ tenantId: session.tenantId }, 'Updating agent profile')

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!voiceModel || typeof voiceModel !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Voice model is required' },
        { status: 400 }
      )
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Language is required' },
        { status: 400 }
      )
    }

    if (!tone || typeof tone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Tone is required' },
        { status: 400 }
      )
    }

    if (!greeting || typeof greeting !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Greeting is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(studioRules)) {
      return NextResponse.json(
        { success: false, error: 'Studio rules must be an array' },
        { status: 400 }
      )
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const profile = await prisma.agentProfile.upsert({
      where: { tenantId: session.tenantId },
      update: {
        name,
        voiceModel,
        language,
        tone,
        greeting,
        studioRules,
        prompt,
      },
      create: {
        tenantId: session.tenantId,
        name,
        voiceModel,
        language,
        tone,
        greeting,
        studioRules,
        prompt,
      },
    })

    logger.info({ tenantId: session.tenantId, profileId: profile.id }, 'Agent profile updated successfully')

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        tenantId: profile.tenantId,
        name: profile.name,
        voiceModel: profile.voiceModel,
        language: profile.language,
        tone: profile.tone,
        greeting: profile.greeting,
        studioRules: profile.studioRules,
        prompt: profile.prompt,
        updatedAt: profile.updatedAt,
      },
    })

  } catch (error) {
    console.error('[AGENT] Error in POST /api/agent/update:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
