'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Workflow } from '@/src/server/workflows/workflow.types'
import WorkflowList from '@/src/components/workflows/WorkflowList'
import WorkflowEditor from '@/src/components/workflows/WorkflowEditor'

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const fetchWorkflows = async () => {
    try {
      setError(null)
      const response = await fetch('/api/workflows/list?includeStats=false')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workflows')
      }

      setWorkflows(data.workflows || [])
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const handleCreate = () => {
    setEditingWorkflow(null)
    setShowEditor(true)
  }

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow)
    setShowEditor(true)
  }

  const handleSave = async (workflowData: any) => {
    try {
      const url = editingWorkflow
        ? '/api/workflows/update'
        : '/api/workflows/create'

      const body = editingWorkflow
        ? { workflowId: editingWorkflow.id, ...workflowData }
        : workflowData

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save workflow')
      }

      setShowEditor(false)
      setEditingWorkflow(null)
      fetchWorkflows()
    } catch (err) {
      console.error('Error saving workflow:', err)
      alert(err instanceof Error ? err.message : 'Failed to save workflow')
    }
  }

  const handleDelete = async (workflowId: string) => {
    try {
      const response = await fetch('/api/workflows/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, enabled: false }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete workflow')
      }

      fetchWorkflows()
    } catch (err) {
      console.error('Error deleting workflow:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete workflow')
    }
  }

  const handleToggle = async (workflowId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/workflows/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, enabled }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle workflow')
      }

      fetchWorkflows()
    } catch (err) {
      console.error('Error toggling workflow:', err)
      alert(err instanceof Error ? err.message : 'Failed to toggle workflow')
    }
  }

  const handleRun = async (workflowId: string) => {
    try {
      const response = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, triggerData: {} }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run workflow')
      }

      alert(`Workflow executed successfully!\n\nActions executed: ${data.result.actionsExecuted}`)
      fetchWorkflows()
    } catch (err) {
      console.error('Error running workflow:', err)
      alert(err instanceof Error ? err.message : 'Failed to run workflow')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Workflows</h3>
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={fetchWorkflows}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Studio Automations</h1>
          </div>
          <p className="text-gray-600">
            Automate studio operations with intelligent workflows
          </p>
        </div>

        {/* Workflow List */}
        <WorkflowList
          workflows={workflows}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onRun={handleRun}
          onCreate={handleCreate}
        />

        {/* Workflow Editor */}
        {showEditor && (
          <WorkflowEditor
            workflow={editingWorkflow}
            onSave={handleSave}
            onCancel={() => {
              setShowEditor(false)
              setEditingWorkflow(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
