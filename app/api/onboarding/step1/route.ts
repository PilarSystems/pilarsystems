export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'


export const runtime = 'nodejs'

const step1Schema = z.object({
  userId: z.string(),
  studioName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional(),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = step1Schema.parse(body)

    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: data.userId },
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: data.studioName,
          ownerId: data.userId,
          studioInfo: {
            studioName: data.studioName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            phone: data.phone,
            email: data.email,
            website: data.website,
            description: data.description,
          },
        },
      })
    } else {
      workspace = await prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          name: data.studioName,
          studioInfo: {
            ...(workspace.studioInfo as any),
            studioName: data.studioName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            phone: data.phone,
            email: data.email,
            website: data.website,
            description: data.description,
          },
        },
      })
    }

    await prisma.wizardProgress.upsert({
      where: {
        workspaceId_step: {
          workspaceId: workspace.id,
          step: 1,
        },
      },
      create: {
        workspaceId: workspace.id,
        step: 1,
        completed: true,
        data: { step1: data },
      },
      update: {
        completed: true,
        data: { step1: data },
      },
    })

    return NextResponse.json({ success: true, workspaceId: workspace.id })
  } catch (error) {
    logger.error({ error }, 'Failed to save onboarding step 1')
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
