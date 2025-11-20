import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Affiliate redirect route: /r/[code]
 * 
 * Tracks affiliate clicks and redirects to homepage with affiliate cookie set.
 * Example: /r/ABC123 → tracks click for affiliate ABC123 → redirects to /
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const trackResponse = await fetch(
      new URL('/api/affiliate/track-click', request.url).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      }
    )

    const response = NextResponse.redirect(new URL('/', request.url))

    const cookieStore = await cookies()
    cookieStore.set('affiliate_ref', code, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
