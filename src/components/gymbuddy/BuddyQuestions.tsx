'use client'

import { useState } from 'react'
import { OnboardingStep } from '@/src/lib/gymbuddy/types'
import { getOnboardingQuestion } from '@/src/lib/gymbuddy/onboarding'

interface BuddyQuestionsProps {
  currentStep: OnboardingStep
  onAnswer: (answer: string) => void
}

export default function BuddyQuestions({ currentStep, onAnswer }: BuddyQuestionsProps) {
  const [answer, setAnswer] = useState('')
  const question = getOnboardingQuestion(currentStep)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim()) {
      onAnswer(answer.trim())
      setAnswer('')
    }
  }

  const handleOptionClick = (option: string) => {
    onAnswer(option)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Onboarding
          </h3>
          <span className="text-sm text-gray-500">
            Schritt {Object.values(OnboardingStep).indexOf(currentStep) + 1} von {Object.values(OnboardingStep).length}
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-gray-800 whitespace-pre-line">
            {question.question}
          </p>
        </div>

        {question.options && question.options.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Deine Antwort..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Weiter
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        {Object.values(OnboardingStep).map((step, index) => {
          const currentIndex = Object.values(OnboardingStep).indexOf(currentStep)
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                isActive
                  ? 'w-8 bg-blue-600'
                  : isCompleted
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-300'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
