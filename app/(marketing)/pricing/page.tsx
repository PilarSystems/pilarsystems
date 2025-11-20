import { Metadata } from 'next'
import { PricingPage } from '@/components/marketing/pages/PricingPage'
import { generateMetadata as genMeta, generateStructuredData } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Preise - PILAR SYSTEMS',
  description: 'Transparente Preise für PILAR SYSTEMS. Basic ab 100€/Monat, Pro ab 149€/Monat. Keine versteckten Kosten. Monatlich kündbar.',
  path: '/pricing',
  keywords: ['Fitnessstudio Software Preise', 'Gym Management Kosten', 'AI Rezeption Preis'],
})

export default function Page() {
  const structuredData = generateStructuredData('Product', {
    name: 'PILAR SYSTEMS',
    description: 'AI SaaS Plattform für Fitnessstudios',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '100',
      highPrice: '149',
      offerCount: '2',
    },
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PricingPage />
    </>
  )
}
