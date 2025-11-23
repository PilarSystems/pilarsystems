'use client'

/**
 * Agent Builder Page
 * 
 * Configure AI agent personality and prompts
 */

import { useEffect, useState } from 'react'
import { useAuth } from '@/src/components/dashboard/AuthProvider'
import { AgentEditor } from '@/src/components/agent/AgentEditor'
import { AgentPreview } from '@/src/components/agent/AgentPreview'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface AgentProfile {
  id: string
  name: string
  voiceModel: string
  language: string
  tone: string
  greeting: string
  studioRules: string[]
  prompt: string
}

export default function AgentBuilderPage() {
  const { session, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!authLoading && session?.authenticated) {
      loadProfile()
    }
  }, [authLoading, session])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/agent/profile')
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
      } else {
        console.error('[AGENT] Failed to load profile:', data.error)
      }
    } catch (error) {
      console.error('[AGENT] Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updates: Partial<AgentProfile>) => {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/agent/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        console.error('[AGENT] Failed to save profile:', data.error)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('[AGENT] Error saving profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading agent builder...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <p className="mt-4 text-sm text-gray-600">Failed to load agent profile</p>
          <button
            onClick={loadProfile}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Builder</h1>
          <p className="mt-2 text-gray-600">
            Configure your AI agent's personality, prompts, and behavior
          </p>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Saved successfully</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Failed to save</span>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <AgentEditor profile={profile} onSave={handleSave} saving={saving} />
        </div>

        {/* Preview */}
        <div>
          <AgentPreview />
        </div>
      </div>
    </div>
  )
}
