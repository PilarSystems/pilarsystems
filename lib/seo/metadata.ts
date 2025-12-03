/**
 * SEO Metadata Utilities
 * 
 * Centralized SEO utilities for generating consistent metadata across the platform.
 * Part of Phase E optimization for improved organic reach.
 */

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.de'
const SITE_NAME = 'PILAR SYSTEMS'
const DEFAULT_TITLE = 'PILAR SYSTEMS - KI-gesteuerte Automatisierung für Fitnessstudios'
const DEFAULT_DESCRIPTION = 'Automatisiere dein Fitnessstudio mit KI: WhatsApp AI, Phone AI, Lead Management. 100% Self-Service Onboarding. Keine Einrichtungskosten.'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
}

/**
 * Generate comprehensive metadata for pages
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = [],
    image = '/og-image.png',
    url = '',
    type = 'website',
    noIndex = false,
  } = props

  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const fullUrl = `${SITE_URL}${url}`
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const defaultKeywords = [
    'Fitnessstudio Software',
    'Gym Management',
    'AI Automation',
    'WhatsApp AI',
    'Lead Management',
    'Fitnessstudio Automatisierung',
    'KI für Gyms',
    'Probetraining Buchung',
    'Fitness CRM',
  ]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: fullUrl,
      languages: {
        'de-DE': fullUrl,
        'en-US': fullUrl.replace('/de/', '/en/'),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }

  return metadata
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
    },
    sameAs: [],
  }
}

/**
 * Generate JSON-LD structured data for SoftwareApplication
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: DEFAULT_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '100',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '100',
        priceCurrency: 'EUR',
        billingDuration: 'P1M',
      },
    },
    featureList: [
      'AI Phone Rezeption 24/7',
      'WhatsApp AI Automation',
      'Email Automation',
      'Lead Engine (A/B/C Klassifikation)',
      'Calendar Sync',
      'Analytics Dashboard',
    ],
  }
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate JSON-LD structured data for Product (pricing)
 */
export function generateProductSchema(
  name: string,
  description: string,
  price: number,
  features: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: price.toString(),
        priceCurrency: 'EUR',
        billingDuration: 'P1M',
      },
      availability: 'https://schema.org/InStock',
    },
    additionalProperty: features.map((feature) => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature,
    })),
  }
}

/**
 * Generate JSON-LD structured data for LocalBusiness
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
    },
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
