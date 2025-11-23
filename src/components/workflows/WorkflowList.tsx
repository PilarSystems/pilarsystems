'use client'

import { useState } from 'react'
import { Play, Pause, Edit, Trash2, Plus, Zap } from 'lucide-react'
import { Workflow } from '@/src/server/workflows/workflow.types'

interface WorkflowListProps {
  workflows: Workflow[]
  onEdit: (workflow: Workflow) => void
  onDelete: (workflowId: string) => void
  onToggle: (workflowId: string, enabled: boolean) => void
  onRun: (workflowId: string) => void
  onCreate: () => void
}

export default function WorkflowList({
  workflows,
  onEdit,
  onDelete,
  onToggle,
  onRun,
  onCreate,
}: WorkflowListProps) {
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(new Set())

  const handleRun = async (workflowId: string) => {
    setRunningWorkflows(prev => new Set(prev).add(workflowId))
    try {
      await onRun(workflowId)
    } finally {
      setRunningWorkflows(prev => {
        const next = new Set(prev)
        next.delete(workflowId)
        return next
      })
    }
  }

  const getTriggerLabel = (workflow: Workflow) => {
    return workflow.trigger.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getSuccessRate = (workflow: Workflow) => {
    if (workflow.runCount === 0) return 0
    return Math.round((workflow.successCount / workflow.runCount) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflows</h2>
          <p className="text-sm text-gray-600 mt-1">
            {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Workflows */}
      {workflows.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Workflows Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create your first workflow to automate studio operations.
          </p>
          <button
            onClick={onCreate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Workflow</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        workflow.enabled
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {workflow.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {workflow.description && (
                    <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{getTriggerLabel(workflow)}</span>
                    </div>
                    <div>•</div>
                    <div>{workflow.conditions.length} condition{workflow.conditions.length !== 1 ? 's' : ''}</div>
                    <div>•</div>
                    <div>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    <div className="text-gray-600">
                      Runs: <span className="font-medium text-gray-900">{workflow.runCount}</span>
                    </div>
                    <div className="text-gray-600">
                      Success Rate:{' '}
                      <span className={`font-medium ${
                        getSuccessRate(workflow) >= 80 ? 'text-green-600' :
                        getSuccessRate(workflow) >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {getSuccessRate(workflow)}%
                      </span>
                    </div>
                    {workflow.lastRunAt && (
                      <div className="text-gray-600">
                        Last run: {new Date(workflow.lastRunAt).toLocaleString('de-DE')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleRun(workflow.id)}
                    disabled={runningWorkflows.has(workflow.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Run workflow"
                  >
                    <Play className={`w-5 h-5 ${runningWorkflows.has(workflow.id) ? 'animate-pulse' : ''}`} />
                  </button>

                  <button
                    onClick={() => onToggle(workflow.id, !workflow.enabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      workflow.enabled
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={workflow.enabled ? 'Disable workflow' : 'Enable workflow'}
                  >
                    {workflow.enabled ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => onEdit(workflow)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit workflow"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
                        onDelete(workflow.id)
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete workflow"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
