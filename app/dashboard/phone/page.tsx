'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PhoneAIPage() {
  const [callLogs, setCallLogs] = useState<any[]>([])

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const response = await fetch('/api/calls')
        if (response.ok) {
          const data = await response.json()
          setCallLogs(data)
        }
      } catch (error) {
        // console.error('Failed to fetch call logs:', error)
      }
    }
    fetchCallLogs()
  }, [])

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'missed':
        return 'bg-red-600'
      case 'answered':
        return 'bg-green-600'
      case 'voicemail':
        return 'bg-blue-600'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Phone AI</h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered call handling and transcription
            </p>
          </div>
          <Badge variant="default" className="bg-green-600">AI Active</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callLogs.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missed Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {callLogs.filter((c) => c.type === 'missed').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Auto follow-up sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voicemails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {callLogs.filter((c) => c.type === 'voicemail').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">AI transcribed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Calls</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
            <TabsTrigger value="voicemail">Voicemail</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {callLogs.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No calls yet. Connect your phone system in settings to start tracking calls.
                    </p>
                    <Button>Configure Phone Integration</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {callLogs.map((call) => (
                  <Card key={call.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {call.fromNumber}
                            <Badge className={getCallTypeColor(call.type)}>{call.type}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {new Date(call.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Duration: {call.duration}s
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {call.transcript && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">AI Transcript:</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {call.transcript}
                          </p>
                        </div>
                      )}
                      {call.aiSummary && (
                        <div className="space-y-2 mt-4">
                          <h4 className="font-semibold text-sm">AI Summary:</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {call.aiSummary}
                          </p>
                        </div>
                      )}
                      {call.aiActions && (
                        <div className="space-y-2 mt-4">
                          <h4 className="font-semibold text-sm">Recommended Actions:</h4>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                            {call.aiActions.map((action: string, idx: number) => (
                              <li key={idx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
