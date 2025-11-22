/**
 * Training Plan Generation API Route
 * 
 * POST /api/training/generate
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateWorkoutPlan, validateTrainingPlanInput } from '@/src/server/core/training/trainingPlan.service'
import { TrainingPlanInput } from '@/src/server/core/training/trainingPlan.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const input: TrainingPlanInput = {
      goal: body.goal,
      daysPerWeek: body.daysPerWeek,
      level: body.level,
      equipment: body.equipment,
      customEquipment: body.customEquipment,
      injuries: body.injuries,
      timePerSession: body.timePerSession,
      splitPreference: body.splitPreference,
      preferences: body.preferences,
      tenantId: body.tenantId,
      userId: body.userId,
    }

    const validation = validateTrainingPlanInput(input)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const plan = await generateWorkoutPlan(input)

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error('Error in /api/training/generate:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate workout plan',
      },
      { status: 500 }
    )
  }
}
