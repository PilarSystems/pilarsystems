/**
 * POST /api/workflows/create
 * 
 * Create a new workflow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { createWorkflow } from '@/src/server/workflows/workflow.service'
import { WorkflowTrigger, WorkflowCondition, WorkflowAction } from '@/src/server/workflows/workflow.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, enabled, trigger, conditions, actions } = body

    if (!name || !trigger || !actions) {
      return NextResponse.json(
        { success: false, error: 'Name, trigger, and actions are required' },
        { status: 400 }
      )
    }

    const workflow = createWorkflow(
      session.tenantId,
      name,
      trigger as WorkflowTrigger,
      (conditions || []) as WorkflowCondition[],
      actions as WorkflowAction[],
      {
        description,
        enabled: enabled ?? true,
      }
    )

    return NextResponse.json({
      success: true,
      workflow,
    })
  } catch (error) {
    console.error('[API] Error creating workflow:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create workflow',
      },
      { status: 500 }
    )
  }
}
