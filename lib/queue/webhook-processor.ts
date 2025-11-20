import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function processWebhookWithIdempotency(
  source: string,
  externalId: string,
  workspaceId: string | null,
  payload: any,
  processor: () => Promise<void>
): Promise<{ processed: boolean; duplicate: boolean }> {
  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')

  try {
    const existing = await prisma.webhookEvent.findUnique({
      where: {
        source_externalId: {
          source,
          externalId
        }
      }
    })

    if (existing) {
      if (existing.status === 'completed') {
        return { processed: true, duplicate: true }
      }

      if (existing.status === 'processing') {
        return { processed: false, duplicate: true }
      }

      if (existing.attempts >= existing.maxAttempts) {
        return { processed: false, duplicate: true }
      }
    }

    const webhookEvent = await prisma.webhookEvent.upsert({
      where: {
        source_externalId: {
          source,
          externalId
        }
      },
      create: {
        source,
        externalId,
        workspaceId,
        status: 'processing',
        attempts: 1,
        payload,
        payloadHash
      },
      update: {
        status: 'processing',
        attempts: { increment: 1 },
        updatedAt: new Date()
      }
    })

    try {
      await processor()

      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: 'completed',
          processedAt: new Date()
        }
      })

      return { processed: true, duplicate: false }
    } catch (error: any) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: webhookEvent.attempts >= webhookEvent.maxAttempts ? 'failed' : 'pending',
          error: error.message || 'Unknown error'
        }
      })

      throw error
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    throw error
  }
}
