import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.com'

interface PageMetadata {
  title: string
  description: string
  path?: string
  keywords?: string[]
}

export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
}: PageMetadata): Metadata {
  const fullTitle = title === 'PILAR SYSTEMS' ? title : `${title} | PILAR SYSTEMS`
  const url = `${baseUrl}${path}`
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  const defaultKeywords = [
    'Fitnessstudio Software',
    'Gym Management',
    'AI Rezeption',
    'WhatsApp Automation',
    'Lead Management',
    'Fitness Studio Automatisierung',
    'PILAR SYSTEMS',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: 'PILAR SYSTEMS' }],
    creator: 'PILAR SYSTEMS',
    publisher: 'PILAR SYSTEMS',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'PILAR SYSTEMS',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStructuredData(type: 'Organization' | 'Product' | 'SoftwareApplication', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        '@type': 'Organization',
        name: 'PILAR SYSTEMS',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'AI SaaS Plattform für Fitnessstudios - Automatisierung von Rezeption, Lead-Management und Kundenkommunikation',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Sales',
          email: 'kontakt@pilarsystems.com',
        },
        sameAs: [
        ],
        ...data,
      }

    case 'Product':
      return {
        ...baseStructuredData,
        '@type': 'Product',
        name: 'PILAR SYSTEMS',
        description: 'AI SaaS Plattform für Fitnessstudios',
        brand: {
          '@type': 'Brand',
          name: 'PILAR SYSTEMS',
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: '100',
          highPrice: '149',
          offerCount: '2',
        },
        ...data,
      }

    case 'SoftwareApplication':
      return {
        ...baseStructuredData,
        '@type': 'SoftwareApplication',
        name: 'PILAR SYSTEMS',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '100',
          priceCurrency: 'EUR',
        },
        ...data,
      }

    default:
      return baseStructuredData
  }
}
