'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Workflow,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface IntegrationStatus {
  phone: 'ready' | 'not_configured' | 'error'
  whatsapp: 'ready' | 'not_configured' | 'error'
  email: 'ready' | 'not_configured' | 'error'
  calendar: 'ready' | 'not_configured' | 'error'
  ai: 'ready' | 'not_configured' | 'error'
  webhooks: 'ready' | 'not_configured' | 'error'
}

export default function IntegrationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<IntegrationStatus | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const wsId = localStorage.getItem('workspaceId')
        if (!wsId) {
          toast.error('Workspace nicht gefunden')
          return
        }
        setWorkspaceId(wsId)

        const response = await fetch(`/api/provisioning/status?workspaceId=${wsId}`)
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (error) {
        toast.error('Status konnte nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-600">Verbunden</Badge>
      case 'error':
        return <Badge variant="destructive">Fehler</Badge>
      default:
        return <Badge variant="secondary">Nicht konfiguriert</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Integration ist aktiv und funktioniert'
      case 'error':
        return 'Es ist ein Fehler aufgetreten'
      default:
        return 'Integration noch nicht eingerichtet'
    }
  }

  const integrations = [
    {
      id: 'phone',
      name: 'Telefon & Anruf-KI',
      description: 'Automatische Telefonnummer und KI-gestützte Anrufbearbeitung',
      icon: Phone,
      status: status?.phone || 'not_configured',
      setupPath: '/dashboard/phone/setup',
      testPath: '/dashboard/phone',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp & Gym-Buddy',
      description: 'WhatsApp Business API und automatischer Fitness-Coach',
      icon: MessageSquare,
      status: status?.whatsapp || 'not_configured',
      setupPath: '/dashboard/whatsapp-coach',
      testPath: '/dashboard/messages',
    },
    {
      id: 'email',
      name: 'E-Mail Integration',
      description: 'SMTP/IMAP für automatische E-Mail-Verarbeitung',
      icon: Mail,
      status: status?.email || 'not_configured',
      setupPath: '/dashboard/email/setup',
      testPath: '/dashboard/messages',
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Automatische Terminbuchung und Synchronisation',
      icon: Calendar,
      status: status?.calendar || 'not_configured',
      setupPath: '/dashboard/calendar/setup',
      testPath: '/dashboard/calendar',
    },
    {
      id: 'webhooks',
      name: 'n8n Workflows',
      description: 'Erweiterte Automatisierung mit n8n',
      icon: Workflow,
      status: status?.webhooks || 'not_configured',
      setupPath: '/dashboard/n8n/setup',
      testPath: null,
    },
  ]

  if (loading) {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrationen</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Verwalte alle externen Dienste und KI-Integrationen für dein Studio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      {getStatusBadge(integration.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getStatusText(integration.status)}
                    </p>
                    <div className="flex gap-2">
                      {integration.status === 'not_configured' ? (
                        <Button
                          onClick={() => router.push(integration.setupPath)}
                          className="w-full"
                        >
                          Jetzt einrichten
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => router.push(integration.setupPath)}
                            variant="outline"
                            className="flex-1"
                          >
                            Konfigurieren
                          </Button>
                          {integration.testPath && (
                            <Button
                              onClick={() => router.push(integration.testPath)}
                              variant="outline"
                              className="flex-1"
                            >
                              Öffnen
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              💡 Tipp: Self-Service Integrationen
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200">
            <p className="text-sm">
              Alle Integrationen können von dir selbst eingerichtet werden - ohne Kontakt zum Support.
              Klicke einfach auf "Jetzt einrichten" und folge den Schritten. Bei Problemen findest du
              in jeder Integration eine Test-Funktion und detaillierte Fehlermeldungen.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
