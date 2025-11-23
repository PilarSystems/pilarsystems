'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Trash2, AlertCircle, MessageCircle } from 'lucide-react'
import { MessageLog, LogLevel, LogType } from '@/src/server/logs/log.types'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'
import MessageLogItem from './MessageLogItem'

interface MessageStreamProps {
  channel: Channel | 'all'
  level: LogLevel | 'all'
  type: LogType | 'all'
}

export default function MessageStream({ channel, level, type }: MessageStreamProps) {
  const [logs, setLogs] = useState<MessageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchLogs = async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      
      if (channel !== 'all') {
        params.append('channel', channel)
      }
      
      if (level !== 'all') {
        params.append('level', level)
      }
      
      if (type !== 'all') {
        params.append('type', type)
      }
      
      params.append('limit', '100')
      params.append('includeStats', 'false')

      const response = await fetch(`/api/logs?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logs')
      }

      setLogs(data.logs || [])
    } catch (err) {
      console.error('Error fetching logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/logs/clear', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear logs')
      }

      setLogs([])
    } catch (err) {
      console.error('Error clearing logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to clear logs')
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [channel, level, type])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchLogs()
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRefresh, channel, level, type])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">Error Loading Logs</h3>
            <p className="text-sm text-red-800 mt-1">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Auto-refresh (3s)</span>
          </label>
        </div>

        <button
          onClick={clearLogs}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Log Count */}
      <div className="text-sm text-gray-600">
        Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
      </div>

      {/* Logs */}
      {logs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Yet</h3>
          <p className="text-sm text-gray-600">
            Logs will appear here when you test Voice or WhatsApp engines.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <MessageLogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
