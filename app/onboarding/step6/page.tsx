'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'

export default function OnboardingStep6() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailData, setEmailData] = useState({
    emailUser: '',
    emailPassword: '',
    imapHost: '',
    imapPort: '993',
    smtpHost: '',
    smtpPort: '587',
  })
  const [calendarData, setCalendarData] = useState({
    googleClientId: '',
    googleClientSecret: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/step6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: emailData, calendar: calendarData }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Email and calendar setup saved')
      router.push('/onboarding/step7')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/step7')
  }

  return (
    <OnboardingLayout
      currentStep={6}
      title="Email & Calendar"
      description="Connect your email and calendar for full automation"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>
                  Connect your email inbox for AI-powered email handling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailUser">Email Address</Label>
                  <Input
                    id="emailUser"
                    type="email"
                    value={emailData.emailUser}
                    onChange={(e) => setEmailData({ ...emailData, emailUser: e.target.value })}
                    placeholder="studio@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailPassword">Email Password / App Password</Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={emailData.emailPassword}
                    onChange={(e) => setEmailData({ ...emailData, emailPassword: e.target.value })}
                    placeholder="Your email password"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imapHost">IMAP Host</Label>
                    <Input
                      id="imapHost"
                      value={emailData.imapHost}
                      onChange={(e) => setEmailData({ ...emailData, imapHost: e.target.value })}
                      placeholder="imap.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imapPort">IMAP Port</Label>
                    <Input
                      id="imapPort"
                      value={emailData.imapPort}
                      onChange={(e) => setEmailData({ ...emailData, imapPort: e.target.value })}
                      placeholder="993"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailData.smtpHost}
                      onChange={(e) => setEmailData({ ...emailData, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailData.smtpPort}
                      onChange={(e) => setEmailData({ ...emailData, smtpPort: e.target.value })}
                      placeholder="587"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar Integration</CardTitle>
                <CardDescription>
                  Sync your calendar for automated appointment management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleClientId">Google Client ID</Label>
                  <Input
                    id="googleClientId"
                    value={calendarData.googleClientId}
                    onChange={(e) => setCalendarData({ ...calendarData, googleClientId: e.target.value })}
                    placeholder="Your Google OAuth Client ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleClientSecret">Google Client Secret</Label>
                  <Input
                    id="googleClientSecret"
                    type="password"
                    value={calendarData.googleClientSecret}
                    onChange={(e) => setCalendarData({ ...calendarData, googleClientSecret: e.target.value })}
                    placeholder="Your Google OAuth Client Secret"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step5')}>
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
