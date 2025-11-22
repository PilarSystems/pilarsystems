/**
 * Email Webhook API Route (STUB)
 */

import { NextRequest, NextResponse } from 'next/server'
import { processEmailWebhook } from '@/src/server/webhooks/emailWebhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const searchParams = request.nextUrl.searchParams
    const queryParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const result = await processEmailWebhook(body, queryParams)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        response: result.response,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in POST /api/webhooks/email:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
