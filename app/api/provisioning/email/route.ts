export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { emailAutomationService } from '@/services/email/automation'
import { jobQueue } from '@/lib/queue'
import { logger } from '@/lib/logger'
import { z } from 'zod'


export const runtime = 'nodejs'

const provisionSchema = z.object({
  workspaceId: z.string().uuid(),
  provider: z.enum(['gmail', 'outlook', 'custom']),
  email: z.string().email(),
  imapHost: z.string(),
  imapPort: z.number(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  username: z.string(),
  password: z.string(),
  useTLS: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = provisionSchema.parse(body)

    logger.info({ workspaceId: data.workspaceId, email: data.email }, 'Starting email provisioning')

    const jobId = await jobQueue.enqueue(data.workspaceId, 'email_setup')

    try {
      await jobQueue.updateProgress(jobId, 10, 'in_progress')

      await emailAutomationService.provisionEmail(data)

      await jobQueue.updateProgress(jobId, 100)

      await jobQueue.complete(jobId, {
        email: data.email,
        provider: data.provider,
      })

      return NextResponse.json({
        success: true,
        jobId,
        data: {
          email: data.email,
          provider: data.provider,
        },
      })
    } catch (error) {
      await jobQueue.fail(jobId, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  } catch (error) {
    logger.error({ error }, 'Email provisioning failed')

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Provisioning failed' },
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

    const status = await emailAutomationService.getStatus(workspaceId)

    if (!status) {
      return NextResponse.json({ provisioned: false })
    }

    return NextResponse.json({
      provisioned: true,
      ...status,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get email status')
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
