/**
 * Twilio SMS Status Webhook
 * Handles delivery status updates for SMS messages
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { smsService } from '@/services/multichannel/sms.service'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const messageSid = formData.get('MessageSid') as string
    const messageStatus = formData.get('MessageStatus') as string
    const errorCode = formData.get('ErrorCode') as string | undefined
    const errorMessage = formData.get('ErrorMessage') as string | undefined

    logger.info(
      { messageSid, messageStatus, errorCode },
      'Received SMS status webhook'
    )

    await smsService.updateMessageStatus(
      messageSid,
      messageStatus,
      errorCode || undefined,
      errorMessage || undefined
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'SMS status webhook error')
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
