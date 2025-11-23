/**
 * Training Plan Service
 * 
 * AI-powered workout plan generation using OpenAI GPT-4o-mini.
 */

import OpenAI from 'openai'
import { prisma } from '@/src/server/db/client'
import {
  TrainingPlanInput,
  TrainingPlanOutput,
  ValidationResult,
  TrainingGoal,
  TrainingLevel,
  Equipment,
  OpenAIWorkoutPlanResponse,
} from './trainingPlan.types'

let openaiInstance: OpenAI | null = null

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

export function validateTrainingPlanInput(input: TrainingPlanInput): ValidationResult {
  const errors: string[] = []

  if (!input.goal) {
    errors.push('Goal is required')
  }

  if (!input.daysPerWeek || input.daysPerWeek < 1 || input.daysPerWeek > 7) {
    errors.push('Days per week must be between 1 and 7')
  }

  if (!input.level) {
    errors.push('Training level is required')
  }

  if (input.timePerSession && input.timePerSession < 15) {
    errors.push('Time per session must be at least 15 minutes')
  }

  if (input.equipment === Equipment.LIMITED && (!input.customEquipment || input.customEquipment.length === 0)) {
    errors.push('Custom equipment list is required when equipment is LIMITED')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function buildWorkoutPlanPrompt(input: TrainingPlanInput): string {
  const goalDescriptions = {
    [TrainingGoal.MUSCLE_BUILDING]: 'muscle building and hypertrophy',
    [TrainingGoal.FAT_LOSS]: 'fat loss and body recomposition',
    [TrainingGoal.STRENGTH]: 'strength and power development',
    [TrainingGoal.REHABILITATION]: 'rehabilitation and injury recovery',
    [TrainingGoal.ENDURANCE]: 'endurance and cardiovascular fitness',
    [TrainingGoal.GENERAL_FITNESS]: 'general fitness and health',
  }

  const levelDescriptions = {
    [TrainingLevel.BEGINNER]: 'beginner (less than 1 year of training)',
    [TrainingLevel.INTERMEDIATE]: 'intermediate (1-3 years of training)',
    [TrainingLevel.ADVANCED]: 'advanced (3+ years of training)',
  }

  let prompt = `You are an expert personal trainer and strength coach. Generate a detailed, personalized workout plan with the following specifications:

**Goal:** ${goalDescriptions[input.goal]}
**Training Days:** ${input.daysPerWeek} days per week
**Experience Level:** ${levelDescriptions[input.level]}
`

  if (input.equipment) {
    prompt += `**Equipment Available:** ${input.equipment}\n`
  }

  if (input.customEquipment && input.customEquipment.length > 0) {
    prompt += `**Custom Equipment:** ${input.customEquipment.join(', ')}\n`
  }

  if (input.injuries && input.injuries.length > 0) {
    prompt += `**Injuries/Limitations:** ${input.injuries.join(', ')}\n`
  }

  if (input.timePerSession) {
    prompt += `**Time Per Session:** ${input.timePerSession} minutes\n`
  }

  if (input.splitPreference) {
    prompt += `**Preferred Split:** ${input.splitPreference}\n`
  }

  if (input.preferences?.favoriteExercises && input.preferences.favoriteExercises.length > 0) {
    prompt += `**Favorite Exercises:** ${input.preferences.favoriteExercises.join(', ')}\n`
  }

  if (input.preferences?.avoidExercises && input.preferences.avoidExercises.length > 0) {
    prompt += `**Exercises to Avoid:** ${input.preferences.avoidExercises.join(', ')}\n`
  }

  if (input.preferences?.focusAreas && input.preferences.focusAreas.length > 0) {
    prompt += `**Focus Areas:** ${input.preferences.focusAreas.join(', ')}\n`
  }

  prompt += `

Please generate a complete workout plan in JSON format with the following structure:

{
  "split": {
    "type": "full_body|upper_lower|push_pull_legs|bro_split|custom",
    "description": "Brief description of the split",
    "days": [
      {
        "day": 1,
        "name": "Day name",
        "focus": "Focus areas",
        "warmup": [{"name": "Exercise", "sets": 1, "reps": "5-10", "rest": "30s"}],
        "exercises": [{"name": "Exercise", "sets": 3, "reps": "8-12", "rest": "90s", "tempo": "2-0-2-0", "rpe": "7-8"}],
        "cooldown": [{"name": "Stretch", "sets": 1, "reps": "30s", "rest": "0s"}],
        "estimatedDuration": 60
      }
    ]
  },
  "progression": {
    "method": "Linear Progression",
    "description": "How to progress",
    "weeklyIncrease": "2.5kg per week",
    "deloadFrequency": "Every 4 weeks",
    "notes": ["Tip 1", "Tip 2"]
  },
  "generalNotes": ["Note 1", "Note 2"],
  "nutrition": {
    "calorieTarget": "2500-2800 kcal",
    "proteinTarget": "150-180g",
    "generalTips": ["Tip 1", "Tip 2"]
  },
  "safetyTips": ["Tip 1", "Tip 2"],
  "formTips": ["Tip 1", "Tip 2"]
}

Generate a comprehensive, safe, and effective workout plan now.`

  return prompt
}

export async function generateWorkoutPlan(input: TrainingPlanInput): Promise<TrainingPlanOutput> {
  const validation = validateTrainingPlanInput(input)
  if (!validation.valid) {
    throw new Error(`Invalid input: ${validation.errors.join(', ')}`)
  }

  const openai = getOpenAI()
  
  if (!openai) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }

  try {
    const prompt = buildWorkoutPlanPrompt(input)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personal trainer. Generate detailed workout plans in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const aiResponse: OpenAIWorkoutPlanResponse = JSON.parse(responseContent)

    const output: TrainingPlanOutput = {
      id: '',
      goal: input.goal,
      level: input.level,
      daysPerWeek: input.daysPerWeek,
      split: aiResponse.split,
      progression: aiResponse.progression,
      generalNotes: aiResponse.generalNotes || [],
      nutrition: aiResponse.nutrition,
      safetyTips: aiResponse.safetyTips || [],
      formTips: aiResponse.formTips || [],
      createdAt: new Date(),
    }

    if (input.tenantId) {
      const savedPlan = await prisma.workoutPlan.create({
        data: {
          tenantId: input.tenantId,
          userId: input.userId || null,
          plan: output as any,
        },
      })

      output.id = savedPlan.id
    } else {
      output.id = `temp-${Date.now()}`
    }

    return output
  } catch (error) {
    console.error('Error generating workout plan:', error)
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`)
    }
    
    throw new Error('Failed to generate workout plan: Unknown error')
  }
}

export async function getWorkoutPlan(id: string): Promise<TrainingPlanOutput | null> {
  try {
    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
    })

    if (!plan) {
      return null
    }

    return plan.plan as any as TrainingPlanOutput
  } catch (error) {
    console.error('Error fetching workout plan:', error)
    throw new Error('Failed to fetch workout plan')
  }
}

export async function getWorkoutPlansForTenant(tenantId: string): Promise<TrainingPlanOutput[]> {
  try {
    const plans = await prisma.workoutPlan.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    })

    return plans.map(plan => plan.plan as any as TrainingPlanOutput)
  } catch (error) {
    console.error('Error fetching workout plans:', error)
    throw new Error('Failed to fetch workout plans')
  }
}

export async function getWorkoutPlansForUser(userId: string): Promise<TrainingPlanOutput[]> {
  try {
    const plans = await prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return plans.map(plan => plan.plan as any as TrainingPlanOutput)
  } catch (error) {
    console.error('Error fetching workout plans:', error)
    throw new Error('Failed to fetch workout plans')
  }
}
