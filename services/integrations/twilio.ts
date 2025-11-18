import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { logger } from '@/lib/logger'
import twilio from 'twilio'

export async function connectTwilio(
  workspaceId: string,
  config: {
    accountSid: string
    authToken: string
    phoneNumber: string
    voicemailEnabled: boolean
  }
) {
  try {
    logger.info({ workspaceId }, 'Connecting Twilio integration')

    await testTwilioConnection(config.accountSid, config.authToken)

    const encryptedConfig = encrypt(JSON.stringify(config))

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'phone',
        },
      },
      update: {
        config: encryptedConfig,
        status: 'active',
      },
      create: {
        workspaceId,
        type: 'phone',
        config: encryptedConfig,
        status: 'active',
      },
    })

    logger.info({ workspaceId }, 'Twilio integration connected')

    return { success: true }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error connecting Twilio')
    throw error
  }
}

async function testTwilioConnection(accountSid: string, authToken: string) {
  try {
    const client = twilio(accountSid, authToken)
    await client.api.accounts(accountSid).fetch()
    return true
  } catch (error) {
    logger.error({ error }, 'Twilio connection test failed')
    throw new Error('Failed to connect to Twilio API')
  }
}

export async function getTwilioConfig(workspaceId: string) {
  try {
    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'phone',
        },
      },
    })

    if (!integration || integration.status !== 'active') {
      return null
    }

    const config = JSON.parse(decrypt(integration.config))
    return config
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error getting Twilio config')
    return null
  }
}
