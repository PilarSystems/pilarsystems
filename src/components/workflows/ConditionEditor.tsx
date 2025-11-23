'use client'

import { Plus, X } from 'lucide-react'
import { WorkflowCondition, ConditionType } from '@/src/server/workflows/workflow.types'

interface ConditionEditorProps {
  conditions: WorkflowCondition[]
  onChange: (conditions: WorkflowCondition[]) => void
}

export default function ConditionEditor({ conditions, onChange }: ConditionEditorProps) {
  const addCondition = () => {
    onChange([
      ...conditions,
      {
        type: ConditionType.KEYWORD_MATCH,
        operator: 'contains',
        value: '',
      },
    ])
  }

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, updates: Partial<WorkflowCondition>) => {
    onChange(
      conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition
      )
    )
  }

  const conditionTypes = [
    { value: ConditionType.KEYWORD_MATCH, label: 'Keyword Match' },
    { value: ConditionType.INTENT_MATCH, label: 'Intent Match' },
    { value: ConditionType.SENDER_MATCH, label: 'Sender Match' },
    { value: ConditionType.TIME_RANGE, label: 'Time Range' },
    { value: ConditionType.DAY_OF_WEEK, label: 'Day of Week' },
    { value: ConditionType.CONFIDENCE_THRESHOLD, label: 'Confidence Threshold' },
    { value: ConditionType.CHANNEL_MATCH, label: 'Channel Match' },
    { value: ConditionType.CUSTOM_FIELD, label: 'Custom Field' },
  ]

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'in', label: 'In' },
    { value: 'not_in', label: 'Not In' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Conditions (All must be true)
        </label>
        <button
          onClick={addCondition}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Condition</span>
        </button>
      </div>

      {conditions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            No conditions added. Workflow will run for all triggers.
          </p>
          <button
            onClick={addCondition}
            className="mt-2 inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Condition</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={condition.type}
                      onChange={(e) =>
                        updateCondition(index, { type: e.target.value as ConditionType })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {conditionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Operator
                    </label>
                    <select
                      value={condition.operator}
                      onChange={(e) =>
                        updateCondition(index, { operator: e.target.value as any })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) =>
                        updateCondition(index, { value: e.target.value })
                      }
                      placeholder="Enter value..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeCondition(index)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {condition.type === ConditionType.CUSTOM_FIELD && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={condition.field || ''}
                    onChange={(e) =>
                      updateCondition(index, { field: e.target.value })
                    }
                    placeholder="e.g., phoneNumber, email"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
