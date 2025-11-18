import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/services/stripe/checkout'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'PRO']),
  whatsappAddon: z.boolean(),
  userId: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, whatsappAddon, userId, email } = checkoutSchema.parse(body)

    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: userId },
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'My Studio',
          ownerId: userId,
        },
      })
    }

    const session = await createCheckoutSession(workspace.id, plan, whatsappAddon)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    logger.error({ error }, 'Failed to create checkout session')
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
