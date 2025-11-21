/**
 * Operator Runtime API
 * 
 * Endpoints for managing automated operator runtime
 */

import { NextRequest, NextResponse } from 'next/server'
import { operatorRuntime } from '@/lib/autopilot/operator-runtime'
import { identityEngine } from '@/lib/auth/identity-engine'

export const runtime = 'nodejs'

/**
 * POST /api/autopilot/operator - Control operator runtime
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'admin')

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action === 'start') {
      await operatorRuntime.start()
      return NextResponse.json({
        success: true,
        message: 'Operator runtime started'
      })
    } else if (action === 'stop') {
      await operatorRuntime.stop()
      return NextResponse.json({
        success: true,
        message: 'Operator runtime stopped'
      })
    } else if (action === 'run_cycle') {
      await operatorRuntime.runCycle()
      return NextResponse.json({
        success: true,
        message: 'Operator cycle completed'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: start, stop, or run_cycle' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error controlling operator:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to control operator' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/autopilot/operator - Get operator status
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'read')

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid token' },
        { status: 401 }
      )
    }

    const status = operatorRuntime.getStatus()

    return NextResponse.json({
      success: true,
      status
    })
  } catch (error) {
    console.error('Error getting operator status:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}
