/**
 * Gym Buddy Onboarding System
 * 
 * Multi-step onboarding flow for new users.
 */

import {
  OnboardingStep,
  OnboardingQuestion,
  FitnessGoal,
  FitnessLevel,
  Equipment,
  PersonalityStyle,
} from './gymBuddy.types'

export const ONBOARDING_QUESTIONS: Record<OnboardingStep, OnboardingQuestion> = {
  [OnboardingStep.WELCOME]: {
    step: OnboardingStep.WELCOME,
    question: 'Willkommen bei Gym Buddy! 🎉\n\nIch bin dein persönlicher AI Fitness Coach und Freund. Zusammen erreichen wir deine Fitnessziele!\n\nBist du bereit zu starten?',
    options: ['Ja, los geht\'s! 💪', 'Erzähl mir mehr'],
    validation: (answer) => answer.length > 0,
    nextStep: (answer) => OnboardingStep.NAME,
  },

  [OnboardingStep.NAME]: {
    step: OnboardingStep.NAME,
    question: 'Super! Wie heißt du? 😊',
    validation: (answer) => answer.length >= 2,
    nextStep: (answer) => OnboardingStep.GOAL,
  },

  [OnboardingStep.GOAL]: {
    step: OnboardingStep.GOAL,
    question: 'Perfekt! Was ist dein Hauptziel?\n\n1️⃣ Abnehmen\n2️⃣ Muskeln aufbauen\n3️⃣ Allgemeine Fitness\n4️⃣ Kraft steigern\n5️⃣ Ausdauer verbessern\n6️⃣ Flexibilität\n7️⃣ Sport Performance\n8️⃣ Gesundheit',
    options: [
      'Abnehmen',
      'Muskeln aufbauen',
      'Allgemeine Fitness',
      'Kraft steigern',
      'Ausdauer verbessern',
      'Flexibilität',
      'Sport Performance',
      'Gesundheit',
    ],
    validation: (answer) => {
      const goals = Object.values(FitnessGoal)
      return goals.some(goal => 
        answer.toLowerCase().includes(goal.replace('_', ' '))
      )
    },
    nextStep: (answer) => OnboardingStep.LEVEL,
  },

  [OnboardingStep.LEVEL]: {
    step: OnboardingStep.LEVEL,
    question: 'Wie würdest du dein aktuelles Fitness-Level beschreiben?\n\n1️⃣ Anfänger (wenig Erfahrung)\n2️⃣ Fortgeschritten (regelmäßiges Training)\n3️⃣ Profi (jahrelange Erfahrung)\n4️⃣ Athlet (Wettkampf-Level)',
    options: ['Anfänger', 'Fortgeschritten', 'Profi', 'Athlet'],
    validation: (answer) => {
      const levels = Object.values(FitnessLevel)
      return levels.some(level => 
        answer.toLowerCase().includes(level)
      )
    },
    nextStep: (answer) => OnboardingStep.FREQUENCY,
  },

  [OnboardingStep.FREQUENCY]: {
    step: OnboardingStep.FREQUENCY,
    question: 'Wie oft möchtest du pro Woche trainieren?\n\n1️⃣ 1-2x pro Woche\n2️⃣ 3-4x pro Woche\n3️⃣ 5-6x pro Woche\n4️⃣ Täglich',
    options: ['1-2x', '3-4x', '5-6x', 'Täglich'],
    validation: (answer) => {
      const num = parseInt(answer)
      return !isNaN(num) && num >= 1 && num <= 7
    },
    nextStep: (answer) => OnboardingStep.EQUIPMENT,
  },

  [OnboardingStep.EQUIPMENT]: {
    step: OnboardingStep.EQUIPMENT,
    question: 'Welches Equipment hast du zur Verfügung?\n\n1️⃣ Kein Equipment (Bodyweight)\n2️⃣ Home Basic (Hanteln, Matte)\n3️⃣ Home Full (Hanteln, Bank, etc.)\n4️⃣ Gym Zugang',
    options: ['Kein Equipment', 'Home Basic', 'Home Full', 'Gym Zugang'],
    validation: (answer) => {
      const equipment = Object.values(Equipment)
      return equipment.some(eq => 
        answer.toLowerCase().includes(eq.replace('_', ' '))
      )
    },
    nextStep: (answer) => OnboardingStep.PERSONALITY,
  },

  [OnboardingStep.PERSONALITY]: {
    step: OnboardingStep.PERSONALITY,
    question: 'Fast geschafft! Welche Art von Coach möchtest du?\n\n1️⃣ Motivator (energiegeladen)\n2️⃣ Freund (freundlich)\n3️⃣ Coach (professionell)\n4️⃣ Mentor (weise)\n5️⃣ Cheerleader (enthusiastisch)\n6️⃣ Drill Sergeant (streng)\n7️⃣ Wissenschaftler (analytisch)\n8️⃣ Comedian (lustig)\n9️⃣ Zen Master (ruhig)\n🔟 Competitor (wettbewerbsorientiert)',
    options: [
      'Motivator',
      'Freund',
      'Coach',
      'Mentor',
      'Cheerleader',
      'Drill Sergeant',
      'Wissenschaftler',
      'Comedian',
      'Zen Master',
      'Competitor',
    ],
    validation: (answer) => {
      const styles = Object.values(PersonalityStyle)
      return styles.some(style => 
        answer.toLowerCase().includes(style.replace('_', ' '))
      )
    },
    nextStep: (answer) => OnboardingStep.COMPLETE,
  },

  [OnboardingStep.COMPLETE]: {
    step: OnboardingStep.COMPLETE,
    question: 'Perfekt! Dein Profil ist komplett! 🎉\n\nIch freue mich darauf, mit dir zu arbeiten!\n\nSchreib mir einfach eine Nachricht und wir legen los! 💪',
    validation: (answer) => true,
    nextStep: (answer) => OnboardingStep.COMPLETE,
  },
}

export function getOnboardingQuestion(step: OnboardingStep): OnboardingQuestion {
  return ONBOARDING_QUESTIONS[step]
}

export function getNextOnboardingStep(
  currentStep: OnboardingStep,
  answer: string
): OnboardingStep {
  const question = ONBOARDING_QUESTIONS[currentStep]
  return question.nextStep(answer)
}

export function validateOnboardingAnswer(
  step: OnboardingStep,
  answer: string
): boolean {
  const question = ONBOARDING_QUESTIONS[step]
  return question.validation ? question.validation(answer) : true
}

export function parseOnboardingAnswer(
  step: OnboardingStep,
  answer: string
): any {
  const normalizedAnswer = answer.toLowerCase().trim()

  switch (step) {
    case OnboardingStep.GOAL:
      if (normalizedAnswer.includes('abnehmen') || normalizedAnswer.includes('weight')) {
        return FitnessGoal.WEIGHT_LOSS
      }
      if (normalizedAnswer.includes('muskeln') || normalizedAnswer.includes('muscle')) {
        return FitnessGoal.MUSCLE_GAIN
      }
      if (normalizedAnswer.includes('fitness') || normalizedAnswer.includes('allgemein')) {
        return FitnessGoal.GENERAL_FITNESS
      }
      if (normalizedAnswer.includes('kraft') || normalizedAnswer.includes('strength')) {
        return FitnessGoal.STRENGTH
      }
      if (normalizedAnswer.includes('ausdauer') || normalizedAnswer.includes('endurance')) {
        return FitnessGoal.ENDURANCE
      }
      if (normalizedAnswer.includes('flexibilität') || normalizedAnswer.includes('flexibility')) {
        return FitnessGoal.FLEXIBILITY
      }
      if (normalizedAnswer.includes('sport') || normalizedAnswer.includes('performance')) {
        return FitnessGoal.SPORTS_PERFORMANCE
      }
      if (normalizedAnswer.includes('gesundheit') || normalizedAnswer.includes('health')) {
        return FitnessGoal.HEALTH
      }
      return FitnessGoal.GENERAL_FITNESS

    case OnboardingStep.LEVEL:
      if (normalizedAnswer.includes('anfänger') || normalizedAnswer.includes('beginner')) {
        return FitnessLevel.BEGINNER
      }
      if (normalizedAnswer.includes('fortgeschritten') || normalizedAnswer.includes('intermediate')) {
        return FitnessLevel.INTERMEDIATE
      }
      if (normalizedAnswer.includes('profi') || normalizedAnswer.includes('advanced')) {
        return FitnessLevel.ADVANCED
      }
      if (normalizedAnswer.includes('athlet') || normalizedAnswer.includes('athlete')) {
        return FitnessLevel.ATHLETE
      }
      return FitnessLevel.BEGINNER

    case OnboardingStep.FREQUENCY:
      const match = normalizedAnswer.match(/(\d+)/)
      if (match) {
        return parseInt(match[1])
      }
      if (normalizedAnswer.includes('täglich') || normalizedAnswer.includes('daily')) {
        return 7
      }
      if (normalizedAnswer.includes('1-2') || normalizedAnswer.includes('1') || normalizedAnswer.includes('2')) {
        return 2
      }
      if (normalizedAnswer.includes('3-4') || normalizedAnswer.includes('3') || normalizedAnswer.includes('4')) {
        return 4
      }
      if (normalizedAnswer.includes('5-6') || normalizedAnswer.includes('5') || normalizedAnswer.includes('6')) {
        return 6
      }
      return 3

    case OnboardingStep.EQUIPMENT:
      if (normalizedAnswer.includes('kein') || normalizedAnswer.includes('none') || normalizedAnswer.includes('bodyweight')) {
        return Equipment.NONE
      }
      if (normalizedAnswer.includes('basic')) {
        return Equipment.HOME_BASIC
      }
      if (normalizedAnswer.includes('full')) {
        return Equipment.HOME_FULL
      }
      if (normalizedAnswer.includes('gym') || normalizedAnswer.includes('studio')) {
        return Equipment.GYM_ACCESS
      }
      return Equipment.NONE

    case OnboardingStep.PERSONALITY:
      if (normalizedAnswer.includes('motivator')) {
        return PersonalityStyle.MOTIVATOR
      }
      if (normalizedAnswer.includes('freund') || normalizedAnswer.includes('friend')) {
        return PersonalityStyle.FRIEND
      }
      if (normalizedAnswer.includes('coach')) {
        return PersonalityStyle.COACH
      }
      if (normalizedAnswer.includes('mentor')) {
        return PersonalityStyle.MENTOR
      }
      if (normalizedAnswer.includes('cheerleader')) {
        return PersonalityStyle.CHEERLEADER
      }
      if (normalizedAnswer.includes('drill') || normalizedAnswer.includes('sergeant')) {
        return PersonalityStyle.DRILL_SERGEANT
      }
      if (normalizedAnswer.includes('wissenschaftler') || normalizedAnswer.includes('scientist')) {
        return PersonalityStyle.SCIENTIST
      }
      if (normalizedAnswer.includes('comedian') || normalizedAnswer.includes('lustig')) {
        return PersonalityStyle.COMEDIAN
      }
      if (normalizedAnswer.includes('zen')) {
        return PersonalityStyle.ZEN_MASTER
      }
      if (normalizedAnswer.includes('competitor') || normalizedAnswer.includes('wettbewerb')) {
        return PersonalityStyle.COMPETITOR
      }
      return PersonalityStyle.MOTIVATOR

    default:
      return answer
  }
}

export function getOnboardingProgress(step: OnboardingStep): number {
  const steps = Object.values(OnboardingStep)
  const currentIndex = steps.indexOf(step)
  return Math.round((currentIndex / (steps.length - 1)) * 100)
}
