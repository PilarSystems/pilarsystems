import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email-contact'
import { getConfig } from '@/lib/config/env'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  studioName: z.string().min(2, 'Studio-Name muss mindestens 2 Zeichen lang sein'),
  studioSize: z.string().min(1, 'Bitte wähle eine Studio-Größe'),
  location: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        studioName: data.studioName,
        studioSize: data.studioSize,
        location: data.location,
        message: data.message,
        source: data.source || 'contact-form',
        ipAddress,
        userAgent,
        status: 'new',
      },
    })

    logger.info(
      { 
        contactRequestId: contactRequest.id, 
        email: data.email, 
        studioName: data.studioName 
      }, 
      'Contact request created'
    )

    const config = getConfig()
    if (config.contactEmailEnabled) {
      const notificationSent = await sendContactNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        studioName: data.studioName,
        studioSize: data.studioSize,
        location: data.location,
        message: data.message,
      })

      const confirmationSent = await sendContactConfirmation(data.email, data.name)

      logger.info(
        { 
          contactRequestId: contactRequest.id,
          notificationSent,
          confirmationSent
        },
        'Email notifications processed'
      )
    } else {
      logger.info('Email notifications skipped - service not configured')
    }

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei dir.',
      id: contactRequest.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validierungsfehler',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    logger.error({ error }, 'Failed to process contact request')
    return NextResponse.json(
      {
        success: false,
        error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      },
      { status: 500 }
    )
  }
}
