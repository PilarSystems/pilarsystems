'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  title: string
  description: string
}

const steps = [
  { number: 1, name: 'Studio Info' },
  { number: 2, name: 'Opening Hours' },
  { number: 3, name: 'Offers & Pricing' },
  { number: 4, name: 'Phone Setup' },
  { number: 5, name: 'WhatsApp' },
  { number: 6, name: 'Email & Calendar' },
  { number: 7, name: 'AI Rules' },
]

export function OnboardingLayout({ children, currentStep, title, description }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PILAR SYSTEMS</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's set up your studio in 7 simple steps
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.number === currentStep
                        ? 'bg-blue-600 text-white'
                        : step.number < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step.number < currentStep ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-2 hidden md:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 md:w-24 mx-2 ${
                      step.number < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <Badge variant="outline">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
