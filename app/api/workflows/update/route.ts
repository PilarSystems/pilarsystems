/**
 * POST /api/workflows/update
 * 
 * Update an existing workflow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { updateWorkflow } from '@/src/server/workflows/workflow.service'

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
    const { workflowId, ...updates } = body

    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const workflow = updateWorkflow(session.tenantId, workflowId, updates)

    if (!workflow) {
      return NextResponse.json(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      workflow,
    })
  } catch (error) {
    console.error('[API] Error updating workflow:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update workflow',
      },
      { status: 500 }
    )
  }
}
