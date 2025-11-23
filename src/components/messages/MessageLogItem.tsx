'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, MessageCircle, Phone, Mail, Globe, MessageSquare } from 'lucide-react'
import { MessageLog, LogLevel, LogType } from '@/src/server/logs/log.types'
import { Channel } from '@/src/server/orchestrator/orchestrator.types'

interface MessageLogItemProps {
  log: MessageLog
}

export default function MessageLogItem({ log }: MessageLogItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case Channel.WHATSAPP:
        return <MessageCircle className="w-4 h-4" />
      case Channel.VOICE:
        return <Phone className="w-4 h-4" />
      case Channel.EMAIL:
        return <Mail className="w-4 h-4" />
      case Channel.WEB:
        return <Globe className="w-4 h-4" />
      case Channel.SMS:
        return <MessageSquare className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: Channel) => {
    switch (channel) {
      case Channel.WHATSAPP:
        return 'bg-green-100 text-green-800 border-green-200'
      case Channel.VOICE:
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case Channel.EMAIL:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case Channel.WEB:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case Channel.SMS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'bg-red-100 text-red-800 border-red-200'
      case LogLevel.WARNING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case LogLevel.INFO:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case LogLevel.DEBUG:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeLabel = (type: LogType) => {
    switch (type) {
      case LogType.MESSAGE_RECEIVED:
        return 'Message Received'
      case LogType.MESSAGE_SENT:
        return 'Message Sent'
      case LogType.INTENT_DETECTED:
        return 'Intent Detected'
      case LogType.ROUTING_DECISION:
        return 'Routing Decision'
      case LogType.MODULE_EXECUTION:
        return 'Module Execution'
      case LogType.AI_RESPONSE:
        return 'AI Response'
      case LogType.ERROR:
        return 'Error'
      case LogType.SYSTEM:
        return 'System'
      default:
        return type
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Expand Icon */}
            <button className="mt-1 text-gray-400 hover:text-gray-600">
              {expanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {/* Channel Icon */}
            <div className={`p-2 rounded-lg border ${getChannelColor(log.channel)}`}>
              {getChannelIcon(log.channel)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {getTypeLabel(log.type)}
                </span>
                {log.intent && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    {log.intent}
                    {log.intentConfidence && (
                      <span className="ml-1 text-purple-600">
                        ({Math.round(log.intentConfidence * 100)}%)
                      </span>
                    )}
                  </span>
                )}
                {log.module && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    {log.module}
                  </span>
                )}
              </div>

              {log.content && (
                <p className="text-sm text-gray-800 mb-1 line-clamp-2">
                  {log.content}
                </p>
              )}

              {log.response && (
                <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                  → {log.response}
                </p>
              )}

              {log.error && (
                <p className="text-sm text-red-600 mb-1 line-clamp-2">
                  ⚠️ {log.error}
                </p>
              )}

              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{formatTimestamp(log.timestamp)}</span>
                {log.userName && <span>• {log.userName}</span>}
                {log.latency && <span>• {log.latency}ms</span>}
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard()
            }}
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-3">
            {/* User Info */}
            {(log.userId || log.userName || log.phoneNumber || log.email) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">User Info</h4>
                <div className="bg-white rounded p-3 text-xs space-y-1">
                  {log.userId && <div><span className="text-gray-500">ID:</span> {log.userId}</div>}
                  {log.userName && <div><span className="text-gray-500">Name:</span> {log.userName}</div>}
                  {log.phoneNumber && <div><span className="text-gray-500">Phone:</span> {log.phoneNumber}</div>}
                  {log.email && <div><span className="text-gray-500">Email:</span> {log.email}</div>}
                </div>
              </div>
            )}

            {/* Intent & Routing */}
            {(log.intent || log.module) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Intent & Routing</h4>
                <div className="bg-white rounded p-3 text-xs space-y-1">
                  {log.intent && (
                    <div>
                      <span className="text-gray-500">Intent:</span> {log.intent}
                      {log.intentConfidence && (
                        <span className="ml-2 text-purple-600">
                          ({Math.round(log.intentConfidence * 100)}% confidence)
                        </span>
                      )}
                    </div>
                  )}
                  {log.module && <div><span className="text-gray-500">Module:</span> {log.module}</div>}
                  {log.entities && Object.keys(log.entities).length > 0 && (
                    <div>
                      <span className="text-gray-500">Entities:</span>
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.entities, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance */}
            {(log.latency || log.processingTime) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Performance</h4>
                <div className="bg-white rounded p-3 text-xs space-y-1">
                  {log.latency && <div><span className="text-gray-500">Latency:</span> {log.latency}ms</div>}
                  {log.processingTime && <div><span className="text-gray-500">Processing Time:</span> {log.processingTime}ms</div>}
                </div>
              </div>
            )}

            {/* Raw Data */}
            {(log.rawRequest || log.rawResponse) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Raw Data</h4>
                <div className="space-y-2">
                  {log.rawRequest && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Request:</div>
                      <pre className="text-xs bg-white p-3 rounded overflow-x-auto border border-gray-200">
                        {JSON.stringify(log.rawRequest, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.rawResponse && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Response:</div>
                      <pre className="text-xs bg-white p-3 rounded overflow-x-auto border border-gray-200">
                        {JSON.stringify(log.rawResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full JSON */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Full Log (JSON)</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto border border-gray-200 max-h-96">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
