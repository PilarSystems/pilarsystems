'use client'

/**
 * Test Dashboard Page
 * 
 * Complete test environment for Voice + WhatsApp engines
 */

import { useState } from 'react'
import { TestTube2 } from 'lucide-react'
import VoiceTest from '@/src/components/test/VoiceTest'
import WhatsAppTest from '@/src/components/test/WhatsAppTest'
import PreviewCard from '@/src/components/test/PreviewCard'
import DebugConsole from '@/src/components/test/DebugConsole'

interface DebugLog {
  timestamp: string
  type: 'request' | 'response' | 'error'
  data: any
}

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<'voice' | 'whatsapp'>('whatsapp')
  const [previewResult, setPreviewResult] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([])

  const handleResult = (result: any) => {
    setPreviewLoading(true)
    setPreviewResult(result)
    setTimeout(() => setPreviewLoading(false), 300)
  }

  const handleLog = (log: DebugLog) => {
    setDebugLogs(prev => [...prev, log])
  }

  const clearLogs = () => {
    setDebugLogs([])
    setPreviewResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <TestTube2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Test Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Test your AI agent with Voice and WhatsApp engines in real-time
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'whatsapp'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              WhatsApp Test
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'voice'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Voice Test
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Test Interface */}
        <div className="space-y-6">
          {activeTab === 'whatsapp' ? (
            <WhatsAppTest onResult={handleResult} onLog={handleLog} />
          ) : (
            <VoiceTest onResult={handleResult} onLog={handleLog} />
          )}
        </div>

        {/* Right Column: Preview + Debug */}
        <div className="space-y-6">
          {/* Preview Card */}
          <PreviewCard result={previewResult} loading={previewLoading} />

          {/* Debug Console */}
          <DebugConsole logs={debugLogs} />

          {/* Clear Logs Button */}
          {debugLogs.length > 0 && (
            <button
              onClick={clearLogs}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">WhatsApp Test</h3>
          <p className="text-sm text-gray-600">
            Test text-based conversations with the orchestrator. Messages are processed through
            intent detection, routing, and AI response generation.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Voice Test</h3>
          <p className="text-sm text-gray-600">
            Test voice interactions using browser microphone. Speech is transcribed, processed,
            and responded to with AI-generated audio.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Live Preview</h3>
          <p className="text-sm text-gray-600">
            See real-time intent detection, routing decisions, and AI responses. Debug console
            shows full JSON logs for troubleshooting.
          </p>
        </div>
      </div>
    </div>
  )
}
