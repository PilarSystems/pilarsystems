/**
 * POST /api/gymbuddy/start
 * 
 * Start Gym Buddy onboarding for a new user.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { gymBuddyService } = await import('@/src/server/gymbuddy/gymBuddy.service')
    const { getOnboardingQuestion } = await import('@/src/server/gymbuddy/gymBuddy.onboarding')
    const { OnboardingStep } = await import('@/src/server/gymbuddy/gymBuddy.types')
    
    const body = await request.json()
    const { userId, phoneNumber } = body

    if (!userId || !phoneNumber) {
      return NextResponse.json(
        { error: 'userId and phoneNumber are required' },
        { status: 400 }
      )
    }

    let profile = await gymBuddyService.getProfile(userId)

    if (!profile) {
      profile = await gymBuddyService.startOnboarding(userId, phoneNumber)
    }

    const welcomeQuestion = getOnboardingQuestion(OnboardingStep.WELCOME)

    return NextResponse.json({
      success: true,
      profile,
      message: welcomeQuestion.question,
      step: profile.onboardingStep,
      completed: profile.onboardingCompleted,
    })
  } catch (error) {
    console.error('Error starting Gym Buddy:', error)
    return NextResponse.json(
      { error: 'Failed to start Gym Buddy' },
      { status: 500 }
    )
  }
}
