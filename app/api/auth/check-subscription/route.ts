/**
 * Check Subscription API Route
 * 
 * Check if the current user has an active subscription
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/check-subscription
 * 
 * Check if user has an active subscription
 * 
 * Response:
 * {
 *   "authenticated": true,
 *   "hasActiveSubscription": true/false,
 *   "subscriptionStatus": "active" | "canceled" | "past_due" | null,
 *   "plan": "BASIC" | "PRO" | null
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { authenticated: false, error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Get the authorization token from the request
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        hasActiveSubscription: false,
        subscriptionStatus: null,
        plan: null,
      })
    }

    // Check for active subscription
    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: user.id },
      include: {
        subscription: true,
      },
    })

    if (!workspace) {
      logger.info({ userId: user.id }, 'User has no workspace')
      return NextResponse.json({
        authenticated: true,
        hasActiveSubscription: false,
        subscriptionStatus: null,
        plan: null,
        workspaceId: null,
      })
    }

    const subscription = workspace.subscription

    if (!subscription) {
      logger.info({ userId: user.id, workspaceId: workspace.id }, 'Workspace has no subscription')
      return NextResponse.json({
        authenticated: true,
        hasActiveSubscription: false,
        subscriptionStatus: null,
        plan: null,
        workspaceId: workspace.id,
      })
    }

    const hasActiveSubscription = subscription.status === 'active'

    return NextResponse.json({
      authenticated: true,
      hasActiveSubscription,
      subscriptionStatus: subscription.status,
      plan: subscription.plan,
      workspaceId: workspace.id,
    })

  } catch (error) {
    logger.error({ error }, 'Error checking subscription')
    return NextResponse.json(
      {
        authenticated: false,
        hasActiveSubscription: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
