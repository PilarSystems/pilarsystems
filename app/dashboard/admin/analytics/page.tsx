'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  TrendingUp, 
  TrendingDown,
  Zap,
  MessageSquare,
  Mail,
  Phone,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface PerformanceMetrics {
  timestamp: string
  api: {
    totalRequests: number
    averageLatencyMs: number
    p95LatencyMs: number
    slowRequests: number
    cachedRequests: number
  }
  database: {
    totalQueries: number
    slowQueries: number
    avgQueryTimeMs: number
  }
  channels: {
    whatsapp: { sent: number; delivered: number; failed: number }
    sms: { sent: number; delivered: number; failed: number }
    email: { sent: number; delivered: number; failed: number }
  }
  system: {
    uptime: number
    memoryUsage: number
  }
  trends: {
    requestsChange: number
    latencyChange: number
  }
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/performance')

      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }

      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load metrics'
      toast.error(message)
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

  const getHealthBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Good</Badge>
    }
    if (value <= thresholds.warning) {
      return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>
    }
    return <Badge className="bg-red-500"><AlertTriangle className="w-3 h-3 mr-1" />Critical</Badge>
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics</p>
          <Button onClick={fetchMetrics} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-gray-600">Performance metrics and system health</p>
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
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">API Performance</TabsTrigger>
          <TabsTrigger value="channels">Channel Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* API Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.api.averageLatencyMs}ms</div>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthBadge(metrics.api.averageLatencyMs, { good: 100, warning: 300 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">P95 Latency</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.api.p95LatencyMs}ms</div>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthBadge(metrics.api.p95LatencyMs, { good: 200, warning: 500 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.api.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.api.cachedRequests} cached ({metrics.api.totalRequests > 0 ? Math.round((metrics.api.cachedRequests / metrics.api.totalRequests) * 100) : 0}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Slow Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.api.slowRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requests {'>'} 1000ms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Database Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Database Performance</CardTitle>
              <CardDescription>Query metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Queries</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.database.totalQueries.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Avg Query Time</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.database.avgQueryTimeMs}ms</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Slow Queries</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.database.slowQueries}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          {/* Channel Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                <MessageSquare className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-bold">{metrics.channels.whatsapp.sent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-bold text-green-500">{metrics.channels.whatsapp.delivered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-bold text-red-500">{metrics.channels.whatsapp.failed}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Delivery Rate</span>
                      <span className="font-bold">
                        {metrics.channels.whatsapp.sent > 0 
                          ? Math.round((metrics.channels.whatsapp.delivered / metrics.channels.whatsapp.sent) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS</CardTitle>
                <Phone className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-bold">{metrics.channels.sms.sent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-bold text-green-500">{metrics.channels.sms.delivered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-bold text-red-500">{metrics.channels.sms.failed}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Delivery Rate</span>
                      <span className="font-bold">
                        {metrics.channels.sms.sent > 0 
                          ? Math.round((metrics.channels.sms.delivered / metrics.channels.sms.sent) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <Mail className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-bold">{metrics.channels.email.sent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-bold text-green-500">{metrics.channels.email.delivered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-bold text-red-500">{metrics.channels.email.failed}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Delivery Rate</span>
                      <span className="font-bold">
                        {metrics.channels.email.sent > 0 
                          ? Math.round((metrics.channels.email.delivered / metrics.channels.email.sent) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Server uptime and resource usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Uptime</span>
                  </div>
                  <span className="font-bold">{formatUptime(metrics.system.uptime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-500" />
                    <span>Memory Usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{metrics.system.memoryUsage}%</span>
                    {getHealthBadge(metrics.system.memoryUsage, { good: 70, warning: 85 })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last Updated</CardTitle>
                <CardDescription>Metrics refresh status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Timestamp</span>
                  <span className="font-bold">
                    {new Date(metrics.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-Refresh</span>
                  <Badge className={autoRefresh ? 'bg-green-500' : 'bg-gray-500'}>
                    {autoRefresh ? 'Active (30s)' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
