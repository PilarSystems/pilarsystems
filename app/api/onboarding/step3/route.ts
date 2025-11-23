export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const step3Schema = z.object({
  userId: z.string(),
  offers: z.array(z.object({
    name: z.string(),
    price: z.string(),
    description: z.string().optional(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step3Schema.parse(body)

    const workspace = await prisma.workspace.findFirst({
      where: { ownerId: data.userId },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        studioInfo: {
          ...(workspace.studioInfo as any),
          offers: data.offers,
        },
      },
    })

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 3,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 3,
        completed: true,
        data: { step3: data },
      },
      update: {
        completed: true,
        data: { step3: data },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 3')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
