'use client'

import { MessageCircle, Phone, Mail, Globe, MessageSquare } from 'lucide-react'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'

interface ChannelTabsProps {
  activeChannel: Channel | 'all'
  onChannelChange: (channel: Channel | 'all') => void
  counts?: Record<Channel | 'all', number>
}

export default function ChannelTabs({
  activeChannel,
  onChannelChange,
  counts,
}: ChannelTabsProps) {
  const tabs = [
    { id: 'all' as const, label: 'All', icon: null },
    { id: Channel.VOICE, label: 'Voice', icon: Phone },
    { id: Channel.WHATSAPP, label: 'WhatsApp', icon: MessageCircle },
    { id: Channel.EMAIL, label: 'Email', icon: Mail },
    { id: Channel.WEB, label: 'Web', icon: Globe },
    { id: Channel.SMS, label: 'SMS', icon: MessageSquare },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeChannel === tab.id
          const count = counts?.[tab.id] || 0

          return (
            <button
              key={tab.id}
              onClick={() => onChannelChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {counts && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
