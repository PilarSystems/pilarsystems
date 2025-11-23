/**
 * POST /api/gymbuddy/message
 * 
 * Handle incoming message from user.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { gymBuddyRouter } = await import('@/src/server/gymbuddy/gymBuddy.router')
    
    const body = await request.json()
    const { userId, content, channel = 'whatsapp' } = body

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'userId and content are required' },
        { status: 400 }
      )
    }

    const response = await gymBuddyRouter.handleMessage(
      userId,
      content,
      channel
    )

    return NextResponse.json({
      success: true,
      response: response.content,
      personalityStyle: response.personalityStyle,
      intent: response.intent,
      actions: response.actions,
    })
  } catch (error) {
    console.error('Error handling Gym Buddy message:', error)
    return NextResponse.json(
      { error: 'Failed to handle message' },
      { status: 500 }
    )
  }
}
