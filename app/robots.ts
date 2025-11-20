import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/onboarding/',
          '/login',
          '/signup',
          '/reset-password',
          '/verify-email',
          '/checkout',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
