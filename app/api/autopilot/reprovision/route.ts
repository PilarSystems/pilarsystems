/**
 * PILAR AUTOPILOT - Manual Reprovision Endpoint
 * 
 * Allows manual triggering of provisioning from dashboard
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { logger } from '@/lib/logger'
import { enqueueProvisioning } from '@/lib/autopilot/provisioning-queue'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workspaceId } = body

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    const result = await enqueueProvisioning(workspaceId, {
      source: 'manual',
      metadata: {
        triggeredAt: new Date().toISOString(),
      },
    })

    logger.info(
      { workspaceId, jobId: result.jobId, created: result.created },
      'Manual reprovision triggered'
    )

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      created: result.created,
      message: result.created
        ? 'Provisioning job created'
        : 'Provisioning job already in progress',
    })
  } catch (error: any) {
    logger.error({ error }, 'Failed to trigger manual reprovision')
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to trigger reprovision',
      },
      { status: 500 }
    )
  }
}
