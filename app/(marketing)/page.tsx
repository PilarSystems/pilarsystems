import { Metadata } from 'next'
import { HomePage } from '@/components/marketing/pages/HomePage'
import { generateMetadata as genMeta, generateStructuredData } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'PILAR SYSTEMS - AI SaaS für Fitnessstudios',
  description: 'Automatisiere dein Fitnessstudio mit AI. 24/7 Rezeption, Lead-Management, WhatsApp & Phone AI, Follow-Up Automation. Vollautomatisches Studio-Management.',
  path: '/',
  keywords: ['Fitnessstudio Automatisierung', 'AI Rezeption', 'WhatsApp Bot', 'Lead Management', 'Gym Software'],
})

export default function Page() {
  const structuredData = generateStructuredData('Organization', {
    name: 'PILAR SYSTEMS',
    description: 'AI SaaS Plattform für Fitnessstudios - Automatisierung von Rezeption, Lead-Management und Kundenkommunikation',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage />
    </>
  )
}
