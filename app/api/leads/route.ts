export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const leads: any[] = []

    return NextResponse.json(leads)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch leads')
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

const createLeadSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.enum(['whatsapp', 'phone', 'email', 'manual', 'web']),
  classification: z.enum(['A', 'B', 'C']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createLeadSchema.parse(body)

    const lead = await prisma.lead.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        classification: data.classification,
        priority: data.priority || 'medium',
        status: 'new',
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId: data.workspaceId,
        actionType: 'lead_created',
        description: `New lead created: ${data.name}`,
        metadata: {
          leadId: lead.id,
          source: data.source,
        },
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    logger.error({ error }, 'Failed to create lead')
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
