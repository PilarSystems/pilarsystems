/**
 * Logout API Route
 * 
 * Clear session cookie
 */

import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/src/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/logout
 * 
 * Logout and clear session
 * 
 * Response:
 * {
 *   "success": true
 * }
 */
export async function POST() {
  try {
    console.log('[AUTH] Logout request')

    await clearSessionCookie()

    console.log('[AUTH] Logout successful')

    return NextResponse.json({
      success: true,
    })

  } catch (error) {
    console.error('[AUTH] Error in POST /api/auth/logout:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
