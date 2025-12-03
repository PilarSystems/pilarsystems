/**
 * Multi-Channel Sequences API
 * Manage and execute multi-step communication sequences
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { multiChannelOrchestrator } from '@/services/multichannel'
import { logger } from '@/lib/logger'

interface StartSequenceRequest {
  sequenceId: string
  workspaceId: string
  leadId: string
}

interface SequenceActionRequest {
  executionId: string
  action: 'pause' | 'resume' | 'cancel'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = request.nextUrl.searchParams.get('action')

    if (action) {
      // Handle sequence actions (pause, resume, cancel)
      const { executionId, action: sequenceAction } = body as SequenceActionRequest

      if (!executionId || !sequenceAction) {
        return NextResponse.json(
          { error: 'executionId and action are required' },
          { status: 400 }
        )
      }

      switch (sequenceAction) {
        case 'pause':
          await multiChannelOrchestrator.pauseSequence(executionId)
          return NextResponse.json({
            success: true,
            message: 'Sequence paused',
            executionId,
          })

        case 'resume':
          await multiChannelOrchestrator.resumeSequence(executionId)
          return NextResponse.json({
            success: true,
            message: 'Sequence resumed',
            executionId,
          })

        case 'cancel':
          await multiChannelOrchestrator.cancelSequence(executionId)
          return NextResponse.json({
            success: true,
            message: 'Sequence cancelled',
            executionId,
          })

        default:
          return NextResponse.json(
            { error: 'Invalid action. Must be pause, resume, or cancel' },
            { status: 400 }
          )
      }
    }

    // Start a new sequence
    const { sequenceId, workspaceId, leadId } = body as StartSequenceRequest

    if (!sequenceId || !workspaceId || !leadId) {
      return NextResponse.json(
        { error: 'sequenceId, workspaceId, and leadId are required' },
        { status: 400 }
      )
    }

    logger.info(
      { sequenceId, workspaceId, leadId },
      'Starting sequence'
    )

    const execution = await multiChannelOrchestrator.startSequence(
      sequenceId,
      workspaceId,
      leadId
    )

    return NextResponse.json({
      success: true,
      execution: {
        id: execution.id,
        sequenceId: execution.sequenceId,
        status: execution.status,
        startedAt: execution.startedAt,
      },
    })
  } catch (error) {
    logger.error({ error }, 'Sequence operation failed')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Operation failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    // Return available sequences (placeholder - would typically come from database)
    const sequences = [
      {
        id: 'seq-welcome',
        name: 'Welcome Sequence',
        description: 'Multi-channel welcome sequence for new leads',
        steps: 3,
        channels: ['whatsapp', 'email', 'sms'],
        active: true,
      },
      {
        id: 'seq-followup',
        name: 'Follow-up Sequence',
        description: 'Automated follow-up for inactive leads',
        steps: 4,
        channels: ['email', 'sms'],
        active: true,
      },
      {
        id: 'seq-reengagement',
        name: 'Re-engagement Campaign',
        description: 'Win back inactive members',
        steps: 5,
        channels: ['email', 'whatsapp'],
        active: true,
      },
    ]

    return NextResponse.json({
      workspaceId,
      sequences,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to get sequences')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get sequences' },
      { status: 500 }
    )
  }
}
