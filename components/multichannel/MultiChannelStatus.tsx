'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  BarChart3,
} from 'lucide-react'

interface ChannelStatus {
  whatsapp: {
    enabled: boolean
    status: string
  }
  sms: {
    enabled: boolean
    status: string
    templateCount: number
  }
  email: {
    enabled: boolean
    status: string
    templateCount: number
  }
}

interface MultiChannelStatusProps {
  workspaceId: string
  onChannelClick?: (channel: 'whatsapp' | 'sms' | 'email') => void
}

export function MultiChannelStatus({ workspaceId, onChannelClick }: MultiChannelStatusProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ChannelStatus | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [workspaceId])

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/multichannel/status?workspaceId=${workspaceId}`)
      if (response.ok) {
        const data = await response.json()
        setStatus(data.channels)
      } else {
        toast.error('Status konnte nicht geladen werden')
      }
    } catch (error) {
      toast.error('Fehler beim Laden des Status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-gray-400" />
    )
  }

  const getStatusBadge = (enabled: boolean, status: string) => {
    if (enabled && status === 'active') {
      return <Badge className="bg-green-600">Aktiv</Badge>
    }
    return <Badge variant="secondary">Nicht konfiguriert</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  const channels = [
    {
      id: 'whatsapp' as const,
      name: 'WhatsApp',
      description: 'WhatsApp Business API für automatische Nachrichten',
      icon: MessageSquare,
      enabled: status?.whatsapp.enabled || false,
      status: status?.whatsapp.status || 'not_configured',
      color: 'text-green-600',
    },
    {
      id: 'sms' as const,
      name: 'SMS',
      description: 'SMS-Nachrichten über Twilio',
      icon: Phone,
      enabled: status?.sms.enabled || false,
      status: status?.sms.status || 'not_configured',
      templateCount: status?.sms.templateCount || 0,
      color: 'text-blue-600',
    },
    {
      id: 'email' as const,
      name: 'E-Mail',
      description: 'E-Mail-Kampagnen und automatische Antworten',
      icon: Mail,
      enabled: status?.email.enabled || false,
      status: status?.email.status || 'not_configured',
      templateCount: status?.email.templateCount || 0,
      color: 'text-purple-600',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Multi-Channel Kommunikation
        </CardTitle>
        <CardDescription>
          Status aller Kommunikationskanäle für automatische Nachrichten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <div
                key={channel.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => onChannelClick?.(channel.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                    <Icon className={`h-5 w-5 ${channel.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{channel.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {channel.description}
                    </p>
                    {'templateCount' in channel && (channel.templateCount ?? 0) > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {channel.templateCount} Templates verfügbar
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(channel.enabled, channel.status)}
                  {getStatusIcon(channel.enabled)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/dashboard/analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics anzeigen
          </Button>
          <Button
            className="flex-1"
            onClick={fetchStatus}
          >
            Status aktualisieren
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
