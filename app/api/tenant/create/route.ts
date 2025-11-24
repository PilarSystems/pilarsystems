/**
 * Tenant Creation API Route
 * 
 * Handles automatic tenant provisioning
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvisioningService } from '@/src/server/tenants/provisioning.service'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/tenant/create
 * 
 * Create a new tenant with full auto-provisioning
 * 
 * Request body:
 * {
 *   "studioName": "My Fitness Studio",
 *   "ownerEmail": "owner@studio.com",
 *   "password": "secure_password",
 *   "domain"?: "my-studio.pilarsystems.com"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "tenantId": "uuid",
 *   "ownerId": "uuid",
 *   "defaultConfig": {...},
 *   "status": "ready"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studioName, ownerEmail, password, domain } = body

    if (!studioName) {
      return NextResponse.json(
        { error: 'studioName is required' },
        { status: 400 }
      )
    }

    if (!ownerEmail) {
      return NextResponse.json(
        { error: 'ownerEmail is required' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'password is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(ownerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    logger.info({ studioName, ownerEmail, domain }, 'Creating tenant')

    const provisioningService = getProvisioningService()
    const result = await provisioningService.createTenant({
      studioName,
      ownerEmail,
      password,
      domain,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      )
    }

    logger.info({ tenantId: result.tenantId, studioName }, 'Tenant created successfully')

    return NextResponse.json({
      success: true,
      tenantId: result.tenantId,
      ownerId: result.ownerId,
      defaultConfig: result.defaultConfig,
      status: result.status,
    })

  } catch (error) {
    console.error('[API] Error in POST /api/tenant/create:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/tenant/create
 * 
 * Get endpoint documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/tenant/create',
    method: 'POST',
    description: 'Create a new tenant with automatic provisioning',
    body: {
      studioName: 'string (required) - Name of the fitness studio',
      ownerEmail: 'string (required) - Email of the studio owner',
      password: 'string (required) - Password (min 8 characters)',
      domain: 'string (optional) - Custom domain for the tenant',
    },
    response: {
      success: 'boolean',
      tenantId: 'string - UUID of created tenant',
      ownerId: 'string - UUID of owner user',
      defaultConfig: 'object - Default configuration',
      status: 'string - "ready"',
    },
    example: {
      request: {
        studioName: 'FitZone Berlin',
        ownerEmail: 'owner@fitzone-berlin.de',
        password: 'SecurePassword123!',
        domain: 'fitzone-berlin.pilarsystems.com',
      },
      response: {
        success: true,
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        ownerId: '660e8400-e29b-41d4-a716-446655440000',
        defaultConfig: {
          language: 'de',
          timezone: 'Europe/Berlin',
          voice: {
            model: 'tts-1',
            voice: 'alloy',
          },
          whatsapp: {
            autoReply: true,
          },
        },
        status: 'ready',
      },
    },
  })
}
