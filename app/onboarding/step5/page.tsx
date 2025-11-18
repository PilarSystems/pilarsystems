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

export default function OnboardingStep5() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    whatsappApiToken: '',
    whatsappPhoneNumberId: '',
    whatsappBusinessAccountId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/step5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('WhatsApp setup saved')
      router.push('/onboarding/step6')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/step6')
  }

  return (
    <OnboardingLayout
      currentStep={5}
      title="WhatsApp Connection"
      description="Connect WhatsApp Business API for AI messaging"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">WhatsApp Business API</CardTitle>
            <CardDescription className="text-green-800 dark:text-green-200">
              Connect WhatsApp to enable AI-powered messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-green-800 dark:text-green-200">
            <p>With WhatsApp integration, PILAR SYSTEMS can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Respond to inquiries automatically</li>
              <li>Qualify leads through conversation</li>
              <li>Send appointment reminders</li>
              <li>Follow up with prospects</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappApiToken">WhatsApp API Token</Label>
            <Input
              id="whatsappApiToken"
              type="password"
              value={formData.whatsappApiToken}
              onChange={(e) => setFormData({ ...formData, whatsappApiToken: e.target.value })}
              placeholder="Your WhatsApp Business API token"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappPhoneNumberId">Phone Number ID</Label>
            <Input
              id="whatsappPhoneNumberId"
              value={formData.whatsappPhoneNumberId}
              onChange={(e) => setFormData({ ...formData, whatsappPhoneNumberId: e.target.value })}
              placeholder="123456789012345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappBusinessAccountId">Business Account ID</Label>
            <Input
              id="whatsappBusinessAccountId"
              value={formData.whatsappBusinessAccountId}
              onChange={(e) => setFormData({ ...formData, whatsappBusinessAccountId: e.target.value })}
              placeholder="123456789012345"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step4')}>
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
