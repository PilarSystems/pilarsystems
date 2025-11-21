/**
 * Token Rotation Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { identityEngine } from '@/lib/auth/identity-engine'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'admin')

    if (!validation.valid || !validation.workspaceId) {
      return NextResponse.json({ error: validation.reason || 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { tokenId } = body

    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId required' }, { status: 400 })
    }

    const result = await identityEngine.rotateToken(tokenId, validation.workspaceId)

    return NextResponse.json({
      success: true,
      token: result.token,
      apiKey: result.apiKey
    })
  } catch (error) {
    console.error('Error rotating token:', error)
    return NextResponse.json({ error: 'Failed to rotate token' }, { status: 500 })
  }
}
