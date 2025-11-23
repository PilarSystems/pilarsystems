'use client'

/**
 * Preview Card Component
 * 
 * Displays live agent preview with intent, routing, and response
 */

import { CheckCircle, XCircle, Zap, Brain, MessageSquare } from 'lucide-react'

interface PreviewCardProps {
  result: {
    intent?: {
      intent: string
      confidence: number
      entities?: Record<string, any>
    }
    routing?: {
      module: string
      intent: string
      params?: Record<string, any>
    }
    response?: {
      content: string
      metadata: {
        module: string
        intent: string
        confidence: number
        processingTime: number
      }
    }
  } | null
  loading?: boolean
}

export default function PreviewCard({ result, loading }: PreviewCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Live Agent Preview</h3>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Live Agent Preview</h3>
        </div>
        <p className="text-gray-500 text-sm">Send a message to see the agent preview</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Live Agent Preview</h3>
      </div>

      <div className="space-y-4">
        {/* Intent Detection */}
        {result.intent && (
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Intent Detection</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Intent:</span>{' '}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                  {result.intent.intent}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Confidence:</span>{' '}
                <span className="font-mono">{(result.intent.confidence * 100).toFixed(1)}%</span>
              </p>
              {result.intent.entities && Object.keys(result.intent.entities).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 font-medium mb-1">Entities:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(result.intent.entities).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {key}: {JSON.stringify(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Routing Decision */}
        {result.routing && (
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Routing Decision</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Module:</span>{' '}
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">
                  {result.routing.module}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Target Intent:</span>{' '}
                <span className="font-mono text-xs">{result.routing.intent}</span>
              </p>
            </div>
          </div>
        )}

        {/* Response */}
        {result.response && (
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-900">AI Response</h4>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-800">{result.response.content}</p>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span>
                  <span className="font-medium">Module:</span> {result.response.metadata.module}
                </span>
                <span>
                  <span className="font-medium">Processing:</span>{' '}
                  {result.response.metadata.processingTime}ms
                </span>
                <span>
                  <span className="font-medium">Confidence:</span>{' '}
                  {(result.response.metadata.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
