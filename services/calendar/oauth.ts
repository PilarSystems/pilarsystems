import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback`

/**
 * Calendar OAuth Service
 * Handles Google Calendar OAuth flow and token management
 */
export class CalendarOAuthService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    )
  }

  /**
   * Generate OAuth URL for Google Calendar
   */
  getAuthUrl(workspaceId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ]

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: workspaceId, // Pass workspaceId in state
      prompt: 'consent', // Force consent to get refresh token
    })

    logger.info({ workspaceId }, 'Generated Google Calendar OAuth URL')

    return url
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, workspaceId: string): Promise<void> {
    try {
      logger.info({ workspaceId }, 'Exchanging code for tokens')

      const { tokens } = await this.oauth2Client.getToken(code)

      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('No tokens received from Google')
      }

      await prisma.oAuthToken.upsert({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'google_calendar',
          },
        },
        create: {
          workspaceId,
          provider: 'google_calendar',
          accessToken: secretsService.encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token
            ? secretsService.encrypt(tokens.refresh_token)
            : null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope,
        },
        update: {
          accessToken: secretsService.encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token
            ? secretsService.encrypt(tokens.refresh_token)
            : null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope,
        },
      })

      logger.info({ workspaceId }, 'Google Calendar tokens stored')

      await auditService.logProvisioning(
        workspaceId,
        'calendar.oauth.connected',
        'oauth_token',
        workspaceId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to exchange code for tokens')

      await auditService.logProvisioning(
        workspaceId,
        'calendar.oauth.connected',
        'oauth_token',
        workspaceId,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getAccessToken(workspaceId: string): Promise<string> {
    try {
      const tokenRecord = await prisma.oAuthToken.findUnique({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'google_calendar',
          },
        },
      })

      if (!tokenRecord) {
        throw new Error('No OAuth token found for workspace')
      }

      const now = new Date()
      const expiresAt = tokenRecord.expiresAt
      const needsRefresh = !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000

      if (needsRefresh && tokenRecord.refreshToken) {
        logger.info({ workspaceId }, 'Refreshing access token')
        return await this.refreshAccessToken(workspaceId, tokenRecord.refreshToken)
      }

      return secretsService.decrypt(tokenRecord.accessToken)
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to get access token')
      throw error
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(workspaceId: string, encryptedRefreshToken: string): Promise<string> {
    try {
      const refreshToken = secretsService.decrypt(encryptedRefreshToken)

      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      })

      const { credentials } = await this.oauth2Client.refreshAccessToken()

      if (!credentials.access_token) {
        throw new Error('No access token received from refresh')
      }

      await prisma.oAuthToken.update({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'google_calendar',
          },
        },
        data: {
          accessToken: secretsService.encrypt(credentials.access_token),
          expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        },
      })

      logger.info({ workspaceId }, 'Access token refreshed')

      await auditService.log({
        workspaceId,
        action: 'calendar.token.refreshed',
        resource: 'oauth_token',
        success: true,
      })

      return credentials.access_token
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to refresh access token')
      throw error
    }
  }

  /**
   * Revoke OAuth access
   */
  async revokeAccess(workspaceId: string): Promise<void> {
    try {
      const tokenRecord = await prisma.oAuthToken.findUnique({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'google_calendar',
          },
        },
      })

      if (!tokenRecord) {
        return
      }

      const accessToken = secretsService.decrypt(tokenRecord.accessToken)

      await this.oauth2Client.revokeToken(accessToken)

      await prisma.oAuthToken.delete({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'google_calendar',
          },
        },
      })

      logger.info({ workspaceId }, 'Google Calendar access revoked')

      await auditService.log({
        workspaceId,
        action: 'calendar.oauth.revoked',
        resource: 'oauth_token',
        success: true,
      })
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to revoke access')
      throw error
    }
  }

  /**
   * Get OAuth status
   */
  async getStatus(workspaceId: string) {
    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider: 'google_calendar',
        },
      },
    })

    if (!tokenRecord) {
      return { connected: false }
    }

    return {
      connected: true,
      expiresAt: tokenRecord.expiresAt,
      scope: tokenRecord.scope,
    }
  }

  /**
   * Sync calendar events
   */
  async syncEvents(workspaceId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken(workspaceId)

      this.oauth2Client.setCredentials({
        access_token: accessToken,
      })

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      const now = new Date()
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: thirtyDaysLater.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      const events = response.data.items || []

      logger.info({ workspaceId, eventCount: events.length }, 'Syncing calendar events')

      for (const event of events) {
        if (!event.start?.dateTime || !event.end?.dateTime) {
          continue
        }

        await prisma.calendarEvent.upsert({
          where: {
            workspaceId,
            googleEventId: event.id!,
          } as any,
          create: {
            workspaceId,
            googleEventId: event.id!,
            title: event.summary || 'Untitled Event',
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime),
            location: event.location,
            type: 'other',
            status: 'scheduled',
          },
          update: {
            title: event.summary || 'Untitled Event',
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime),
            location: event.location,
          },
        })
      }

      logger.info({ workspaceId, syncedCount: events.length }, 'Calendar events synced')
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to sync calendar events')
      throw error
    }
  }
}

export const calendarOAuthService = new CalendarOAuthService()
