'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, AlertTriangle, CheckCircle, Clock, Database, DollarSign, TrendingUp, Users, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Metrics {
  timestamp: string
  workspaces: { total: number }
  subscriptions: { active: number; trialing: number; pastDue: number }
  leads: { total: number; newToday: number }
  events: { total: number; pending: number; failed: number; last24h: number }
  jobs: { total: number; pending: number; failed: number; last24h: number }
  affiliates: { total: number; active: number; conversions: number; pendingPayouts: number }
  queueDepth: { events: number; jobs: number }
  healthStatus: { overall: string; events: string; jobs: string; stripe: string }
  recentErrors: Array<{ id: string; type: string; error: string; createdAt: string; workspaceId: string }>
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }

      const data = await response.json()
      setMetrics(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Degraded</Badge>
      case 'unhealthy':
        return <Badge className="bg-red-500"><AlertTriangle className="w-3 h-3 mr-1" />Unhealthy</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load metrics</p>
          <Button onClick={fetchMetrics} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-gray-600">Real-time platform health and metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button onClick={fetchMetrics}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {getHealthBadge(metrics.healthStatus.overall)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workspaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.workspaces.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.subscriptions.active} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Depth</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.queueDepth.events + metrics.queueDepth.jobs}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.queueDepth.events} events, {metrics.queueDepth.jobs} jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(metrics.affiliates.pendingPayouts / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.affiliates.conversions} total conversions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Current subscription status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Active</span>
              </div>
              <span className="font-bold">{metrics.subscriptions.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Trialing</span>
              </div>
              <span className="font-bold">{metrics.subscriptions.trialing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Past Due</span>
              </div>
              <span className="font-bold">{metrics.subscriptions.pastDue}</span>
            </div>
            <div className="pt-4 border-t">
              {getHealthBadge(metrics.healthStatus.stripe)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>Lead generation metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Total Leads</span>
              </div>
              <span className="font-bold">{metrics.leads.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>New Today</span>
              </div>
              <span className="font-bold">{metrics.leads.newToday}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Autopilot Events</CardTitle>
            <CardDescription>Event processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Events</span>
              <span className="font-bold">{metrics.events.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last 24h</span>
              <span className="font-bold">{metrics.events.last24h}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending</span>
              <span className="font-bold text-yellow-500">{metrics.events.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Failed</span>
              <span className="font-bold text-red-500">{metrics.events.failed}</span>
            </div>
            <div className="pt-4 border-t">
              {getHealthBadge(metrics.healthStatus.events)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autopilot Jobs</CardTitle>
            <CardDescription>Job processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Jobs</span>
              <span className="font-bold">{metrics.jobs.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last 24h</span>
              <span className="font-bold">{metrics.jobs.last24h}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending</span>
              <span className="font-bold text-yellow-500">{metrics.jobs.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Failed</span>
              <span className="font-bold text-red-500">{metrics.jobs.failed}</span>
            </div>
            <div className="pt-4 border-t">
              {getHealthBadge(metrics.healthStatus.jobs)}
            </div>
          </CardContent>
        </Card>
      </div>

      {metrics.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors (Last Hour)</CardTitle>
            <CardDescription>Latest failed events requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentErrors.map((error) => (
                <div key={error.id} className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="destructive">{error.type}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(error.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{error.error}</p>
                  <p className="text-xs text-gray-500">Workspace: {error.workspaceId}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Program</CardTitle>
          <CardDescription>Affiliate metrics and payouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Affiliates</p>
              <p className="text-2xl font-bold">{metrics.affiliates.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Affiliates</p>
              <p className="text-2xl font-bold">{metrics.affiliates.active}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold">{metrics.affiliates.conversions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold">€{(metrics.affiliates.pendingPayouts / 100).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
