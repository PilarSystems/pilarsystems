'use client'

import { Phone, MessageCircle, Mail, Globe, MessageSquare, Zap, Clock, PhoneMissed, UserPlus, Calendar } from 'lucide-react'
import { TriggerType, WorkflowTrigger } from '@/src/server/workflows/workflow.types'
import { Channel, Intent } from '@/src/server/orchestrator/orchestrator.types'

interface TriggerPickerProps {
  trigger: WorkflowTrigger | null
  onChange: (trigger: WorkflowTrigger) => void
}

export default function TriggerPicker({ trigger, onChange }: TriggerPickerProps) {
  const triggers = [
    { type: TriggerType.VOICE_CALL, label: 'Voice Call', icon: Phone, color: 'purple' },
    { type: TriggerType.WHATSAPP_MESSAGE, label: 'WhatsApp Message', icon: MessageCircle, color: 'green' },
    { type: TriggerType.EMAIL_RECEIVED, label: 'Email Received', icon: Mail, color: 'blue' },
    { type: TriggerType.WEB_CHAT, label: 'Web Chat', icon: Globe, color: 'gray' },
    { type: TriggerType.SMS_RECEIVED, label: 'SMS Received', icon: MessageSquare, color: 'yellow' },
    { type: TriggerType.INTENT_DETECTED, label: 'Intent Detected', icon: Zap, color: 'orange' },
    { type: TriggerType.TIME_BASED, label: 'Time Based', icon: Clock, color: 'indigo' },
    { type: TriggerType.MISSED_CALL, label: 'Missed Call', icon: PhoneMissed, color: 'red' },
    { type: TriggerType.LEAD_CREATED, label: 'Lead Created', icon: UserPlus, color: 'teal' },
    { type: TriggerType.BOOKING_CREATED, label: 'Booking Created', icon: Calendar, color: 'pink' },
  ]

  const getColorClasses = (color: string, selected: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string }> = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', selectedBg: 'bg-purple-100', selectedBorder: 'border-purple-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', selectedBg: 'bg-green-100', selectedBorder: 'border-green-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', selectedBg: 'bg-blue-100', selectedBorder: 'border-blue-500' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', selectedBg: 'bg-gray-100', selectedBorder: 'border-gray-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', selectedBg: 'bg-yellow-100', selectedBorder: 'border-yellow-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', selectedBg: 'bg-orange-100', selectedBorder: 'border-orange-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', selectedBg: 'bg-indigo-100', selectedBorder: 'border-indigo-500' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', selectedBg: 'bg-red-100', selectedBorder: 'border-red-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', selectedBg: 'bg-teal-100', selectedBorder: 'border-teal-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', selectedBg: 'bg-pink-100', selectedBorder: 'border-pink-500' },
    }
    
    const colorSet = colors[color] || colors.gray
    return selected
      ? `${colorSet.selectedBg} ${colorSet.selectedBorder} ${colorSet.text}`
      : `${colorSet.bg} ${colorSet.border} ${colorSet.text} hover:${colorSet.selectedBg}`
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Trigger
        </label>
        <div className="grid grid-cols-2 gap-3">
          {triggers.map((t) => {
            const Icon = t.icon
            const isSelected = trigger?.type === t.type
            
            return (
              <button
                key={t.type}
                onClick={() => onChange({ type: t.type, config: {} })}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${getColorClasses(t.color, isSelected)}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {trigger && trigger.type === TriggerType.INTENT_DETECTED && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intent
          </label>
          <select
            value={trigger.config.intent || ''}
            onChange={(e) => onChange({
              ...trigger,
              config: { ...trigger.config, intent: e.target.value as Intent }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select intent...</option>
            <option value="training_plan">Training Plan</option>
            <option value="booking">Booking</option>
            <option value="gym_buddy">Gym Buddy</option>
            <option value="lead_qualification">Lead Qualification</option>
            <option value="voice_call">Voice Call</option>
            <option value="general_question">General Question</option>
            <option value="fallback">Fallback</option>
          </select>
        </div>
      )}

      {trigger && trigger.type === TriggerType.TIME_BASED && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (Cron Expression)
          </label>
          <input
            type="text"
            value={trigger.config.schedule || ''}
            onChange={(e) => onChange({
              ...trigger,
              config: { ...trigger.config, schedule: e.target.value }
            })}
            placeholder="0 9 * * *"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: "0 9 * * *" = Every day at 9:00 AM
          </p>
        </div>
      )}
    </div>
  )
}
