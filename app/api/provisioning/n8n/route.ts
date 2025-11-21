export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { n8nWorkflowService } from '@/services/n8n/workflows'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const activateSchema = z.object({
  workspaceId: z.string().uuid(),
  workflowType: z.enum(['lead_followup', 'missed_call', 'whatsapp_reply', 'email_reply', 'calendar_reminder']),
  name: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = activateSchema.parse(body)

    logger.info({ workspaceId: data.workspaceId, workflowType: data.workflowType }, 'Activating workflow')

    await n8nWorkflowService.activateWorkflow(data)

    return NextResponse.json({
      success: true,
      message: 'Workflow activated',
    })
  } catch (error) {
    logger.error({ error }, 'Failed to activate workflow')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to activate workflow' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const workflows = await n8nWorkflowService.getWorkspaceWorkflows(workspaceId)

    return NextResponse.json({ workflows })
  } catch (error) {
    logger.error({ error }, 'Failed to get workflows')
    return NextResponse.json({ error: 'Failed to get workflows' }, { status: 500 })
  }
}
