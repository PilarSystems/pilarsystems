'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'

export default function OnboardingStep7() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) throw new Error('Failed to complete onboarding')

      toast.success('Onboarding completed! Welcome to PILAR SYSTEMS')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={7}
      title="Review & Complete"
      description="You're all set! Let's activate your AI automation"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
            <CardDescription>
              Your PILAR SYSTEMS platform is being configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI Modules Activated</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  WhatsApp AI, Email AI, and Phone AI are now monitoring your channels
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Automation Workflows Ready</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lead classification, follow-ups, and reminders are automated
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Dashboard Configured</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your analytics, leads, and messages are ready to view
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Team Access Enabled</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can invite team members from the settings page
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Pro Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your AI will learn from every interaction. The more leads you process, the smarter it becomes at
              qualifying and responding to inquiries.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step6')}>
            Back
          </Button>
          <Button onClick={handleComplete} disabled={loading} size="lg">
            {loading ? 'Activating...' : 'Complete Setup & Go to Dashboard'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
