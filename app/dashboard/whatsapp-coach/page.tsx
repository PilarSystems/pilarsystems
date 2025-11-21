'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { MessageSquare, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react'

interface WhatsAppConfig {
  apiToken?: string
  phoneNumberId?: string
  verifyToken?: string
  businessName?: string
}

interface CoachConfig {
  targetAudience: string
  goal: string
  frequency: string
  timeWindow: { start: string; end: string }
  tone: string
  language: string
}

export default function WhatsAppCoachPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [connected, setConnected] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('connection')
  
  const [whatsappConfig, setWhatsAppConfig] = useState<WhatsAppConfig>({
    apiToken: '',
    phoneNumberId: '',
    verifyToken: '',
    businessName: '',
  })

  const [coachConfig, setCoachConfig] = useState<CoachConfig>({
    targetAudience: 'gym_member',
    goal: 'general_fitness',
    frequency: 'daily',
    timeWindow: { start: '09:00', end: '20:00' },
    tone: 'motivational',
    language: 'DE',
  })

  const [testNumber, setTestNumber] = useState('')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const wsId = localStorage.getItem('workspaceId')
        if (!wsId) {
          toast.error('Workspace nicht gefunden')
          router.push('/dashboard')
          return
        }
        setWorkspaceId(wsId)

        const response = await fetch(`/api/provisioning/status?workspaceId=${wsId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.whatsapp === 'ready') {
            setConnected(true)
            setActiveTab('coach')
          }
        }
      } catch (error) {
        console.error('Failed to check status:', error)
      } finally {
        setChecking(false)
      }
    }
    checkStatus()
  }, [router])

  const handleSaveConnection = async () => {
    if (!workspaceId) {
      toast.error('Workspace nicht gefunden')
      return
    }

    if (!whatsappConfig.apiToken || !whatsappConfig.phoneNumberId) {
      toast.error('Bitte fülle alle Pflichtfelder aus')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/provisioning/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          ...whatsappConfig,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error('Fehler bei der Verbindung', {
          description: data.error || 'Bitte überprüfe deine Zugangsdaten',
        })
        return
      }

      toast.success('WhatsApp erfolgreich verbunden!')
      setConnected(true)
      setActiveTab('coach')
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCoachConfig = async () => {
    if (!workspaceId) return

    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp-coach/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          ...coachConfig,
        }),
      })

      if (!response.ok) {
        toast.error('Fehler beim Speichern')
        return
      }

      toast.success('Coach-Konfiguration gespeichert!')
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleSendTest = async () => {
    if (!testNumber) {
      toast.error('Bitte gib eine Telefonnummer ein')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp-coach/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          phoneNumber: testNumber,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error('Test-Nachricht fehlgeschlagen', {
          description: data.error || 'Bitte überprüfe die Nummer',
        })
        return
      }

      toast.success('Test-Nachricht gesendet!', {
        description: 'Überprüfe WhatsApp auf deinem Gerät',
      })
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/integrations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp-Coach</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Automatischer Fitness-Coach für deine Mitglieder via WhatsApp
            </p>
          </div>
          {connected && (
            <Badge className="bg-green-600">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Verbunden
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Verbindung</TabsTrigger>
            <TabsTrigger value="coach" disabled={!connected}>Coach-Konfiguration</TabsTrigger>
            <TabsTrigger value="test" disabled={!connected}>Test</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Cloud API Verbindung</CardTitle>
                <CardDescription>
                  Verbinde deine WhatsApp Business API mit PILAR SYSTEMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiToken">
                    WhatsApp API Token <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="apiToken"
                    type="password"
                    placeholder="EAAxxxxxxxxxxxxxxxx"
                    value={whatsappConfig.apiToken}
                    onChange={(e) =>
                      setWhatsAppConfig({ ...whatsappConfig, apiToken: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Zu finden in Meta for Developers → WhatsApp → API Setup
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId">
                    Phone Number ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumberId"
                    placeholder="123456789012345"
                    value={whatsappConfig.phoneNumberId}
                    onChange={(e) =>
                      setWhatsAppConfig({ ...whatsappConfig, phoneNumberId: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Die ID deiner WhatsApp Business Nummer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verifyToken">Verify Token (optional)</Label>
                  <Input
                    id="verifyToken"
                    placeholder="Dein-Custom-Token"
                    value={whatsappConfig.verifyToken}
                    onChange={(e) =>
                      setWhatsAppConfig({ ...whatsappConfig, verifyToken: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Für Webhook-Verifizierung (beliebiger String)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name (optional)</Label>
                  <Input
                    id="businessName"
                    placeholder="Mein Fitnessstudio"
                    value={whatsappConfig.businessName}
                    onChange={(e) =>
                      setWhatsAppConfig({ ...whatsappConfig, businessName: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleSaveConnection}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird verbunden...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Verbindung speichern
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">
                  💡 WhatsApp Business API einrichten
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
                <p className="text-sm font-semibold">Schritt-für-Schritt:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Gehe zu <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">Meta for Developers</a></li>
                  <li>Erstelle eine App oder wähle eine bestehende</li>
                  <li>Füge das WhatsApp Product hinzu</li>
                  <li>Kopiere den API Token und die Phone Number ID</li>
                  <li>Füge die Daten hier ein und speichere</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coach-Persönlichkeit</CardTitle>
                <CardDescription>
                  Konfiguriere, wie der WhatsApp-Coach mit deinen Mitgliedern kommuniziert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Zielgruppe</Label>
                    <Select
                      value={coachConfig.targetAudience}
                      onValueChange={(value) =>
                        setCoachConfig({ ...coachConfig, targetAudience: value })
                      }
                    >
                      <SelectTrigger id="targetAudience">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gym_member">Gym-Mitglied</SelectItem>
                        <SelectItem value="pt_client">Personal-Training-Kunde</SelectItem>
                        <SelectItem value="fitness_enthusiast">Fitness-Enthusiast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Hauptziel</Label>
                    <Select
                      value={coachConfig.goal}
                      onValueChange={(value) =>
                        setCoachConfig({ ...coachConfig, goal: value })
                      }
                    >
                      <SelectTrigger id="goal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muscle_building">Muskelaufbau</SelectItem>
                        <SelectItem value="weight_loss">Abnehmen</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="general_fitness">Allgemeine Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Nachrichtenhäufigkeit</Label>
                    <Select
                      value={coachConfig.frequency}
                      onValueChange={(value) =>
                        setCoachConfig({ ...coachConfig, frequency: value })
                      }
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Täglich</SelectItem>
                        <SelectItem value="three_per_week">3x pro Woche</SelectItem>
                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tonalität</Label>
                    <Select
                      value={coachConfig.tone}
                      onValueChange={(value) =>
                        setCoachConfig({ ...coachConfig, tone: value })
                      }
                    >
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Lockerer Bro-Talk</SelectItem>
                        <SelectItem value="professional">Professionell</SelectItem>
                        <SelectItem value="motivational">Motivationsorientiert</SelectItem>
                        <SelectItem value="friendly">Freundlich</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeStart">Zeitfenster Start</Label>
                    <Input
                      id="timeStart"
                      type="time"
                      value={coachConfig.timeWindow.start}
                      onChange={(e) =>
                        setCoachConfig({
                          ...coachConfig,
                          timeWindow: { ...coachConfig.timeWindow, start: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeEnd">Zeitfenster Ende</Label>
                    <Input
                      id="timeEnd"
                      type="time"
                      value={coachConfig.timeWindow.end}
                      onChange={(e) =>
                        setCoachConfig({
                          ...coachConfig,
                          timeWindow: { ...coachConfig.timeWindow, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveCoachConfig}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gespeichert...
                    </>
                  ) : (
                    'Konfiguration speichern'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-100">
                  ✨ Beispiel-Nachricht
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-800 dark:text-green-200">
                <p className="text-sm italic">
                  "Hey! 💪 Wie läuft's heute? Hast du schon dein Training gemacht? 
                  Denk dran: Jeder Schritt zählt! Wenn du heute nicht ins Gym kommst, 
                  wie wär's mit einem kurzen Home-Workout? 15 Minuten reichen schon! 🔥"
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test-Nachricht senden</CardTitle>
                <CardDescription>
                  Sende eine Test-Nachricht, um die Verbindung zu überprüfen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testNumber">Telefonnummer (mit Ländercode)</Label>
                  <Input
                    id="testNumber"
                    placeholder="+491234567890"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Format: +49 für Deutschland, +43 für Österreich, +41 für Schweiz
                  </p>
                </div>

                <Button
                  onClick={handleSendTest}
                  disabled={loading || !testNumber}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test-Nachricht senden
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook-URL für Meta</CardTitle>
                <CardDescription>
                  Konfiguriere diese URL in deinen WhatsApp-Einstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm break-all">
                  {typeof window !== 'undefined' && window.location.origin}/api/webhooks/whatsapp
                </div>
                <p className="text-xs text-gray-500">
                  Füge diese URL in Meta for Developers → WhatsApp → Configuration → Webhook ein
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
