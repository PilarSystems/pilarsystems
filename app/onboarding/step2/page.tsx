'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'
import { Loader2, Check, X } from 'lucide-react'

interface ChannelStatus {
  phone: 'not_started' | 'connecting' | 'connected' | 'error'
  whatsapp: 'not_started' | 'connecting' | 'connected' | 'error'
  email: 'not_started' | 'connecting' | 'connected' | 'error'
  calendar: 'not_started' | 'connecting' | 'connected' | 'error'
}

export default function OnboardingStep2() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>({
    phone: 'not_started',
    whatsapp: 'not_started',
    email: 'not_started',
    calendar: 'not_started',
  })

  const [phoneOption, setPhoneOption] = useState<'buy' | 'own' | null>(null)
  const [phoneCountry, setPhoneCountry] = useState('DE')
  const [ownPhoneNumber, setOwnPhoneNumber] = useState('')

  const [whatsappToken, setWhatsappToken] = useState('')
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('')

  const [emailAddress, setEmailAddress] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook' | 'custom'>('gmail')

  useEffect(() => {
    const loadWorkspace = async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/onboarding/workspace?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setWorkspaceId(data.workspaceId)
      }
    }
    loadWorkspace()
  }, [router])

  const handlePhoneSetup = async () => {
    if (!workspaceId) return

    setChannelStatus({ ...channelStatus, phone: 'connecting' })

    try {
      if (phoneOption === 'buy') {
        const response = await fetch('/api/provisioning/twilio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId,
            country: phoneCountry,
            action: 'buy_number',
          }),
        })

        if (!response.ok) throw new Error('Failed to purchase number')

        toast.success('Phone number purchase initiated')
        setChannelStatus({ ...channelStatus, phone: 'connected' })
      } else if (phoneOption === 'own') {
        const response = await fetch('/api/onboarding/step2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId,
            channel: 'phone',
            config: { phoneNumber: ownPhoneNumber, type: 'own' },
          }),
        })

        if (!response.ok) throw new Error('Failed to save phone configuration')

        toast.success('Phone configuration saved')
        setChannelStatus({ ...channelStatus, phone: 'connected' })
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup phone')
      setChannelStatus({ ...channelStatus, phone: 'error' })
    }
  }

  const handleWhatsAppSetup = async () => {
    if (!workspaceId) return

    setChannelStatus({ ...channelStatus, whatsapp: 'connecting' })

    try {
      const response = await fetch('/api/provisioning/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          accessToken: whatsappToken,
          phoneNumberId: whatsappPhoneId,
        }),
      })

      if (!response.ok) throw new Error('Failed to connect WhatsApp')

      toast.success('WhatsApp connected successfully')
      setChannelStatus({ ...channelStatus, whatsapp: 'connected' })
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect WhatsApp')
      setChannelStatus({ ...channelStatus, whatsapp: 'error' })
    }
  }

  const handleEmailSetup = async () => {
    if (!workspaceId) return

    setChannelStatus({ ...channelStatus, email: 'connecting' })

    try {
      const response = await fetch('/api/provisioning/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          email: emailAddress,
          password: emailPassword,
          provider: emailProvider,
        }),
      })

      if (!response.ok) throw new Error('Failed to connect email')

      toast.success('Email connected successfully')
      setChannelStatus({ ...channelStatus, email: 'connected' })
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect email')
      setChannelStatus({ ...channelStatus, email: 'error' })
    }
  }

  const handleCalendarSetup = async () => {
    if (!workspaceId) return

    setChannelStatus({ ...channelStatus, calendar: 'connecting' })

    try {
      window.location.href = `/api/provisioning/calendar?workspaceId=${workspaceId}`
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect calendar')
      setChannelStatus({ ...channelStatus, calendar: 'error' })
    }
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      await fetch('/api/onboarding/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          completed: true,
          channelStatus,
        }),
      })

      router.push('/onboarding/step3')
    } catch (error: any) {
      toast.error(error.message || 'Failed to continue')
    } finally {
      setLoading(false)
    }
  }

  const StatusIcon = ({ status }: { status: ChannelStatus[keyof ChannelStatus] }) => {
    if (status === 'connected') return <Check className="h-5 w-5 text-green-500" />
    if (status === 'error') return <X className="h-5 w-5 text-red-500" />
    if (status === 'connecting') return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    return null
  }

  const canContinue = Object.values(channelStatus).some(status => status === 'connected')

  return (
    <OnboardingLayout
      currentStep={2}
      title="Kanäle verbinden"
      description="Verbinde deine Kommunikationskanäle für die Automatisierung"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Telefon / Voice AI</CardTitle>
                <CardDescription>Automatische Anrufannahme und Weiterleitung</CardDescription>
              </div>
              <StatusIcon status={channelStatus.phone} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wähle eine Option</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={phoneOption === 'buy' ? 'default' : 'outline'}
                  onClick={() => setPhoneOption('buy')}
                >
                  Neue Nummer kaufen
                </Button>
                <Button
                  type="button"
                  variant={phoneOption === 'own' ? 'default' : 'outline'}
                  onClick={() => setPhoneOption('own')}
                >
                  Eigene Nummer verbinden
                </Button>
              </div>
            </div>

            {phoneOption === 'buy' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Land</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                  >
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                </div>
                <Button onClick={handlePhoneSetup} disabled={channelStatus.phone === 'connecting'}>
                  {channelStatus.phone === 'connecting' ? 'Wird gekauft...' : 'Nummer kaufen'}
                </Button>
              </div>
            )}

            {phoneOption === 'own' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Telefonnummer</Label>
                  <Input
                    type="tel"
                    placeholder="+49 123 456789"
                    value={ownPhoneNumber}
                    onChange={(e) => setOwnPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handlePhoneSetup} disabled={channelStatus.phone === 'connecting'}>
                  {channelStatus.phone === 'connecting' ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>Automatische Nachrichtenverarbeitung</CardDescription>
              </div>
              <StatusIcon status={channelStatus.whatsapp} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                type="password"
                placeholder="EAAxxxxxxxxxx"
                value={whatsappToken}
                onChange={(e) => setWhatsappToken(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input
                placeholder="123456789012345"
                value={whatsappPhoneId}
                onChange={(e) => setWhatsappPhoneId(e.target.value)}
              />
            </div>
            <Button onClick={handleWhatsAppSetup} disabled={channelStatus.whatsapp === 'connecting'}>
              {channelStatus.whatsapp === 'connecting' ? 'Wird verbunden...' : 'WhatsApp verbinden'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>E-Mail</CardTitle>
                <CardDescription>Automatische E-Mail-Verarbeitung</CardDescription>
              </div>
              <StatusIcon status={channelStatus.email} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>E-Mail-Adresse</Label>
              <Input
                type="email"
                placeholder="studio@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>App-Passwort</Label>
              <Input
                type="password"
                placeholder="App-spezifisches Passwort"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Anbieter</Label>
              <select
                className="w-full p-2 border rounded"
                value={emailProvider}
                onChange={(e) => setEmailProvider(e.target.value as any)}
              >
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="custom">Andere</option>
              </select>
            </div>
            <Button onClick={handleEmailSetup} disabled={channelStatus.email === 'connecting'}>
              {channelStatus.email === 'connecting' ? 'Wird verbunden...' : 'E-Mail verbinden'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kalender</CardTitle>
                <CardDescription>Google Calendar Synchronisation</CardDescription>
              </div>
              <StatusIcon status={channelStatus.calendar} />
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCalendarSetup} disabled={channelStatus.calendar === 'connecting'}>
              {channelStatus.calendar === 'connecting' ? 'Wird verbunden...' : 'Mit Google Calendar verbinden'}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step1')}>
            Zurück
          </Button>
          <Button onClick={handleContinue} disabled={!canContinue || loading}>
            {loading ? 'Wird gespeichert...' : 'Weiter'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
