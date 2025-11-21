/**
 * PILAR AUTOPILOT - Status Endpoint
 * 
 * Returns current provisioning job status for a workspace
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    const job = await prisma.provisioningJob.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })

    if (!job) {
      return NextResponse.json({
        job: null,
        message: 'No provisioning jobs found',
      })
    }

    return NextResponse.json({
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      },
    })
  } catch (error: any) {
    logger.error({ error }, 'Failed to get provisioning status')
    return NextResponse.json(
      {
        error: error.message || 'Failed to get status',
      },
      { status: 500 }
    )
  }
}
