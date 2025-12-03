/**
 * Email Tracking Webhook
 * Handles email open tracking via tracking pixel
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { emailOutreachService } from '@/services/multichannel/email.service'
import { logger } from '@/lib/logger'

// 1x1 transparent GIF pixel
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(request: NextRequest) {
  try {
    const trackingId = request.nextUrl.searchParams.get('id')

    if (trackingId) {
      logger.info({ trackingId }, 'Email open tracked')
      
      // Track the open asynchronously (don't block response)
      emailOutreachService.trackEmailOpen(trackingId).catch((error) => {
        logger.error({ error, trackingId }, 'Failed to track email open')
      })
    }

    // Return tracking pixel
    return new NextResponse(TRACKING_PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': String(TRACKING_PIXEL.length),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    logger.error({ error }, 'Email tracking error')
    // Still return pixel even on error
    return new NextResponse(TRACKING_PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
      },
    })
  }
}
