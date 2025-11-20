import { Metadata } from 'next'
import { BlogPage } from '@/components/marketing/pages/BlogPage'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Blog - PILAR SYSTEMS',
  description: 'PILAR Blog: Insights, Best Practices und Trends für Fitnessstudios. AI, Marketing, Lead-Conversion, DSGVO und mehr.',
  path: '/blog',
  keywords: ['Fitnessstudio Blog', 'AI Fitness', 'Lead Conversion', 'Studio Marketing'],
})

export default function Page() {
  return <BlogPage />
}
