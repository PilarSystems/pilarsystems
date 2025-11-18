import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { logger } from '@/lib/logger'
import nodemailer from 'nodemailer'

export async function connectEmail(
  workspaceId: string,
  config: {
    imapHost: string
    imapPort: number
    smtpHost: string
    smtpPort: number
    email: string
    password: string
  }
) {
  try {
    logger.info({ workspaceId }, 'Connecting Email integration')

    await testEmailConnection(config)

    const encryptedConfig = encrypt(JSON.stringify(config))

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'email',
        },
      },
      update: {
        config: encryptedConfig,
        status: 'active',
      },
      create: {
        workspaceId,
        type: 'email',
        config: encryptedConfig,
        status: 'active',
      },
    })

    logger.info({ workspaceId }, 'Email integration connected')

    return { success: true }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error connecting Email')
    throw error
  }
}

async function testEmailConnection(config: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.email,
        pass: config.password,
      },
    })

    await transporter.verify()
    return true
  } catch (error) {
    logger.error({ error }, 'Email connection test failed')
    throw new Error('Failed to connect to email server')
  }
}

export async function getEmailConfig(workspaceId: string) {
  try {
    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'email',
        },
      },
    })

    if (!integration || integration.status !== 'active') {
      return null
    }

    const config = JSON.parse(decrypt(integration.config))
    return config
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error getting Email config')
    return null
  }
}
