import { Metadata } from 'next'
import { FeaturesPage } from '@/components/marketing/pages/FeaturesPage'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Features - PILAR SYSTEMS',
  description: 'Alle Features von PILAR SYSTEMS: AI Phone Rezeption, WhatsApp AI, Email Automation, Lead Engine, Calendar Sync, Analytics. Vollautomatisch.',
  path: '/features',
  keywords: ['AI Rezeption Features', 'WhatsApp Automation', 'Lead Management Features'],
})

export default function Page() {
  return <FeaturesPage />
}
