'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  MessageSquare,
  Phone,
  Mail,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
} from 'lucide-react'

interface ChannelMetrics {
  sent: number
  delivered: number
  read: number
  failed: number
  bounced: number
  responseRate: number
  avgDeliveryTimeMs: number
}

interface AnalyticsData {
  period: string
  startDate: string
  endDate: string
  totalMessages: number
  byChannel: {
    whatsapp: ChannelMetrics
    sms: ChannelMetrics
    email: ChannelMetrics
  }
  overall: ChannelMetrics & {
    topPerformingChannel: string | null
    deliverySuccessRate: number
  }
  trends: {
    sentTrend: number
    deliveryRateTrend: number
    responseRateTrend: number
  }
}

interface DailyBreakdown {
  date: string
  whatsapp: number
  sms: number
  email: number
  total: number
}

interface MultiChannelAnalyticsDashboardProps {
  workspaceId: string
}

export function MultiChannelAnalyticsDashboard({ workspaceId }: MultiChannelAnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdown[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('30')

  useEffect(() => {
    fetchAnalytics()
  }, [workspaceId, selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod))

      const [overviewRes, dailyRes] = await Promise.all([
        fetch(
          `/api/multichannel/analytics?workspaceId=${workspaceId}&type=overview&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        ),
        fetch(
          `/api/multichannel/analytics?workspaceId=${workspaceId}&type=daily&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        ),
      ])

      if (overviewRes.ok) {
        const data = await overviewRes.json()
        setAnalytics(data)
      }

      if (dailyRes.ok) {
        const data = await dailyRes.json()
        setDailyBreakdown(data.breakdown || [])
      }
    } catch (error) {
      toast.error('Analytics konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num)
  }

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const TrendIndicator = ({ value, suffix = '%' }: { value: number; suffix?: string }) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +{value.toFixed(1)}{suffix}
        </span>
      )
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm">
          <TrendingDown className="h-4 w-4 mr-1" />
          {value.toFixed(1)}{suffix}
        </span>
      )
    }
    return <span className="text-gray-500 text-sm">-</span>
  }

  const ChannelCard = ({
    channel,
    icon: Icon,
    color,
    metrics,
  }: {
    channel: string
    icon: React.ElementType
    color: string
    metrics: ChannelMetrics
  }) => {
    const deliveryRate = metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <CardTitle className="text-lg capitalize">{channel}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gesendet</p>
              <p className="text-2xl font-bold">{formatNumber(metrics.sent)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zugestellt</p>
              <p className="text-2xl font-bold">{formatNumber(metrics.delivered)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zustellrate</p>
              <p className="text-lg font-semibold text-green-600">
                {formatPercent(deliveryRate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Antwortrate</p>
              <p className="text-lg font-semibold text-blue-600">
                {formatPercent(metrics.responseRate)}
              </p>
            </div>
          </div>
          {metrics.failed > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Badge variant="destructive" className="text-xs">
                {formatNumber(metrics.failed)} fehlgeschlagen
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Channel Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Übersicht aller Kommunikationskanäle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as '7' | '30' | '90')}>
            <TabsList>
              <TabsTrigger value="7">7 Tage</TabsTrigger>
              <TabsTrigger value="30">30 Tage</TabsTrigger>
              <TabsTrigger value="90">90 Tage</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gesamt Nachrichten</CardDescription>
            <CardTitle className="text-3xl">
              {formatNumber(analytics?.totalMessages || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendIndicator value={analytics?.trends.sentTrend || 0} suffix="" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Zustellrate</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {formatPercent(analytics?.overall.deliverySuccessRate || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendIndicator value={analytics?.trends.deliveryRateTrend || 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Antwortrate</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {formatPercent(analytics?.overall.responseRate || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendIndicator value={analytics?.trends.responseRateTrend || 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bester Kanal</CardDescription>
            <CardTitle className="text-xl capitalize">
              {analytics?.overall.topPerformingChannel || '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-600">Top Performer</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Channel-specific cards */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-3">
          <ChannelCard
            channel="whatsapp"
            icon={MessageSquare}
            color="text-green-600"
            metrics={analytics.byChannel.whatsapp}
          />
          <ChannelCard
            channel="sms"
            icon={Phone}
            color="text-blue-600"
            metrics={analytics.byChannel.sms}
          />
          <ChannelCard
            channel="email"
            icon={Mail}
            color="text-purple-600"
            metrics={analytics.byChannel.email}
          />
        </div>
      )}

      {/* Daily Activity */}
      {dailyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tägliche Aktivität</CardTitle>
            <CardDescription>
              Nachrichten pro Tag nach Kanal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Datum</th>
                    <th className="text-center p-2">
                      <MessageSquare className="h-4 w-4 inline text-green-600" /> WhatsApp
                    </th>
                    <th className="text-center p-2">
                      <Phone className="h-4 w-4 inline text-blue-600" /> SMS
                    </th>
                    <th className="text-center p-2">
                      <Mail className="h-4 w-4 inline text-purple-600" /> Email
                    </th>
                    <th className="text-center p-2 font-bold">Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyBreakdown.slice(-7).map((day) => (
                    <tr key={day.date} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">
                        {new Date(day.date).toLocaleDateString('de-DE', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </td>
                      <td className="text-center p-2">{day.whatsapp}</td>
                      <td className="text-center p-2">{day.sms}</td>
                      <td className="text-center p-2">{day.email}</td>
                      <td className="text-center p-2 font-bold">{day.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
