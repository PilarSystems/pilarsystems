/**
 * Sitemap configuration for SEO
 * 
 * This file generates the sitemap.xml for the PILAR SYSTEMS platform.
 * Part of Phase E SEO optimization.
 */

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.de'
  const lastModified = new Date()

  // Static marketing pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/whatsapp-coach`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Legal pages
    {
      url: `${baseUrl}/datenschutz`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/agb`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    // Auth pages (lower priority, still indexed)
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return staticPages
}
