/**
 * Training Plan Types
 * 
 * TypeScript types for the Training Plan AI Engine.
 * Used for input validation and output structure.
 */

export enum TrainingGoal {
  MUSCLE_BUILDING = 'muscle_building',
  FAT_LOSS = 'fat_loss',
  STRENGTH = 'strength',
  REHABILITATION = 'rehabilitation',
  ENDURANCE = 'endurance',
  GENERAL_FITNESS = 'general_fitness',
}

export enum TrainingLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Equipment {
  FULL_GYM = 'full_gym',
  HOME_BASIC = 'home_basic',
  BODYWEIGHT = 'bodyweight',
  LIMITED = 'limited',
}

export enum SplitType {
  FULL_BODY = 'full_body',
  UPPER_LOWER = 'upper_lower',
  PUSH_PULL_LEGS = 'push_pull_legs',
  BRO_SPLIT = 'bro_split',
  CUSTOM = 'custom',
}

export interface TrainingPlanInput {
  goal: TrainingGoal
  daysPerWeek: number
  level: TrainingLevel
  equipment?: Equipment
  customEquipment?: string[]
  injuries?: string[]
  timePerSession?: number
  splitPreference?: SplitType
  preferences?: {
    favoriteExercises?: string[]
    avoidExercises?: string[]
    focusAreas?: string[]
  }
  tenantId?: string
  userId?: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
  tempo?: string
  rpe?: string
}

export interface WorkoutDay {
  day: number
  name: string
  focus: string
  warmup: Exercise[]
  exercises: Exercise[]
  cooldown: Exercise[]
  estimatedDuration: number
  notes?: string
}

export interface WeeklySplit {
  type: SplitType
  description: string
  days: WorkoutDay[]
}

export interface ProgressionStrategy {
  method: string
  description: string
  weeklyIncrease?: string
  deloadFrequency?: string
  notes: string[]
}

export interface NutritionGuidelines {
  calorieTarget?: string
  proteinTarget?: string
  generalTips: string[]
}

export interface TrainingPlanOutput {
  id: string
  goal: TrainingGoal
  level: TrainingLevel
  daysPerWeek: number
  split: WeeklySplit
  progression: ProgressionStrategy
  generalNotes: string[]
  nutrition?: NutritionGuidelines
  safetyTips: string[]
  formTips: string[]
  createdAt: Date
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface OpenAIWorkoutPlanResponse {
  split: WeeklySplit
  progression: ProgressionStrategy
  generalNotes: string[]
  nutrition?: NutritionGuidelines
  safetyTips: string[]
  formTips: string[]
}
