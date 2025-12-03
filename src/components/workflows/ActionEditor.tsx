'use client'

import { X, MessageSquare, Brain, Dumbbell, Clock, UserPlus, Edit, Webhook, Timer, GitBranch } from 'lucide-react'
import { WorkflowAction, ActionType } from '@/src/server/workflows/workflow.types'
import { v4 as uuidv4 } from 'uuid'

interface ActionEditorProps {
  actions: WorkflowAction[]
  onChange: (actions: WorkflowAction[]) => void
}

export default function ActionEditor({ actions, onChange }: ActionEditorProps) {
  const addAction = (type: ActionType) => {
    onChange([
      ...actions,
      {
        id: uuidv4(),
        type,
        config: {},
        nextActionId: null,
      },
    ])
  }

  const removeAction = (index: number) => {
    onChange(actions.filter((_, i) => i !== index))
  }

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    onChange(
      actions.map((action, i) =>
        i === index ? { ...action, ...updates } : action
      )
    )
  }

  const actionTypes = [
    { type: ActionType.SEND_MESSAGE, label: 'Send Message', icon: MessageSquare, color: 'blue' },
    { type: ActionType.SEND_WHATSAPP, label: 'Send WhatsApp', icon: MessageSquare, color: 'green' },
    { type: ActionType.SEND_EMAIL, label: 'Send Email', icon: MessageSquare, color: 'purple' },
    { type: ActionType.SEND_SMS, label: 'Send SMS', icon: MessageSquare, color: 'yellow' },
    { type: ActionType.ASK_AI, label: 'Ask AI', icon: Brain, color: 'indigo' },
    { type: ActionType.GENERATE_WORKOUT_PLAN, label: 'Generate Workout Plan', icon: Dumbbell, color: 'orange' },
    { type: ActionType.SCHEDULE_FOLLOW_UP, label: 'Schedule Follow-Up', icon: Clock, color: 'teal' },
    { type: ActionType.CREATE_LEAD, label: 'Create Lead', icon: UserPlus, color: 'pink' },
    { type: ActionType.UPDATE_LEAD, label: 'Update Lead', icon: Edit, color: 'cyan' },
    { type: ActionType.CALL_WEBHOOK, label: 'Call Webhook', icon: Webhook, color: 'red' },
    { type: ActionType.WAIT, label: 'Wait', icon: Timer, color: 'gray' },
    { type: ActionType.BRANCH, label: 'Branch', icon: GitBranch, color: 'violet' },
  ]

  const getActionIcon = (type: ActionType) => {
    const actionType = actionTypes.find(a => a.type === type)
    return actionType?.icon || MessageSquare
  }

  const getActionLabel = (type: ActionType) => {
    const actionType = actionTypes.find(a => a.type === type)
    return actionType?.label || type
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Actions (Executed in order)
        </label>
      </div>

      {actions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            No actions added. Add actions to execute when workflow runs.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {actionTypes.slice(0, 4).map((actionType) => {
              const Icon = actionType.icon
              return (
                <button
                  key={actionType.type}
                  onClick={() => addAction(actionType.type)}
                  className="inline-flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{actionType.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = getActionIcon(action.type)
            
            return (
              <div
                key={action.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {index + 1}
                    </div>
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{getActionLabel(action.type)}</span>
                  </div>
                  <button
                    onClick={() => removeAction(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {(action.type === ActionType.SEND_MESSAGE ||
                    action.type === ActionType.SEND_WHATSAPP ||
                    action.type === ActionType.SEND_EMAIL ||
                    action.type === ActionType.SEND_SMS) && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={action.config.message || ''}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, message: e.target.value },
                            })
                          }
                          placeholder="Enter message content..."
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Recipient (optional)
                        </label>
                        <input
                          type="text"
                          value={action.config.recipient || ''}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, recipient: e.target.value },
                            })
                          }
                          placeholder="Phone number or email..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {action.type === ActionType.ASK_AI && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Prompt
                      </label>
                      <textarea
                        value={action.config.prompt || ''}
                        onChange={(e) =>
                          updateAction(index, {
                            config: { ...action.config, prompt: e.target.value },
                          })
                        }
                        placeholder="Enter AI prompt..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {action.type === ActionType.SCHEDULE_FOLLOW_UP && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Delay (milliseconds)
                        </label>
                        <input
                          type="number"
                          value={action.config.delay || 0}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, delay: parseInt(e.target.value) },
                            })
                          }
                          placeholder="3600000"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Example: 3600000 = 1 hour
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={action.config.message || ''}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, message: e.target.value },
                            })
                          }
                          placeholder="Follow-up message..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {action.type === ActionType.CALL_WEBHOOK && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={action.config.webhookUrl || ''}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, webhookUrl: e.target.value },
                            })
                          }
                          placeholder="https://example.com/webhook"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Method
                        </label>
                        <select
                          value={action.config.method || 'POST'}
                          onChange={(e) =>
                            updateAction(index, {
                              config: { ...action.config, method: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                    </>
                  )}

                  {action.type === ActionType.WAIT && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Delay (milliseconds)
                      </label>
                      <input
                        type="number"
                        value={action.config.delay || 0}
                        onChange={(e) =>
                          updateAction(index, {
                            config: { ...action.config, delay: parseInt(e.target.value) },
                          })
                        }
                        placeholder="1000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Example: 1000 = 1 second
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Add action:</span>
        {actionTypes.map((actionType) => {
          const Icon = actionType.icon
          return (
            <button
              key={actionType.type}
              onClick={() => addAction(actionType.type)}
              className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-3 h-3" />
              <span>{actionType.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
