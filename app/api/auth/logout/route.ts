/**
 * Logout API Route
 * 
 * Clear session cookie
 */

import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/src/lib/auth'
import { logger } from '@/lib/logger'

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
    logger.info('Logout request')

    await clearSessionCookie()

    logger.info('Logout successful')

    return NextResponse.json({
      success: true,
    })

  } catch (error) {
    logger.error({ error }, 'Error in logout')

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
