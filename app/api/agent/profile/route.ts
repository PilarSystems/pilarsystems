/**
 * Agent Profile API Route
 * 
 * Get agent profile for tenant
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'
import { DEFAULT_AGENT_PROMPT } from '@/src/server/orchestrator/prompts/defaultAgentPrompt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/agent/profile
 * 
 * Get agent profile for current tenant
 * Creates default profile if not exists
 * 
 * Response:
 * {
 *   "success": true,
 *   "profile": {
 *     "id": "uuid",
 *     "tenantId": "uuid",
 *     "name": "Studio Assistant",
 *     "voiceModel": "tts-1",
 *     "language": "de",
 *     "tone": "friendly",
 *     "greeting": "...",
 *     "studioRules": [...],
 *     "prompt": "..."
 *   }
 * }
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(`[AGENT] Getting profile for tenant: ${session.tenantId}`)

    let profile = await prisma.agentProfile.findUnique({
      where: { tenantId: session.tenantId },
    })

    if (!profile) {
      console.log(`[AGENT] Creating default profile for tenant: ${session.tenantId}`)

      profile = await prisma.agentProfile.create({
        data: {
          tenantId: session.tenantId,
          name: 'Studio Assistant',
          voiceModel: 'tts-1',
          language: 'de',
          tone: 'friendly',
          greeting: 'Hey! 👋 Willkommen bei unserem Fitnessstudio. Wie kann ich dir helfen?',
          studioRules: [
            'Sei immer freundlich und hilfsbereit',
            'Antworte auf Deutsch',
            'Verwende die Du-Form',
            'Sei motivierend und positiv',
            'Gib konkrete Informationen',
            'Frage nach, wenn etwas unklar ist',
            'Biete Probetraining an',
            'Erwähne unsere Öffnungszeiten bei Bedarf',
          ],
          prompt: DEFAULT_AGENT_PROMPT.systemPrompt,
        },
      })
    }

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
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    })

  } catch (error) {
    console.error('[AGENT] Error in GET /api/agent/profile:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
