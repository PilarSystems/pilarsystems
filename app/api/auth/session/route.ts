/**
 * Session API Route
 * 
 * Get current session information
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { prisma } from '@/src/server/db/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/session
 * 
 * Get current session
 * 
 * Response:
 * {
 *   "authenticated": true,
 *   "tenantId": "uuid",
 *   "ownerId": "uuid",
 *   "email": "owner@studio.com",
 *   "tenantName": "Studio Name",
 *   "role": "owner"
 * }
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({
        authenticated: false,
      })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: session.tenantId },
      select: {
        id: true,
        name: true,
        domain: true,
      },
    })

    if (!tenant) {
      return NextResponse.json({
        authenticated: false,
      })
    }

    return NextResponse.json({
      authenticated: true,
      tenantId: session.tenantId,
      ownerId: session.ownerId,
      email: session.email,
      role: session.role,
      tenantName: tenant.name,
      tenantDomain: tenant.domain,
    })

  } catch (error) {
    console.error('[AUTH] Error in GET /api/auth/session:', error)

    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
