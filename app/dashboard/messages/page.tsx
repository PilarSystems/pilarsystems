'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        }
      } catch (error) {
        toast.error('Nachrichten konnten nicht geladen werden')
      }
    }
    fetchConversations()
  }, [])

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return '💬'
      case 'email':
        return '📧'
      case 'sms':
        return '📱'
      default:
        return '💬'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unified inbox for WhatsApp, Email, and SMS
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>All active conversations</CardDescription>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No conversations yet. Messages will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conv.id
                          ? 'bg-blue-50 dark:bg-blue-950'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span>{getChannelIcon(conv.channel)}</span>
                            <span className="font-medium">{conv.leadName}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? selectedConversation.leadName : 'Select a conversation'}
              </CardTitle>
              {selectedConversation && (
                <CardDescription>
                  {getChannelIcon(selectedConversation.channel)} {selectedConversation.channel}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {!selectedConversation ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a conversation to view messages
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {selectedConversation.messages?.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.direction === 'outbound'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={2}
                    />
                    <Button>Send</Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="outline">AI Auto-Reply: Active</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
