import { Metadata } from 'next'
import { AboutPage } from '@/components/marketing/pages/AboutPage'
import { generateMetadata as genMeta, generateStructuredData } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Über uns - PILAR SYSTEMS',
  description: 'PILAR automatisiert Fitnessstudios mit AI. Mission: Mehr Zeit für Mitglieder. Vision: Führende AI-Plattform in Europa. 500+ Studios vertrauen uns.',
  path: '/about',
  keywords: ['PILAR Team', 'Über PILAR', 'Fitnessstudio Automation', 'AI für Fitness'],
})

export default function Page() {
  const structuredData = generateStructuredData('Organization', {
    name: 'PILAR SYSTEMS',
    description: 'AI SaaS Plattform für Fitnessstudios',
    foundingDate: '2023',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutPage />
    </>
  )
}
