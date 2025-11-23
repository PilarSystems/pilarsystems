export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const step2Schema = z.object({
  userId: z.string(),
  hours: z.record(z.string(), z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step2Schema.parse(body)

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
          openingHours: data.hours,
        },
      },
    })

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 2,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 2,
        completed: true,
        data: { step2: data },
      },
      update: {
        completed: true,
        data: { step2: data },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 2')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
