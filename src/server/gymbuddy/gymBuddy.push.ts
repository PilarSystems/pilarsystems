/**
 * Gym Buddy Push Engine
 * 
 * Time-based and trigger-based push notifications.
 */

import {
  PushTrigger,
  BuddyPushMessage,
  PersonalityStyle,
  BuddyProfile,
  BuddyState,
} from './gymBuddy.types'
import { generatePersonalizedMessage } from './gymBuddy.personality'

export interface PushSchedule {
  morning?: string
  afternoon?: string
  evening?: string
}

export interface PushContext {
  profile: BuddyProfile
  state: BuddyState
  schedule: PushSchedule
  timezone: string
}

export function shouldSendPush(
  trigger: PushTrigger,
  context: PushContext
): boolean {
  const now = new Date()
  const { profile, state, schedule } = context

  switch (trigger) {
    case PushTrigger.TIME_BASED:
      return shouldSendTimeBased(now, schedule)

    case PushTrigger.WORKOUT_REMINDER:
      return shouldSendWorkoutReminder(now, state)

    case PushTrigger.MOTIVATION:
      return shouldSendMotivation(now, state)

    case PushTrigger.CHECK_IN:
      return shouldSendCheckIn(now, state)

    case PushTrigger.MILESTONE:
      return shouldSendMilestone(state)

    case PushTrigger.INACTIVE:
      return shouldSendInactive(now, profile)

    default:
      return false
  }
}

function shouldSendTimeBased(now: Date, schedule: PushSchedule): boolean {
  const hour = now.getHours()
  
  if (schedule.morning && hour >= 6 && hour < 12) {
    return true
  }
  if (schedule.afternoon && hour >= 12 && hour < 18) {
    return true
  }
  if (schedule.evening && hour >= 18 && hour < 22) {
    return true
  }
  
  return false
}

function shouldSendWorkoutReminder(now: Date, state: BuddyState): boolean {
  if (!state.lastWorkoutDate) {
    return true
  }

  const daysSinceLastWorkout = Math.floor(
    (now.getTime() - new Date(state.lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysSinceLastWorkout >= 2
}

function shouldSendMotivation(now: Date, state: BuddyState): boolean {
  return state.currentStreak > 0 && state.currentStreak % 7 === 0
}

function shouldSendCheckIn(now: Date, state: BuddyState): boolean {
  if (!state.lastWorkoutDate) {
    return false
  }

  const daysSinceLastWorkout = Math.floor(
    (now.getTime() - new Date(state.lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysSinceLastWorkout === 1
}

function shouldSendMilestone(state: BuddyState): boolean {
  const milestones = [10, 25, 50, 100, 200, 365]
  return milestones.includes(state.totalWorkouts)
}

function shouldSendInactive(now: Date, profile: BuddyProfile): boolean {
  if (!profile.lastActiveAt) {
    return false
  }

  const daysSinceActive = Math.floor(
    (now.getTime() - new Date(profile.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysSinceActive >= 7
}

export function generatePushMessage(
  trigger: PushTrigger,
  context: PushContext
): string {
  const { profile, state } = context
  const style = profile.personalityStyle

  switch (trigger) {
    case PushTrigger.TIME_BASED:
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'greeting',
      })

    case PushTrigger.WORKOUT_REMINDER:
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'workout_reminder',
      })

    case PushTrigger.MOTIVATION:
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'motivation',
      })

    case PushTrigger.CHECK_IN:
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'check_in',
      })

    case PushTrigger.MILESTONE:
      const milestone = `${state.totalWorkouts} Workouts`
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'milestone',
        data: { milestone },
      })

    case PushTrigger.INACTIVE:
      switch (style) {
        case PersonalityStyle.MOTIVATOR:
          return `${profile.name}! Ich vermisse dich! Lass uns wieder loslegen! 💪`
        case PersonalityStyle.FRIEND:
          return `Hey ${profile.name}! Lange nicht gesehen! Alles ok? 😊`
        case PersonalityStyle.DRILL_SERGEANT:
          return `${profile.name}! Wo bist du?! Zurück ans Training! ⚡`
        case PersonalityStyle.CHEERLEADER:
          return `${profile.name}! Wir vermissen dich! Komm zurück! 🎉`
        default:
          return `${profile.name}, lass uns wieder trainieren! 💪`
      }

    default:
      return generatePersonalizedMessage(style, {
        userName: profile.name,
        messageType: 'greeting',
      })
  }
}

export function schedulePushMessage(
  userId: string,
  trigger: PushTrigger,
  content: string,
  scheduledAt: Date
): BuddyPushMessage {
  return {
    id: `push-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    trigger,
    content,
    scheduledAt,
    status: 'pending',
    createdAt: new Date(),
  }
}

export function getOptimalPushTime(
  schedule: PushSchedule,
  timezone: string
): Date {
  const now = new Date()
  const hour = now.getHours()

  if (schedule.morning && hour < 12) {
    const morning = new Date(now)
    morning.setHours(8, 0, 0, 0)
    return morning
  }

  if (schedule.afternoon && hour < 18) {
    const afternoon = new Date(now)
    afternoon.setHours(14, 0, 0, 0)
    return afternoon
  }

  if (schedule.evening && hour < 22) {
    const evening = new Date(now)
    evening.setHours(19, 0, 0, 0)
    return evening
  }

  const nextMorning = new Date(now)
  nextMorning.setDate(nextMorning.getDate() + 1)
  nextMorning.setHours(8, 0, 0, 0)
  return nextMorning
}

export function getPushFrequency(
  trigger: PushTrigger
): number {
  switch (trigger) {
    case PushTrigger.TIME_BASED:
      return 1
    case PushTrigger.WORKOUT_REMINDER:
      return 2
    case PushTrigger.MOTIVATION:
      return 7
    case PushTrigger.CHECK_IN:
      return 1
    case PushTrigger.MILESTONE:
      return 0
    case PushTrigger.INACTIVE:
      return 7
    default:
      return 1
  }
}
