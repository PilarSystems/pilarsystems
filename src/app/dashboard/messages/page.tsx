'use client'

import { useState } from 'react'
import { Activity } from 'lucide-react'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'
import { LogLevel, LogType } from '@/src/server/logs/log.types'
import ChannelTabs from '@/src/components/messages/ChannelTabs'
import MessageFilters from '@/src/components/messages/MessageFilters'
import MessageStream from '@/src/components/messages/MessageStream'

export default function MessagesPage() {
  const [activeChannel, setActiveChannel] = useState<Channel | 'all'>('all')
  const [level, setLevel] = useState<LogLevel | 'all'>('all')
  const [type, setType] = useState<LogType | 'all'>('all')

  const clearFilters = () => {
    setLevel('all')
    setType('all')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Live Message Console</h1>
          </div>
          <p className="text-gray-600">
            Real-time logs from Voice Engine, WhatsApp Engine, and all AI interactions
          </p>
        </div>

        {/* Channel Tabs */}
        <div className="mb-6">
          <ChannelTabs
            activeChannel={activeChannel}
            onChannelChange={setActiveChannel}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <MessageFilters
              level={level}
              type={type}
              onLevelChange={setLevel}
              onTypeChange={setType}
              onClear={clearFilters}
            />
          </div>

          {/* Message Stream */}
          <div className="lg:col-span-3">
            <MessageStream
              channel={activeChannel}
              level={level}
              type={type}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
