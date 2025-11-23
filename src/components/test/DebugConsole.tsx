'use client'

/**
 * Debug Console Component
 * 
 * Displays full JSON log with timestamps and debug info
 */

import { useState } from 'react'
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface DebugConsoleProps {
  logs: Array<{
    timestamp: string
    type: 'request' | 'response' | 'error'
    data: any
  }>
}

export default function DebugConsole({ logs }: DebugConsoleProps) {
  const [expanded, setExpanded] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Debug Console</h3>
          <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
            {logs.length} {logs.length === 1 ? 'log' : 'logs'}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Console Content */}
      {expanded && (
        <div className="border-t border-gray-700">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No logs yet. Send a message to see debug output.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="border-b border-gray-800 last:border-b-0"
                >
                  {/* Log Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.type === 'request'
                            ? 'bg-blue-900 text-blue-300'
                            : log.type === 'response'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {log.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(log.data, null, 2), index)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Log Content */}
                  <div className="p-4">
                    <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
