'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Phone, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export default function PhoneSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [provisioned, setProvisioned] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    countryCode: 'DE',
    areaCode: '',
    numberType: 'local' as 'local' | 'mobile' | 'tollfree',
  })

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

        const response = await fetch(`/api/provisioning/twilio?workspaceId=${wsId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.provisioned && data.result?.phoneNumber) {
            setProvisioned(true)
            setPhoneNumber(data.result.phoneNumber)
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

  const handleProvision = async () => {
    if (!workspaceId) {
      toast.error('Workspace nicht gefunden')
      return
    }

    setLoading(true)
    try {
      const workspaceName = localStorage.getItem('workspaceName') || 'Studio'
      
      const response = await fetch('/api/provisioning/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          workspaceName,
          countryCode: formData.countryCode,
          areaCode: formData.areaCode || undefined,
          numberType: formData.numberType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'FEATURE_DISABLED_TWILIO_MASTER') {
          toast.error('Telefonie-Funktion nicht verfügbar', {
            description: 'Die automatische Telefonnummer-Einrichtung ist derzeit nicht aktiviert. Bitte kontaktiere den Support.',
          })
        } else {
          toast.error('Fehler bei der Einrichtung', {
            description: data.error || 'Bitte versuche es später erneut',
          })
        }
        return
      }

      toast.success('Telefonnummer erfolgreich eingerichtet!', {
        description: `Deine neue Nummer: ${data.data.phoneNumber}`,
      })

      setProvisioned(true)
      setPhoneNumber(data.data.phoneNumber)

      setTimeout(() => {
        router.push('/dashboard/phone')
      }, 2000)
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten', {
        description: 'Bitte versuche es später erneut',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestCall = async () => {
    if (!phoneNumber) return
    
    toast.info('Test-Anruf wird vorbereitet...', {
      description: 'Du erhältst gleich einen Anruf auf deine hinterlegte Nummer',
    })
    
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
      <div className="space-y-6 max-w-2xl">
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

        <div>
          <h1 className="text-3xl font-bold">Telefon & Anruf-KI einrichten</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Richte automatisch eine Telefonnummer ein und aktiviere die KI-gestützte Anrufbearbeitung
          </p>
        </div>

        {provisioned ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-green-900 dark:text-green-100">
                    Telefonnummer aktiv
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Deine Telefonnummer ist eingerichtet und einsatzbereit
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deine Nummer</p>
                  <p className="text-2xl font-bold">{phoneNumber}</p>
                </div>
                <Phone className="h-8 w-8 text-gray-400" />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTestCall}
                  variant="outline"
                  className="flex-1"
                >
                  Test-Anruf
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/phone')}
                  className="flex-1"
                >
                  Zum Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Automatische Telefonnummer einrichten</CardTitle>
              <CardDescription>
                Wir richten für dich automatisch eine Telefonnummer ein und konfigurieren die KI-Anrufbearbeitung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="countryCode">Land</Label>
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, countryCode: value })
                    }
                  >
                    <SelectTrigger id="countryCode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DE">🇩🇪 Deutschland</SelectItem>
                      <SelectItem value="AT">🇦🇹 Österreich</SelectItem>
                      <SelectItem value="CH">🇨🇭 Schweiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaCode">Ortsvorwahl (optional)</Label>
                  <Input
                    id="areaCode"
                    placeholder="z.B. 030 für Berlin"
                    value={formData.areaCode}
                    onChange={(e) =>
                      setFormData({ ...formData, areaCode: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Wenn leer, wird eine beliebige verfügbare Nummer gewählt
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberType">Nummerntyp</Label>
                  <Select
                    value={formData.numberType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, numberType: value })
                    }
                  >
                    <SelectTrigger id="numberType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Festnetz (lokal)</SelectItem>
                      <SelectItem value="mobile">Mobilfunk</SelectItem>
                      <SelectItem value="tollfree">Kostenlos (0800)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Was passiert bei der Einrichtung?</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                      <li>Automatische Telefonnummer wird gekauft</li>
                      <li>KI-Anrufbearbeitung wird konfiguriert</li>
                      <li>Webhooks werden eingerichtet</li>
                      <li>Nummer ist sofort einsatzbereit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProvision}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird eingerichtet...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Jetzt automatisch einrichten
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Die Einrichtung dauert ca. 30-60 Sekunden
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Nach der Einrichtung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">1</Badge>
              <div>
                <p className="font-medium">KI-Persönlichkeit konfigurieren</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Passe die Begrüßung und Tonalität der KI an dein Studio an
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-1">2</Badge>
              <div>
                <p className="font-medium">Öffnungszeiten festlegen</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Definiere, wann die KI Anrufe entgegennimmt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-1">3</Badge>
              <div>
                <p className="font-medium">Test-Anruf durchführen</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Teste die KI mit einem echten Anruf
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
