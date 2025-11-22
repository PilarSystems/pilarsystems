# Backend Phase 1, Task 3: Trainingsplan-KI-Engine

**Date:** November 22, 2024  
**Status:** ✅ Complete

## Overview

AI-powered workout plan generation engine using OpenAI GPT-4o-mini. Generates personalized training plans based on user goals, experience level, available equipment, and constraints.

## Modules Created

### 1. trainingPlan.types.ts

TypeScript types and interfaces:

**Enums:**
- `TrainingGoal`: muscle_building, fat_loss, strength, rehabilitation, endurance, general_fitness
- `TrainingLevel`: beginner, intermediate, advanced
- `Equipment`: full_gym, home_basic, bodyweight, limited
- `SplitType`: full_body, upper_lower, push_pull_legs, bro_split, custom

**Interfaces:**
- `TrainingPlanInput`: Input parameters
- `TrainingPlanOutput`: Complete workout plan
- `Exercise`: Sets, reps, rest, tempo, RPE
- `WorkoutDay`: Warmup, exercises, cooldown
- `WeeklySplit`: Weekly training structure
- `ProgressionStrategy`: Progression method
- `NutritionGuidelines`: Nutrition recommendations

### 2. trainingPlan.service.ts

Core AI service:

**Functions:**
- `validateTrainingPlanInput()`: Input validation
- `generateWorkoutPlan()`: AI plan generation with GPT-4o-mini
- `getWorkoutPlan()`: Retrieve plan by ID
- `getWorkoutPlansForTenant()`: Get all plans for tenant
- `getWorkoutPlansForUser()`: Get all plans for user

**Features:**
- OpenAI GPT-4o-mini integration
- Comprehensive prompt engineering
- Prisma database integration
- Error handling

### 3. API Route

`POST /api/training/generate`

- Node.js runtime
- Input validation
- Error handling
- Returns complete workout plan

## Usage Example

### Request

```bash
curl -X POST http://localhost:3000/api/training/generate \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "muscle_building",
    "daysPerWeek": 3,
    "level": "beginner",
    "equipment": "full_gym",
    "timePerSession": 60,
    "tenantId": "tenant-123"
  }'
```

### Response

```json
{
  "success": true,
  "plan": {
    "id": "plan-abc123",
    "goal": "muscle_building",
    "level": "beginner",
    "daysPerWeek": 3,
    "split": {
      "type": "full_body",
      "description": "Full body workout 3x per week",
      "days": [
        {
          "day": 1,
          "name": "Full Body A",
          "focus": "Compound movements",
          "warmup": [...],
          "exercises": [
            {
              "name": "Barbell Squat",
              "sets": 3,
              "reps": "8-12",
              "rest": "90s",
              "tempo": "2-0-2-0",
              "rpe": "7-8"
            }
          ],
          "cooldown": [...],
          "estimatedDuration": 60
        }
      ]
    },
    "progression": {
      "method": "Linear Progression",
      "description": "Add weight when you can complete all sets",
      "weeklyIncrease": "2.5kg upper, 5kg lower",
      "deloadFrequency": "Every 4-6 weeks",
      "notes": [...]
    },
    "generalNotes": [...],
    "nutrition": {
      "calorieTarget": "2500-2800 kcal",
      "proteinTarget": "150-180g",
      "generalTips": [...]
    },
    "safetyTips": [...],
    "formTips": [...],
    "createdAt": "2024-11-22T17:00:00.000Z"
  }
}
```

## Environment Variables

```env
OPENAI_API_KEY=sk-...your-key-here
```

## Quality Checks

✅ `npm run lint` - Passing  
✅ `npm run build` - Passing  
✅ Fully typed (no any)

## Files Created

1. `/src/server/core/training/trainingPlan.types.ts`
2. `/src/server/core/training/trainingPlan.service.ts`
3. `/app/api/training/generate/route.ts`
4. `/docs/BACKEND-PHASE1-TASK3.md`

## Integration Points

**Phase 2: Voice AI** - Generate plans during calls  
**Phase 3: WhatsApp Gym Buddy** - Generate plans via chat  
**Phase 4: Dashboard UI** - Display and edit plans

## Next Steps

- Phase 2: Voice AI Integration
- Phase 3: WhatsApp Gym Buddy
- Phase 4: Dashboard UI
