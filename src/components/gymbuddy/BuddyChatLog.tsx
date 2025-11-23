'use client'

import { useEffect, useRef } from 'react'
import { User, Bot } from 'lucide-react'

interface Message {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  createdAt: Date
}

interface BuddyChatLogProps {
  messages: Message[]
  userName: string
}

export default function BuddyChatLog({ messages, userName }: BuddyChatLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Noch keine Nachrichten
        </h3>
        <p className="text-gray-600">
          Schreib deinem Gym Buddy eine Nachricht um zu starten!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Chat Verlauf
        </h3>
        <p className="text-sm text-gray-600">
          {messages.length} Nachrichten
        </p>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {messages.map((message) => {
          const isInbound = message.direction === 'inbound'
          
          return (
            <div
              key={message.id}
              className={`flex ${isInbound ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  isInbound ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isInbound ? 'bg-blue-100' : 'bg-purple-100'
                  }`}
                >
                  {isInbound ? (
                    <User className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-purple-600" />
                  )}
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    isInbound
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isInbound ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
