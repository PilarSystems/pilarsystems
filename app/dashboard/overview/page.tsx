'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardOverviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeadsToday: 0,
    probetrainings: 0,
    probetrainingShowUpRate: 0,
    noShowReduction: 0,
    activeConversations: 0,
    conversionRate: 0,
    missedCalls: 0,
    scheduledEvents: 0,
    automationStatus: 'active' as 'active' | 'paused' | 'error',
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        toast.error('Dashboard-Statistiken konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const getAutomationStatusBadge = () => {
    switch (stats.automationStatus) {
      case 'active':
        return <Badge className="bg-green-600">Automatisierung aktiv</Badge>
      case 'paused':
        return <Badge variant="secondary">Automatisierung pausiert</Badge>
      case 'error':
        return <Badge variant="destructive">Fehler</Badge>
      default:
        return <Badge variant="secondary">Unbekannt</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Willkommen zurück! Hier ist, was heute in deinem Studio passiert.
            </p>
          </div>
          {getAutomationStatusBadge()}
        </div>

        {/* Main KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                +{stats.newLeadsToday} heute neu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Probetrainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.probetrainings}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Diese Woche
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Show-up Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.probetrainingShowUpRate}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Probetraining Erscheinungsrate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No-Show Reduktion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-{stats.noShowReduction}%</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                Durch KI-Erinnerungen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Gespräche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeConversations}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Über alle Kanäle
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Lead zu Mitglied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verpasste Anrufe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.missedCalls}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Warten auf Follow-up
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
              <CardDescription>Neueste Interaktionen mit deinen Leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Neuer Lead über WhatsApp</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">vor 2 Minuten</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Probetraining gebucht</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">vor 15 Minuten</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Verpasster Anruf - KI Follow-up gesendet</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">vor 1 Stunde</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">E-Mail-Anfrage automatisch beantwortet</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">vor 2 Stunden</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schnellzugriff</CardTitle>
              <CardDescription>Häufige Aufgaben und Shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/leads')}
                >
                  Alle Leads anzeigen
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/messages')}
                >
                  Nachrichten prüfen
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/calendar')}
                >
                  Kalender öffnen
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  KI-Regeln konfigurieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Status */}
        <Card>
          <CardHeader>
            <CardTitle>Kanal-Status</CardTitle>
            <CardDescription>Übersicht über verbundene Kommunikationskanäle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aktiv</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aktiv</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <div>
                  <p className="text-sm font-medium">E-Mail</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aktiv</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <div>
                  <p className="text-sm font-medium">Kalender</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Synchronisiert</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
