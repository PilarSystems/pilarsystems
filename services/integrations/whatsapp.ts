import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { logger } from '@/lib/logger'
import axios from 'axios'

export async function connectWhatsApp(
  workspaceId: string,
  config: {
    apiToken: string
    phoneNumberId: string
    businessNumber: string
  }
) {
  try {
    logger.info({ workspaceId }, 'Connecting WhatsApp integration')

    await testWhatsAppConnection(config.apiToken, config.phoneNumberId)

    const encryptedConfig = encrypt(JSON.stringify(config))

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'whatsapp',
        },
      },
      update: {
        config: encryptedConfig,
        status: 'active',
      },
      create: {
        workspaceId,
        type: 'whatsapp',
        config: encryptedConfig,
        status: 'active',
      },
    })

    logger.info({ workspaceId }, 'WhatsApp integration connected')

    return { success: true }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error connecting WhatsApp')
    throw error
  }
}

async function testWhatsAppConnection(apiToken: string, phoneNumberId: string) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${phoneNumberId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )

    if (!response.data) {
      throw new Error('Invalid WhatsApp credentials')
    }

    return true
  } catch (error) {
    logger.error({ error }, 'WhatsApp connection test failed')
    throw new Error('Failed to connect to WhatsApp API')
  }
}

export async function getWhatsAppConfig(workspaceId: string) {
  try {
    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'whatsapp',
        },
      },
    })

    if (!integration || integration.status !== 'active') {
      return null
    }

    const config = JSON.parse(decrypt(integration.config))
    return config
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error getting WhatsApp config')
    return null
  }
}
