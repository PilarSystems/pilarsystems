/**
 * Login API Route
 * 
 * Authenticate tenant owner with email + password
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/server/db/client'
import bcrypt from 'bcryptjs'
import { signToken, setSessionCookie } from '@/src/lib/auth'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/login
 * 
 * Login with email and password
 * 
 * Request body:
 * {
 *   "email": "owner@studio.com",
 *   "password": "password123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "tenantId": "uuid",
 *   "ownerId": "uuid",
 *   "email": "owner@studio.com",
 *   "tenantName": "Studio Name"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    logger.info({ email }, 'Login attempt')

    const owner = await prisma.tenantUser.findFirst({
      where: { email },
      include: {
        tenant: true,
      },
    })

    if (!owner) {
      logger.warn({ email }, 'User not found')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const passwordValid = await bcrypt.compare(password, owner.passwordHash)

    if (!passwordValid) {
      logger.warn({ email }, 'Invalid password')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    logger.info({ email, tenantId: owner.tenantId }, 'Login successful')

    const token = await signToken({
      tenantId: owner.tenantId,
      ownerId: owner.id,
      email: owner.email,
      role: owner.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      tenantId: owner.tenantId,
      ownerId: owner.id,
      email: owner.email,
      tenantName: owner.tenant.name,
    })

  } catch (error) {
    console.error('[AUTH] Error in POST /api/auth/login:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
