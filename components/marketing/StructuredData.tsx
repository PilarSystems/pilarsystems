/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for SEO purposes.
 * Part of Phase E SEO optimization.
 */

import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Component to inject JSON-LD structured data into pages
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      strategy="beforeInteractive"
    />
  )
}

export default StructuredData
