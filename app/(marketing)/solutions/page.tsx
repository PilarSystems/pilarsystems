import { Metadata } from 'next'
import { SolutionsPage } from '@/components/marketing/pages/SolutionsPage'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Lösungen - PILAR SYSTEMS',
  description: 'PILAR Lösungen für Einzelstudios, Studio-Ketten und Personal Trainer. Finde die perfekte Lösung für dein Fitness-Business.',
  path: '/solutions',
  keywords: ['Fitnessstudio Lösung', 'Studio-Kette Software', 'Personal Trainer Software'],
})

export default function Page() {
  return <SolutionsPage />
}
