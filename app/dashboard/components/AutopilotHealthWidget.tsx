'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react'

interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  integrations: {
    twilio: { status: string; details?: string }
    whatsapp: { status: string; details?: string }
    email: { status: string; details?: string }
  }
  provisioning: {
    status: string
    lastJobProgress?: number
  }
  scheduler: {
    pendingFollowups: number
  }
  issues: Array<{
    severity: string
    component: string
    message: string
    actionable: boolean
    action?: string
  }>
}

export function AutopilotHealthWidget({ workspaceId }: { workspaceId: string }) {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const loadHealth = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/autopilot/health?workspaceId=${workspaceId}`)
      if (response.ok) {
        const data = await response.json()
        setHealth(data.health)
      }
    } catch (error) {
      console.error('Failed to load health:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHealth()
    const interval = setInterval(loadHealth, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [workspaceId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!health) {
    return null
  }

  const getOverallBadge = () => {
    switch (health.overall) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Healthy</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Degraded</Badge>
      case 'unhealthy':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Unhealthy</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Autopilot status and integrations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getOverallBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadHealth}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Integrations */}
        <div>
          <h3 className="font-medium text-sm mb-2">Integrations</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.integrations.twilio.status)}
                <span className="text-sm">Twilio</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {health.integrations.twilio.details || health.integrations.twilio.status}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.integrations.whatsapp.status)}
                <span className="text-sm">WhatsApp</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {health.integrations.whatsapp.details || health.integrations.whatsapp.status}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.integrations.email.status)}
                <span className="text-sm">Email</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {health.integrations.email.details || health.integrations.email.status}
              </span>
            </div>
          </div>
        </div>

        {/* Provisioning */}
        {health.provisioning.status !== 'idle' && (
          <div>
            <h3 className="font-medium text-sm mb-2">Provisioning</h3>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm capitalize">{health.provisioning.status}</span>
                {health.provisioning.lastJobProgress !== undefined && (
                  <span className="text-sm font-medium">{health.provisioning.lastJobProgress}%</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scheduler */}
        <div>
          <h3 className="font-medium text-sm mb-2">WhatsApp Coach</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Messages</span>
              <span className="text-sm font-medium">{health.scheduler.pendingFollowups}</span>
            </div>
          </div>
        </div>

        {/* Issues */}
        {health.issues.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2">Issues</h3>
            <div className="space-y-2">
              {health.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    issue.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : issue.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {issue.severity === 'critical' ? (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : issue.severity === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{issue.component}</p>
                      <p className="text-sm text-muted-foreground mt-1">{issue.message}</p>
                      {issue.actionable && issue.action && (
                        <p className="text-xs text-muted-foreground mt-1">
                          → {issue.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
