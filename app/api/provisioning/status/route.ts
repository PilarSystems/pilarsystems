export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { jobQueue } from '@/lib/queue'
import { logger } from '@/lib/logger'


export const runtime = 'nodejs'

/**
 * GET /api/provisioning/status?jobId=xxx
 * Get provisioning job status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    const status = await jobQueue.getStatus(jobId)

    return NextResponse.json(status)
  } catch (error) {
    logger.error({ error }, 'Failed to get job status')
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
