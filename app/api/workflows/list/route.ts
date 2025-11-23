/**
 * GET /api/workflows/list
 * 
 * Get all workflows for the current tenant.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/src/lib/auth'
import { getWorkflows, getWorkflowStats } from '@/src/server/workflows/workflow.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const enabledOnly = searchParams.get('enabledOnly') === 'true'
    const includeStats = searchParams.get('includeStats') === 'true'

    const workflows = getWorkflows(session.tenantId, enabledOnly)

    let stats = undefined
    if (includeStats) {
      stats = getWorkflowStats(session.tenantId)
    }

    return NextResponse.json({
      success: true,
      workflows,
      stats,
    })
  } catch (error) {
    console.error('[API] Error fetching workflows:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workflows',
      },
      { status: 500 }
    )
  }
}
