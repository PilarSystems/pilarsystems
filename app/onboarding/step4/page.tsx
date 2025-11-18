'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function OnboardingStep4() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/step4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Phone setup saved')
      router.push('/onboarding/step5')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/step5')
  }

  return (
    <OnboardingLayout
      currentStep={4}
      title="Phone Setup"
      description="Connect your phone system for AI call handling"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Twilio Integration</CardTitle>
            <CardDescription className="text-blue-800 dark:text-blue-200">
              Connect your Twilio account to enable AI-powered phone handling
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200">
            <p>With Twilio integration, PILAR SYSTEMS can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Handle missed calls automatically</li>
              <li>Transcribe voicemails</li>
              <li>Send follow-up messages</li>
              <li>Create leads from calls</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twilioAccountSid">Twilio Account SID</Label>
            <Input
              id="twilioAccountSid"
              value={formData.twilioAccountSid}
              onChange={(e) => setFormData({ ...formData, twilioAccountSid: e.target.value })}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
            <Input
              id="twilioAuthToken"
              type="password"
              value={formData.twilioAuthToken}
              onChange={(e) => setFormData({ ...formData, twilioAuthToken: e.target.value })}
              placeholder="Your Twilio auth token"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twilioPhoneNumber">Twilio Phone Number</Label>
            <Input
              id="twilioPhoneNumber"
              value={formData.twilioPhoneNumber}
              onChange={(e) => setFormData({ ...formData, twilioPhoneNumber: e.target.value })}
              placeholder="+49123456789"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step3')}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  )
}
