/**
 * GET /api/gymbuddy/me
 * 
 * Get current user's Gym Buddy profile, config, state, and messages.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const profile = await gymBuddyService.getProfile(userId)
    const config = await gymBuddyService.getConfig(userId)
    const state = await gymBuddyService.getState(userId)
    const messages = await gymBuddyService.getMessages(userId, 50)
    const stats = await gymBuddyService.getStats(userId)

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile,
      config,
      state,
      messages,
      stats,
    })
  } catch (error) {
    console.error('Error getting Gym Buddy profile:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}
