/**
 * POST /api/workflows/run
 * 
 * Run a workflow manually or via event trigger.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { getWorkflow } from '@/src/server/workflows/workflow.service'
import { runWorkflow } from '@/src/server/workflows/workflow.runner'

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
    const { workflowId, triggerData } = body

    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const workflow = getWorkflow(session.tenantId, workflowId)

    if (!workflow) {
      return NextResponse.json(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      )
    }

    const result = await runWorkflow(workflow, triggerData || {})

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('[API] Error running workflow:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run workflow',
      },
      { status: 500 }
    )
  }
}
