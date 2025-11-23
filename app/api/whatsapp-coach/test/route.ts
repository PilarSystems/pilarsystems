export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getCachedConfig } from '@/lib/config/env'
import { z } from 'zod'

const testSchema = z.object({
  workspaceId: z.string().uuid(),
  phoneNumber: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const config = getCachedConfig()
    
    if (!config.whatsappEnabled) {
      return NextResponse.json(
        {
          error: 'WhatsApp integration not configured',
          message: 'Bitte konfiguriere zuerst die WhatsApp-Verbindung',
        },
        { status: 501 }
      )
    }

    const body = await request.json()
    const data = testSchema.parse(body)

    const formattedNumber = data.phoneNumber.replace(/[\s\-\(\)]/g, '')

    if (!formattedNumber.match(/^\+\d{10,15}$/)) {
      return NextResponse.json(
        { error: 'Ungültiges Telefonnummer-Format. Bitte verwende das Format: +491234567890' },
        { status: 400 }
      )
    }

    const whatsappToken = process.env.WHATSAPP_API_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!whatsappToken || !phoneNumberId) {
      return NextResponse.json(
        { error: 'WhatsApp credentials not configured' },
        { status: 501 }
      )
    }

    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedNumber,
          type: 'text',
          text: {
            body: '🎉 Test erfolgreich! Dein WhatsApp-Coach ist jetzt verbunden und bereit, deine Mitglieder zu unterstützen. 💪',
          },
        }),
      }
    )

    if (!whatsappResponse.ok) {
      const errorData = await whatsappResponse.json()
      logger.error({ error: errorData }, 'WhatsApp API error')
      
      return NextResponse.json(
        { 
          error: 'WhatsApp API Fehler',
          details: errorData.error?.message || 'Unbekannter Fehler',
        },
        { status: 500 }
      )
    }

    const result = await whatsappResponse.json()

    logger.info(
      { workspaceId: data.workspaceId, phoneNumber: formattedNumber },
      'WhatsApp test message sent'
    )

    return NextResponse.json({
      success: true,
      messageId: result.messages?.[0]?.id,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send WhatsApp test message')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send test message' },
      { status: 500 }
    )
  }
}
