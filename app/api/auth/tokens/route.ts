/**
 * API Token Management Routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { identityEngine } from '@/lib/auth/identity-engine'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const validation = await identityEngine.validateToken(token, 'read')

    if (!validation.valid || !validation.workspaceId) {
      return NextResponse.json({ error: validation.reason || 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as any

    const tokens = await identityEngine.listTokens(validation.workspaceId, type)

    return NextResponse.json({ success: true, tokens })
  } catch (error) {
    console.error('Error listing tokens:', error)
    return NextResponse.json({ error: 'Failed to list tokens' }, { status: 500 })
  }
}

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
    const { name, scopes, type, expiresInDays } = body

    if (!name || !scopes || !Array.isArray(scopes)) {
      return NextResponse.json(
        { error: 'name and scopes (array) required' },
        { status: 400 }
      )
    }

    let result
    if (type === 'service_token') {
      result = await identityEngine.generateServiceToken(
        validation.workspaceId,
        name,
        scopes
      )
    } else {
      result = await identityEngine.generateApiKey(
        validation.workspaceId,
        name,
        scopes,
        expiresInDays
      )
    }

    const apiKey = 'apiKey' in result ? result.apiKey : result.serviceToken

    return NextResponse.json({
      success: true,
      token: result.token,
      apiKey
    })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get('tokenId')

    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId required' }, { status: 400 })
    }

    await identityEngine.revokeToken(tokenId, validation.workspaceId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking token:', error)
    return NextResponse.json({ error: 'Failed to revoke token' }, { status: 500 })
  }
}
