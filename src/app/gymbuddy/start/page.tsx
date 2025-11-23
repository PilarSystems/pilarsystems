'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import BuddyQuestions from '@/src/components/gymbuddy/BuddyQuestions'
import BuddyPersonalityPicker from '@/src/components/gymbuddy/BuddyPersonalityPicker'
import BuddyPreview from '@/src/components/gymbuddy/BuddyPreview'
import { OnboardingStep, PersonalityStyle } from '@/src/server/gymbuddy/gymBuddy.types'

export default function GymBuddyStartPage() {
  const router = useRouter()
  const [userId] = useState(`user-${Date.now()}`)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [frequency, setFrequency] = useState(0)
  const [equipment, setEquipment] = useState('')
  const [personalityStyle, setPersonalityStyle] = useState<PersonalityStyle | null>(null)

  const handleAnswer = async (answer: string) => {
    try {
      setLoading(true)
      setError(null)

      switch (currentStep) {
        case OnboardingStep.WELCOME:
          setCurrentStep(OnboardingStep.NAME)
          break
        case OnboardingStep.NAME:
          setName(answer)
          setCurrentStep(OnboardingStep.GOAL)
          break
        case OnboardingStep.GOAL:
          setGoal(answer)
          setCurrentStep(OnboardingStep.LEVEL)
          break
        case OnboardingStep.LEVEL:
          setLevel(answer)
          setCurrentStep(OnboardingStep.FREQUENCY)
          break
        case OnboardingStep.FREQUENCY:
          setFrequency(parseInt(answer) || 3)
          setCurrentStep(OnboardingStep.EQUIPMENT)
          break
        case OnboardingStep.EQUIPMENT:
          setEquipment(answer)
          setCurrentStep(OnboardingStep.PERSONALITY)
          break
        case OnboardingStep.PERSONALITY:
          break
        case OnboardingStep.COMPLETE:
          router.push(`/gymbuddy/dashboard?userId=${userId}`)
          break
      }
    } catch (err) {
      console.error('Error handling answer:', err)
      setError(err instanceof Error ? err.message : 'Failed to process answer')
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalitySelect = async (style: PersonalityStyle) => {
    try {
      setLoading(true)
      setError(null)
      setPersonalityStyle(style)

      const response = await fetch('/api/gymbuddy/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          content: style,
          channel: 'web',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete onboarding')
      }

      setCurrentStep(OnboardingStep.COMPLETE)
      
      setTimeout(() => {
        router.push(`/gymbuddy/dashboard?userId=${userId}`)
      }, 2000)
    } catch (err) {
      console.error('Error completing onboarding:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Dumbbell className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Gym Buddy</h1>
          </div>
          <p className="text-lg text-gray-600">
            Dein persönlicher AI Fitness Coach & Freund
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === OnboardingStep.PERSONALITY ? (
            <div className="space-y-6">
              <BuddyPersonalityPicker
                selected={personalityStyle}
                onSelect={handlePersonalitySelect}
              />
              
              {personalityStyle && (
                <div className="flex justify-center">
                  <BuddyPreview
                    personalityStyle={personalityStyle}
                    userName={name}
                  />
                </div>
              )}
            </div>
          ) : currentStep === OnboardingStep.COMPLETE ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Perfekt!
              </h2>
              <p className="text-gray-600 mb-4">
                Dein Gym Buddy ist bereit! Du wirst gleich zu deinem Dashboard weitergeleitet...
              </p>
              <div className="animate-pulse">
                <div className="h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          ) : (
            <BuddyQuestions
              currentStep={currentStep}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Verarbeite...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
