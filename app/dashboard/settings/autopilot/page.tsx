'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ProvisioningJob {
  id: string
  status: string
  progress: number
  result?: {
    steps?: Array<{
      name: string
      status: string
      details: string
      timestamp: string
    }>
  }
  error?: string
  createdAt: string
  completedAt?: string
}

export default function AutopilotSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [job, setJob] = useState<ProvisioningJob | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    const wsId = localStorage.getItem('workspaceId')
    setWorkspaceId(wsId)
    
    if (wsId) {
      loadJobStatus(wsId)
    }
  }, [])

  const loadJobStatus = async (wsId: string) => {
    try {
      const response = await fetch(`/api/autopilot/status?workspaceId=${wsId}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      }
    } catch (error) {
      console.error('Failed to load job status:', error)
    }
  }

  const handleReprovision = async () => {
    if (!workspaceId) {
      toast.error('Workspace ID nicht gefunden')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/autopilot/reprovision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'Provisioning gestartet')
        setTimeout(() => loadJobStatus(workspaceId), 1000)
      } else {
        toast.error(data.error || 'Fehler beim Starten')
      }
    } catch (error) {
      console.error('Reprovision error:', error)
      toast.error('Fehler beim Starten der Provisioning')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Abgeschlossen</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />In Bearbeitung</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Ausstehend</Badge>
      case 'failed':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Fehlgeschlagen</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Autopilot Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie die automatische Provisioning Ihrer Integrationen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provisioning Status</CardTitle>
            <CardDescription>
              Aktueller Status der automatischen Einrichtung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {job ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gestartet: {new Date(job.createdAt).toLocaleString('de-DE')}
                    </div>
                    {job.completedAt && (
                      <div className="text-sm text-muted-foreground">
                        Abgeschlossen: {new Date(job.completedAt).toLocaleString('de-DE')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{job.progress}%</div>
                    <div className="text-sm text-muted-foreground">Fortschritt</div>
                  </div>
                </div>

                {job.progress > 0 && job.progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}

                {job.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 font-medium">Fehler:</p>
                    <p className="text-sm text-red-600 mt-1">{job.error}</p>
                  </div>
                )}

                {job.result?.steps && job.result.steps.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Schritte:</h3>
                    <div className="space-y-2">
                      {job.result.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                        >
                          {getStepStatusIcon(step.status)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{step.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {step.details}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(step.timestamp).toLocaleString('de-DE')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Keine Provisioning-Jobs gefunden</p>
                <p className="text-sm mt-2">
                  Starten Sie die automatische Einrichtung mit dem Button unten
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                onClick={handleReprovision}
                disabled={loading || (job?.status === 'in_progress')}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gestartet...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Setup neu ausführen
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Startet die automatische Einrichtung aller Integrationen
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Was macht Autopilot?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Twilio Subaccount erstellen und Telefonnummer kaufen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>WhatsApp Integration konfigurieren</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>E-Mail Credentials einrichten</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Standard AI-Regeln und WhatsApp Coach konfigurieren</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Smoke Tests durchführen</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
