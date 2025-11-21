'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'
import { Loader2, Check, X, Rocket } from 'lucide-react'

interface SystemStatus {
  phone: 'checking' | 'ready' | 'error' | 'not_configured'
  whatsapp: 'checking' | 'ready' | 'error' | 'not_configured'
  email: 'checking' | 'ready' | 'error' | 'not_configured'
  calendar: 'checking' | 'ready' | 'error' | 'not_configured'
  ai: 'checking' | 'ready' | 'error' | 'not_configured'
  webhooks: 'checking' | 'ready' | 'error' | 'not_configured'
}

export default function OnboardingStep5() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    phone: 'checking',
    whatsapp: 'checking',
    email: 'checking',
    calendar: 'checking',
    ai: 'checking',
    webhooks: 'checking',
  })
  const [testLead, setTestLead] = useState<any>(null)

  useEffect(() => {
    const loadAndCheck = async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/onboarding/workspace?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setWorkspaceId(data.workspaceId)
        await checkSystemStatus(data.workspaceId)
      }
    }
    loadAndCheck()
  }, [router])

  const checkSystemStatus = async (wsId: string) => {
    setChecking(true)

    try {
      const response = await fetch(`/api/provisioning/status?workspaceId=${wsId}`)
      if (response.ok) {
        const data = await response.json()
        setSystemStatus({
          phone: data.phone || 'not_configured',
          whatsapp: data.whatsapp || 'not_configured',
          email: data.email || 'not_configured',
          calendar: data.calendar || 'not_configured',
          ai: data.ai || 'ready',
          webhooks: data.webhooks || 'ready',
        })
      }
    } catch (error) {
    } finally {
      setChecking(false)
    }
  }

  const handleTestLead = async () => {
    if (!workspaceId) return

    setLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: 'Test Lead',
          email: `test-${Date.now()}@pilarsystems.com`,
          phone: '+49123456789',
          source: 'manual',
          classification: 'B',
        }),
      })

      if (!response.ok) throw new Error('Failed to create test lead')

      const lead = await response.json()
      setTestLead(lead)
      toast.success('Test-Lead erfolgreich erstellt!')
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Erstellen des Test-Leads')
    } finally {
      setLoading(false)
    }
  }

  const handleGoLive = async () => {
    if (!workspaceId) return

    setLoading(true)

    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      })

      if (!response.ok) throw new Error('Failed to complete onboarding')

      toast.success('Automatisierung aktiviert! 🎉')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Aktivieren')
    } finally {
      setLoading(false)
    }
  }

  const StatusIcon = ({ status }: { status: SystemStatus[keyof SystemStatus] }) => {
    if (status === 'ready') return <Check className="h-5 w-5 text-green-500" />
    if (status === 'error') return <X className="h-5 w-5 text-red-500" />
    if (status === 'checking') return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    return <X className="h-5 w-5 text-gray-400" />
  }

  const allSystemsReady = Object.values(systemStatus).every(
    status => status === 'ready' || status === 'not_configured'
  )

  const hasAtLeastOneChannel = 
    systemStatus.phone === 'ready' ||
    systemStatus.whatsapp === 'ready' ||
    systemStatus.email === 'ready'

  return (
    <OnboardingLayout
      currentStep={5}
      title="Test & Go-Live"
      description="Überprüfe deine Konfiguration und starte die Automatisierung"
    >
      <div className="space-y-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System-Status</CardTitle>
            <CardDescription>
              Überprüfung aller Komponenten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Telefon / Voice AI</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.phone === 'ready' ? 'Verbunden und bereit' : 
                   systemStatus.phone === 'not_configured' ? 'Nicht konfiguriert (optional)' : 
                   systemStatus.phone === 'checking' ? 'Wird überprüft...' : 'Fehler'}
                </p>
              </div>
              <StatusIcon status={systemStatus.phone} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp Business</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.whatsapp === 'ready' ? 'Verbunden und bereit' : 
                   systemStatus.whatsapp === 'not_configured' ? 'Nicht konfiguriert (optional)' : 
                   systemStatus.whatsapp === 'checking' ? 'Wird überprüft...' : 'Fehler'}
                </p>
              </div>
              <StatusIcon status={systemStatus.whatsapp} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">E-Mail</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.email === 'ready' ? 'Verbunden und bereit' : 
                   systemStatus.email === 'not_configured' ? 'Nicht konfiguriert (optional)' : 
                   systemStatus.email === 'checking' ? 'Wird überprüft...' : 'Fehler'}
                </p>
              </div>
              <StatusIcon status={systemStatus.email} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kalender</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.calendar === 'ready' ? 'Verbunden und bereit' : 
                   systemStatus.calendar === 'not_configured' ? 'Nicht konfiguriert (optional)' : 
                   systemStatus.calendar === 'checking' ? 'Wird überprüft...' : 'Fehler'}
                </p>
              </div>
              <StatusIcon status={systemStatus.calendar} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">KI-Assistent</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.ai === 'ready' ? 'Konfiguriert und bereit' : 'Wird überprüft...'}
                </p>
              </div>
              <StatusIcon status={systemStatus.ai} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Webhooks & Automatisierung</p>
                <p className="text-sm text-gray-500">
                  {systemStatus.webhooks === 'ready' ? 'Konfiguriert und bereit' : 'Wird überprüft...'}
                </p>
              </div>
              <StatusIcon status={systemStatus.webhooks} />
            </div>
          </CardContent>
        </Card>

        {/* Test Lead */}
        <Card>
          <CardHeader>
            <CardTitle>Test-Lead erstellen</CardTitle>
            <CardDescription>
              Erstelle einen Test-Lead, um die Automatisierung zu testen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!testLead ? (
              <Button onClick={handleTestLead} disabled={loading || checking}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  'Test-Lead erstellen'
                )}
              </Button>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Test-Lead erfolgreich erstellt!
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Name: {testLead.name}<br />
                  E-Mail: {testLead.email}<br />
                  Telefon: {testLead.phone}<br />
                  Klassifizierung: {testLead.classification}-Lead
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Go Live */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Automatisierung starten
            </CardTitle>
            <CardDescription>
              Aktiviere die vollständige Automatisierung für dein Studio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasAtLeastOneChannel && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Mindestens ein Kommunikationskanal (Telefon, WhatsApp oder E-Mail) muss verbunden sein, um die Automatisierung zu starten.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sobald du die Automatisierung startest:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Werden alle eingehenden Anfragen automatisch verarbeitet</li>
                <li>Leads werden automatisch klassifiziert</li>
                <li>Follow-Ups werden automatisch geplant und versendet</li>
                <li>Termine werden automatisch im Kalender eingetragen</li>
              </ul>
            </div>

            <Button
              onClick={handleGoLive}
              disabled={loading || checking || !hasAtLeastOneChannel}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Wird aktiviert...
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5 mr-2" />
                  Automatisierung jetzt starten
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step4')}>
            Zurück
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
