/**
 * Gym Buddy Types
 * 
 * TypeScript types for the Gym Buddy B2C AI Coach system.
 */

export enum PersonalityStyle {
  MOTIVATOR = 'motivator',
  FRIEND = 'friend',
  COACH = 'coach',
  MENTOR = 'mentor',
  CHEERLEADER = 'cheerleader',
  DRILL_SERGEANT = 'drill_sergeant',
  SCIENTIST = 'scientist',
  COMEDIAN = 'comedian',
  ZEN_MASTER = 'zen_master',
  COMPETITOR = 'competitor',
}

export enum FitnessGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  GENERAL_FITNESS = 'general_fitness',
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  SPORTS_PERFORMANCE = 'sports_performance',
  HEALTH = 'health',
}

export enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ATHLETE = 'athlete',
}

export enum Equipment {
  NONE = 'none',
  HOME_BASIC = 'home_basic',
  HOME_FULL = 'home_full',
  GYM_ACCESS = 'gym_access',
}

export enum OnboardingStep {
  WELCOME = 'welcome',
  NAME = 'name',
  GOAL = 'goal',
  LEVEL = 'level',
  FREQUENCY = 'frequency',
  EQUIPMENT = 'equipment',
  PERSONALITY = 'personality',
  COMPLETE = 'complete',
}

export enum PushTrigger {
  TIME_BASED = 'time_based',
  WORKOUT_REMINDER = 'workout_reminder',
  MOTIVATION = 'motivation',
  CHECK_IN = 'check_in',
  MILESTONE = 'milestone',
  INACTIVE = 'inactive',
  CUSTOM = 'custom',
}

export interface BuddyProfile {
  id: string
  userId: string
  name: string
  phoneNumber: string
  email?: string
  personalityStyle: PersonalityStyle
  fitnessGoal: FitnessGoal
  fitnessLevel: FitnessLevel
  workoutFrequency: number
  equipment: Equipment
  createdAt: Date
  updatedAt: Date
  lastActiveAt?: Date
  onboardingCompleted: boolean
  onboardingStep: OnboardingStep
}

export interface BuddyConfig {
  id: string
  userId: string
  pushEnabled: boolean
  pushSchedule: {
    morning?: string
    afternoon?: string
    evening?: string
  }
  timezone: string
  language: string
  preferences: {
    motivationLevel: number
    checkInFrequency: number
    workoutReminders: boolean
    progressTracking: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface BuddyState {
  id: string
  userId: string
  currentWorkoutPlan?: string
  lastWorkoutDate?: Date
  totalWorkouts: number
  currentStreak: number
  longestStreak: number
  milestones: string[]
  conversationContext: {
    lastTopic?: string
    lastIntent?: string
    pendingQuestions?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface BuddyMessage {
  id: string
  userId: string
  direction: 'inbound' | 'outbound'
  content: string
  channel: 'whatsapp' | 'sms' | 'web'
  metadata?: {
    intent?: string
    confidence?: number
    sentiment?: string
  }
  createdAt: Date
}

export interface BuddyPushMessage {
  id: string
  userId: string
  trigger: PushTrigger
  content: string
  scheduledAt: Date
  sentAt?: Date
  status: 'pending' | 'sent' | 'failed'
  metadata?: {
    workoutId?: string
    milestoneId?: string
  }
  createdAt: Date
}

export interface PersonalityProfile {
  style: PersonalityStyle
  name: string
  description: string
  traits: string[]
  greetingStyle: string
  motivationStyle: string
  responseStyle: string
  emoji: string
  color: string
  exampleMessages: string[]
}

export interface OnboardingQuestion {
  step: OnboardingStep
  question: string
  options?: string[]
  validation?: (answer: string) => boolean
  nextStep: (answer: string) => OnboardingStep
}

export interface BuddyResponse {
  content: string
  personalityStyle: PersonalityStyle
  intent?: string
  actions?: {
    type: 'workout_plan' | 'motivation' | 'check_in' | 'milestone'
    data?: any
  }[]
}
