'use client'

import { useState } from 'react'
import { X, Save, Code } from 'lucide-react'
import { Workflow, WorkflowTrigger, WorkflowCondition, WorkflowAction } from '@/src/server/workflows/workflow.types'
import TriggerPicker from './TriggerPicker'
import ConditionEditor from './ConditionEditor'
import ActionEditor from './ActionEditor'

interface WorkflowEditorProps {
  workflow: Workflow | null
  onSave: (workflow: {
    name: string
    description?: string
    enabled: boolean
    trigger: WorkflowTrigger
    conditions: WorkflowCondition[]
    actions: WorkflowAction[]
  }) => void
  onCancel: () => void
}

export default function WorkflowEditor({ workflow, onSave, onCancel }: WorkflowEditorProps) {
  const [name, setName] = useState(workflow?.name || '')
  const [description, setDescription] = useState(workflow?.description || '')
  const [enabled, setEnabled] = useState(workflow?.enabled ?? true)
  const [trigger, setTrigger] = useState<WorkflowTrigger | null>(workflow?.trigger || null)
  const [conditions, setConditions] = useState<WorkflowCondition[]>(workflow?.conditions || [])
  const [actions, setActions] = useState<WorkflowAction[]>(workflow?.actions || [])
  const [showJson, setShowJson] = useState(false)

  const handleSave = () => {
    if (!name || !trigger || actions.length === 0) {
      alert('Please fill in name, trigger, and at least one action')
      return
    }

    onSave({
      name,
      description,
      enabled,
      trigger,
      conditions,
      actions,
    })
  }

  const workflowJson = {
    name,
    description,
    enabled,
    trigger,
    conditions,
    actions,
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {workflow ? 'Edit Workflow' : 'Create Workflow'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure trigger, conditions, and actions
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Missed Call Follow-Up"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this workflow does..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enabled"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                Enable workflow immediately
              </label>
            </div>
          </div>

          {/* Trigger */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Trigger</h3>
            <TriggerPicker trigger={trigger} onChange={setTrigger} />
          </div>

          {/* Conditions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Conditions</h3>
            <ConditionEditor conditions={conditions} onChange={setConditions} />
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Actions</h3>
            <ActionEditor actions={actions} onChange={setActions} />
          </div>

          {/* JSON Preview */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Code className="w-4 h-4" />
              <span>{showJson ? 'Hide' : 'Show'} JSON Definition</span>
            </button>

            {showJson && (
              <div className="mt-3">
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs overflow-x-auto">
                  {JSON.stringify(workflowJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !trigger || actions.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{workflow ? 'Update' : 'Create'} Workflow</span>
          </button>
        </div>
      </div>
    </div>
  )
}
