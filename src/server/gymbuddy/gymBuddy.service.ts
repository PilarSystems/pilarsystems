/**
 * Gym Buddy Service
 * 
 * Business logic for Gym Buddy operations.
 */

import {
  BuddyProfile,
  BuddyConfig,
  BuddyState,
  BuddyMessage,
  BuddyPushMessage,
  PersonalityStyle,
  FitnessGoal,
  FitnessLevel,
  Equipment,
  OnboardingStep,
} from './gymBuddy.types'

const profiles = new Map<string, BuddyProfile>()
const configs = new Map<string, BuddyConfig>()
const states = new Map<string, BuddyState>()
const messages = new Map<string, BuddyMessage[]>()
const pushMessages = new Map<string, BuddyPushMessage[]>()

export class GymBuddyService {
  async createProfile(data: {
    userId: string
    name: string
    phoneNumber: string
    email?: string
    personalityStyle: PersonalityStyle
    fitnessGoal: FitnessGoal
    fitnessLevel: FitnessLevel
    workoutFrequency: number
    equipment: Equipment
  }): Promise<BuddyProfile> {
    const profile: BuddyProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      personalityStyle: data.personalityStyle,
      fitnessGoal: data.fitnessGoal,
      fitnessLevel: data.fitnessLevel,
      workoutFrequency: data.workoutFrequency,
      equipment: data.equipment,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date(),
      onboardingCompleted: true,
      onboardingStep: OnboardingStep.COMPLETE,
    }

    profiles.set(data.userId, profile)
    return profile
  }

  async getProfile(userId: string): Promise<BuddyProfile | null> {
    return profiles.get(userId) || null
  }

  async updateProfile(
    userId: string,
    updates: Partial<BuddyProfile>
  ): Promise<BuddyProfile | null> {
    const profile = profiles.get(userId)
    if (!profile) return null

    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    }

    profiles.set(userId, updated)
    return updated
  }

  async updateLastActive(userId: string): Promise<void> {
    const profile = profiles.get(userId)
    if (profile) {
      profile.lastActiveAt = new Date()
      profiles.set(userId, profile)
    }
  }

  async createConfig(data: {
    userId: string
    pushEnabled?: boolean
    pushSchedule?: {
      morning?: string
      afternoon?: string
      evening?: string
    }
    timezone?: string
    language?: string
  }): Promise<BuddyConfig> {
    const config: BuddyConfig = {
      id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      pushEnabled: data.pushEnabled ?? true,
      pushSchedule: data.pushSchedule || {},
      timezone: data.timezone || 'Europe/Berlin',
      language: data.language || 'de',
      preferences: {
        motivationLevel: 5,
        checkInFrequency: 3,
        workoutReminders: true,
        progressTracking: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    configs.set(data.userId, config)
    return config
  }

  async getConfig(userId: string): Promise<BuddyConfig | null> {
    return configs.get(userId) || null
  }

  async updateConfig(
    userId: string,
    updates: Partial<BuddyConfig>
  ): Promise<BuddyConfig | null> {
    const config = configs.get(userId)
    if (!config) return null

    const updated = {
      ...config,
      ...updates,
      updatedAt: new Date(),
    }

    configs.set(userId, updated)
    return updated
  }

  async createState(userId: string): Promise<BuddyState> {
    const state: BuddyState = {
      id: `state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      milestones: [],
      conversationContext: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    states.set(userId, state)
    return state
  }

  async getState(userId: string): Promise<BuddyState | null> {
    return states.get(userId) || null
  }

  async updateState(
    userId: string,
    updates: Partial<BuddyState>
  ): Promise<BuddyState | null> {
    const state = states.get(userId)
    if (!state) return null

    const updated = {
      ...state,
      ...updates,
      updatedAt: new Date(),
    }

    states.set(userId, updated)
    return updated
  }

  async recordWorkout(userId: string): Promise<BuddyState | null> {
    const state = states.get(userId)
    if (!state) return null

    const now = new Date()
    const lastWorkout = state.lastWorkoutDate
    let newStreak = state.currentStreak

    if (lastWorkout) {
      const daysSince = Math.floor(
        (now.getTime() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysSince === 1) {
        newStreak += 1
      } else if (daysSince > 1) {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    const updated: BuddyState = {
      ...state,
      lastWorkoutDate: now,
      totalWorkouts: state.totalWorkouts + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(state.longestStreak, newStreak),
      updatedAt: now,
    }

    states.set(userId, updated)
    return updated
  }

  async addMilestone(userId: string, milestone: string): Promise<BuddyState | null> {
    const state = states.get(userId)
    if (!state) return null

    const updated: BuddyState = {
      ...state,
      milestones: [...state.milestones, milestone],
      updatedAt: new Date(),
    }

    states.set(userId, updated)
    return updated
  }

  async saveMessage(data: {
    userId: string
    direction: 'inbound' | 'outbound'
    content: string
    channel: 'whatsapp' | 'sms' | 'web'
    metadata?: {
      intent?: string
      confidence?: number
      sentiment?: string
    }
  }): Promise<BuddyMessage> {
    const message: BuddyMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      direction: data.direction,
      content: data.content,
      channel: data.channel,
      metadata: data.metadata,
      createdAt: new Date(),
    }

    const userMessages = messages.get(data.userId) || []
    userMessages.push(message)
    messages.set(data.userId, userMessages)

    return message
  }

  async getMessages(
    userId: string,
    limit: number = 50
  ): Promise<BuddyMessage[]> {
    const userMessages = messages.get(userId) || []
    return userMessages.slice(-limit)
  }

  async getRecentMessages(
    userId: string,
    count: number = 10
  ): Promise<BuddyMessage[]> {
    const userMessages = messages.get(userId) || []
    return userMessages.slice(-count)
  }

  async schedulePushMessage(data: {
    userId: string
    trigger: string
    content: string
    scheduledAt: Date
    metadata?: any
  }): Promise<BuddyPushMessage> {
    const pushMessage: BuddyPushMessage = {
      id: `push-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      trigger: data.trigger as any,
      content: data.content,
      scheduledAt: data.scheduledAt,
      status: 'pending',
      metadata: data.metadata,
      createdAt: new Date(),
    }

    const userPushMessages = pushMessages.get(data.userId) || []
    userPushMessages.push(pushMessage)
    pushMessages.set(data.userId, userPushMessages)

    return pushMessage
  }

  async getPendingPushMessages(userId: string): Promise<BuddyPushMessage[]> {
    const userPushMessages = pushMessages.get(userId) || []
    return userPushMessages.filter(msg => msg.status === 'pending')
  }

  async markPushMessageSent(pushMessageId: string): Promise<void> {
    for (const [userId, userPushMessages] of pushMessages.entries()) {
      const message = userPushMessages.find(msg => msg.id === pushMessageId)
      if (message) {
        message.status = 'sent'
        message.sentAt = new Date()
        pushMessages.set(userId, userPushMessages)
        break
      }
    }
  }

  async startOnboarding(userId: string, phoneNumber: string): Promise<BuddyProfile> {
    const profile: BuddyProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: '',
      phoneNumber,
      personalityStyle: PersonalityStyle.MOTIVATOR,
      fitnessGoal: FitnessGoal.GENERAL_FITNESS,
      fitnessLevel: FitnessLevel.BEGINNER,
      workoutFrequency: 3,
      equipment: Equipment.NONE,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingCompleted: false,
      onboardingStep: OnboardingStep.WELCOME,
    }

    profiles.set(userId, profile)
    return profile
  }

  async updateOnboardingStep(
    userId: string,
    step: OnboardingStep,
    data?: any
  ): Promise<BuddyProfile | null> {
    const profile = profiles.get(userId)
    if (!profile) return null

    const updates: Partial<BuddyProfile> = {
      onboardingStep: step,
      updatedAt: new Date(),
    }

    if (step === OnboardingStep.COMPLETE) {
      updates.onboardingCompleted = true
    }

    if (data) {
      Object.assign(updates, data)
    }

    const updated = {
      ...profile,
      ...updates,
    }

    profiles.set(userId, updated)
    return updated
  }

  async getStats(userId: string): Promise<{
    totalWorkouts: number
    currentStreak: number
    longestStreak: number
    totalMessages: number
    lastActive?: Date
  }> {
    const state = states.get(userId)
    const profile = profiles.get(userId)
    const userMessages = messages.get(userId) || []

    return {
      totalWorkouts: state?.totalWorkouts || 0,
      currentStreak: state?.currentStreak || 0,
      longestStreak: state?.longestStreak || 0,
      totalMessages: userMessages.length,
      lastActive: profile?.lastActiveAt,
    }
  }

  async deleteUser(userId: string): Promise<void> {
    profiles.delete(userId)
    configs.delete(userId)
    states.delete(userId)
    messages.delete(userId)
    pushMessages.delete(userId)
  }
}

export const gymBuddyService = new GymBuddyService()
