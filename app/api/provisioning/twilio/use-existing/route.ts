export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getCachedConfig } from '@/lib/config/env'
import { connectTwilio } from '@/services/integrations/twilio'
import { z } from 'zod'
import twilio from 'twilio'

const useExistingSchema = z.object({
  workspaceId: z.string().uuid(),
  accountSid: z.string().min(1),
  authToken: z.string().min(1),
  phoneNumber: z.string().min(1),
  phoneNumberSid: z.string().min(1),
})

/**
 * Connect an existing Twilio number to a workspace
 * User provides their own Twilio credentials and phone number
 */
export async function POST(request: NextRequest) {
  try {
    const config = getCachedConfig()
    if (!config.encryptionReady) {
      logger.warn('Use existing Twilio number requested but encryption not configured')
      return NextResponse.json(
        {
          error: 'Encryption not available',
          code: 'FEATURE_ENCRYPTION_DISABLED',
          message: 'Verschlüsselung ist nicht konfiguriert. Credentials können nicht sicher gespeichert werden. Bitte kontaktiere den Admin.',
        },
        { status: 501 }
      )
    }

    const body = await request.json()
    const data = useExistingSchema.parse(body)

    logger.info(
      { workspaceId: data.workspaceId },
      'Connecting existing Twilio number'
    )

    let client: twilio.Twilio
    try {
      client = twilio(data.accountSid, data.authToken)
      await client.api.accounts(data.accountSid).fetch()
    } catch (error) {
      logger.error({ error, workspaceId: data.workspaceId }, 'Invalid Twilio credentials')
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          message: 'Die angegebenen Twilio-Zugangsdaten sind ungültig. Bitte überprüfe Account SID und Auth Token.',
        },
        { status: 400 }
      )
    }

    try {
      const phoneNumber = await client.incomingPhoneNumbers(data.phoneNumberSid).fetch()
      
      if (phoneNumber.phoneNumber !== data.phoneNumber) {
        return NextResponse.json(
          {
            error: 'Phone number mismatch',
            message: 'Die angegebene Telefonnummer stimmt nicht mit der Phone Number SID überein.',
          },
          { status: 400 }
        )
      }
    } catch (error) {
      logger.error({ error, workspaceId: data.workspaceId }, 'Phone number not found')
      return NextResponse.json(
        {
          error: 'Phone number not found',
          message: 'Die angegebene Telefonnummer wurde nicht in deinem Twilio-Account gefunden.',
        },
        { status: 400 }
      )
    }

    try {
      const appUrl = config.appUrl
      await client.incomingPhoneNumbers(data.phoneNumberSid).update({
        voiceUrl: `${appUrl}/api/webhooks/twilio`,
        voiceMethod: 'POST',
        statusCallback: `${appUrl}/api/webhooks/twilio/status`,
        statusCallbackMethod: 'POST',
        smsUrl: `${appUrl}/api/webhooks/twilio`,
        smsMethod: 'POST',
      })

      logger.info(
        { workspaceId: data.workspaceId, phoneNumber: data.phoneNumber },
        'Webhooks configured successfully'
      )
    } catch (error) {
      logger.error({ error, workspaceId: data.workspaceId }, 'Failed to configure webhooks')
      return NextResponse.json(
        {
          error: 'Webhook configuration failed',
          message: 'Webhooks konnten nicht konfiguriert werden. Stelle sicher, dass du die nötigen Berechtigungen hast.',
        },
        { status: 400 }
      )
    }

    await connectTwilio(data.workspaceId, {
      accountSid: data.accountSid,
      authToken: data.authToken,
      phoneNumber: data.phoneNumber,
      voicemailEnabled: true,
    })

    logger.info(
      { workspaceId: data.workspaceId, phoneNumber: data.phoneNumber },
      'Existing Twilio number connected successfully'
    )

    return NextResponse.json({
      success: true,
      data: {
        phoneNumber: data.phoneNumber,
        phoneNumberSid: data.phoneNumberSid,
        webhooksConfigured: true,
      },
    })
  } catch (error) {
    logger.error({ error }, 'Failed to connect existing Twilio number')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Connection failed',
        message: 'Verbindung fehlgeschlagen. Bitte versuche es erneut.',
      },
      { status: 500 }
    )
  }
}
