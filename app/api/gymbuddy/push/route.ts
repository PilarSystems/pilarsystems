/**
 * POST /api/gymbuddy/push
 * 
 * Send push notification to user.
 */

import { NextRequest, NextResponse } from 'next/server'
import { gymBuddyService } from '@/src/server/gymbuddy/gymBuddy.service'
import { gymBuddyRouter } from '@/src/server/gymbuddy/gymBuddy.router'
import {
  shouldSendPush,
  generatePushMessage,
  schedulePushMessage,
} from '@/src/server/gymbuddy/gymBuddy.push'
import { PushTrigger } from '@/src/server/gymbuddy/gymBuddy.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, trigger, immediate = false } = body

    if (!userId || !trigger) {
      return NextResponse.json(
        { error: 'userId and trigger are required' },
        { status: 400 }
      )
    }

    const profile = await gymBuddyService.getProfile(userId)
    const config = await gymBuddyService.getConfig(userId)
    const state = await gymBuddyService.getState(userId)

    if (!profile || !config || !state) {
      return NextResponse.json(
        { error: 'User not found or not fully configured' },
        { status: 404 }
      )
    }

    const context = {
      profile,
      state,
      schedule: config.pushSchedule,
      timezone: config.timezone,
    }

    if (!immediate && !shouldSendPush(trigger as PushTrigger, context)) {
      return NextResponse.json({
        success: true,
        sent: false,
        reason: 'Push conditions not met',
      })
    }

    const content = generatePushMessage(trigger as PushTrigger, context)

    if (immediate) {
      await gymBuddyRouter.handlePushNotification(userId, trigger, content)

      return NextResponse.json({
        success: true,
        sent: true,
        content,
      })
    } else {
      const scheduledAt = new Date(Date.now() + 60000) // 1 minute from now
      const pushMessage = schedulePushMessage(userId, trigger as PushTrigger, content, scheduledAt)
      
      await gymBuddyService.schedulePushMessage({
        userId,
        trigger,
        content,
        scheduledAt,
      })

      return NextResponse.json({
        success: true,
        scheduled: true,
        scheduledAt,
        content,
      })
    }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    )
  }
}
