import { google } from 'googleapis'

export function getGoogleCalendarClient(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id',
    process.env.GOOGLE_CLIENT_SECRET || 'placeholder-client-secret',
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function createCalendarEvent(
  calendar: any,
  event: {
    summary: string
    description?: string
    location?: string
    start: { dateTime: string; timeZone: string }
    end: { dateTime: string; timeZone: string }
    attendees?: { email: string }[]
  }
) {
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    })
    return response.data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

export async function listCalendarEvents(
  calendar: any,
  timeMin: string,
  timeMax: string
) {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return response.data.items || []
  } catch (error) {
    console.error('Error listing calendar events:', error)
    throw error
  }
}
