/**
 * WhatsApp Send API Route
 * 
 * Test endpoint for sending WhatsApp messages
 */

import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppEngine } from '@/src/server/core/whatsapp/whatsappEngine.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/whatsapp/send
 * 
 * Send a WhatsApp message
 * 
 * Request body:
 * {
 *   "phone": "491234567890",
 *   "message": "Hello from PILAR SYSTEMS!",
 *   "tenantId"?: "tenant_123"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message, tenantId } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'phone is required' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    const engine = getWhatsAppEngine()
    const result = await engine.sendMessage(
      tenantId || 'default',
      phone,
      message
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        phone,
        message,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('[API] Error in POST /api/whatsapp/send:', error)

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
 * GET /api/whatsapp/send
 * 
 * Test endpoint info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/whatsapp/send',
    method: 'POST',
    description: 'Send a WhatsApp message',
    body: {
      phone: 'string (required) - Phone number with country code',
      message: 'string (required) - Message text',
      tenantId: 'string (optional) - Tenant ID',
    },
    example: {
      phone: '491234567890',
      message: 'Hello from PILAR SYSTEMS!',
      tenantId: 'default',
    },
  })
}
