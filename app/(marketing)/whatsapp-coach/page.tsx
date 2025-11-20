import { Metadata } from 'next'
import { CoachPage } from '@/components/marketing/pages/CoachPage'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'WhatsApp Coach - PILAR SYSTEMS',
  description: 'Dein AI Coach auf WhatsApp. Chatte automatisch mit Leads und Mitgliedern. 24/7 verfügbar. < 2 Sekunden Antwortzeit. +60% höhere Conversion.',
  path: '/whatsapp-coach',
  keywords: ['WhatsApp Coach', 'WhatsApp Automation', 'AI Chat', 'Lead Qualifizierung'],
})

export default function Page() {
  return <CoachPage />
}
