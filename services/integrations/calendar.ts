import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { logger } from '@/lib/logger'
import { google } from 'googleapis'

export async function connectGoogleCalendar(
  workspaceId: string,
  config: {
    accessToken: string
    refreshToken: string
    calendarId: string
  }
) {
  try {
    logger.info({ workspaceId }, 'Connecting Google Calendar integration')

    await testCalendarConnection(config.accessToken, config.refreshToken)

    const encryptedConfig = encrypt(JSON.stringify(config))

    await prisma.integration.upsert({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'calendar',
        },
      },
      update: {
        config: encryptedConfig,
        status: 'active',
      },
      create: {
        workspaceId,
        type: 'calendar',
        config: encryptedConfig,
        status: 'active',
      },
    })

    logger.info({ workspaceId }, 'Google Calendar integration connected')

    return { success: true }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error connecting Google Calendar')
    throw error
  }
}

async function testCalendarConnection(accessToken: string, refreshToken: string) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    )

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    await calendar.calendarList.list()

    return true
  } catch (error) {
    logger.error({ error }, 'Google Calendar connection test failed')
    throw new Error('Failed to connect to Google Calendar API')
  }
}

export async function getCalendarConfig(workspaceId: string) {
  try {
    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_type: {
          workspaceId,
          type: 'calendar',
        },
      },
    })

    if (!integration || integration.status !== 'active') {
      return null
    }

    const config = JSON.parse(decrypt(integration.config))
    return config
  } catch (error) {
    logger.error({ error, workspaceId }, 'Error getting Calendar config')
    return null
  }
}
