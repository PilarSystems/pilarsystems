import { NextRequest, NextResponse } from 'next/server'
import { tenantContext, TenantContext } from './context'
import { getSupabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export type TenantHandler = (
  request: NextRequest,
  context?: { params?: any }
) => Promise<NextResponse> | NextResponse

export function withTenant(handler: TenantHandler): TenantHandler {
  return async (request: NextRequest, context?: { params?: any }) => {
    try {
      const tenantCtx = await resolveTenantContext(request)
      
      if (!tenantCtx) {
        return NextResponse.json(
          { error: 'Unauthorized - no tenant context' },
          { status: 401 }
        )
      }

      return await tenantContext.run(tenantCtx, () => handler(request, context))
    } catch (error: any) {
      console.error('withTenant error:', error)
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

async function resolveTenantContext(request: NextRequest): Promise<TenantContext | null> {
  const token = request.cookies.get('sb-access-token')?.value
  
  if (!token) {
    return null
  }

  const supabase = getSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { workspaceId: true, id: true }
  })

  if (!dbUser?.workspaceId) {
    return null
  }

  return {
    workspaceId: dbUser.workspaceId,
    userId: dbUser.id
  }
}

export async function resolveTenantFromWebhook(
  source: 'stripe' | 'twilio' | 'whatsapp',
  identifier: string
): Promise<string | null> {
  try {
    switch (source) {
      case 'stripe': {
        const subscription = await prisma.subscription.findFirst({
          where: {
            OR: [
              { stripeCustomerId: identifier },
              { stripeSubscriptionId: identifier }
            ]
          },
          select: { workspaceId: true }
        })
        return subscription?.workspaceId || null
      }

      case 'twilio': {
        const twilioAccount = await prisma.twilioSubaccount.findFirst({
          where: { phoneNumber: identifier },
          select: { workspaceId: true }
        })
        return twilioAccount?.workspaceId || null
      }

      case 'whatsapp': {
        const whatsappIntegration = await prisma.whatsAppIntegration.findFirst({
          where: { phoneNumberId: identifier },
          select: { workspaceId: true }
        })
        return whatsappIntegration?.workspaceId || null
      }

      default:
        return null
    }
  } catch (error) {
    console.error(`Failed to resolve tenant from ${source}:`, error)
    return null
  }
}
