'use client'

/**
 * Agent Editor
 * 
 * Main editor with Personality and Prompt tabs
 */

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

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

interface AgentEditorProps {
  profile: AgentProfile
  onSave: (profile: Partial<AgentProfile>) => Promise<void>
  saving: boolean
}

export function AgentEditor({ profile, onSave, saving }: AgentEditorProps) {
  const [activeTab, setActiveTab] = useState<'personality' | 'prompt'>('personality')
  const [formData, setFormData] = useState({
    name: profile.name,
    voiceModel: profile.voiceModel,
    language: profile.language,
    tone: profile.tone,
    greeting: profile.greeting,
    studioRules: profile.studioRules,
    prompt: profile.prompt,
  })

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...formData.studioRules]
    newRules[index] = value
    setFormData({ ...formData, studioRules: newRules })
  }

  const handleAddRule = () => {
    setFormData({
      ...formData,
      studioRules: [...formData.studioRules, ''],
    })
  }

  const handleRemoveRule = (index: number) => {
    const newRules = formData.studioRules.filter((_, i) => i !== index)
    setFormData({ ...formData, studioRules: newRules })
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personality')}
            className={`
              whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${
                activeTab === 'personality'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Personality
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`
              whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${
                activeTab === 'prompt'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Prompt
          </button>
        </nav>
      </div>

      {/* Personality Tab */}
      {activeTab === 'personality' && (
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Studio Assistant"
            />
          </div>

          {/* Voice Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voice Model
            </label>
            <select
              value={formData.voiceModel}
              onChange={(e) => setFormData({ ...formData, voiceModel: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="tts-1">OpenAI TTS-1</option>
              <option value="tts-1-hd">OpenAI TTS-1 HD</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          {/* Greeting */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Greeting Message
            </label>
            <textarea
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Hey! 👋 Willkommen bei unserem Fitnessstudio..."
            />
          </div>

          {/* Studio Rules */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Studio Rules
              </label>
              <button
                onClick={handleAddRule}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Rule
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {formData.studioRules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter rule..."
                  />
                  <button
                    onClick={() => handleRemoveRule(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prompt Tab */}
      {activeTab === 'prompt' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            System Prompt
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Define how your AI agent should behave and respond to users.
          </p>
          <textarea
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            rows={20}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Du bist ein freundlicher KI-Assistent für ein Fitnessstudio..."
          />
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
