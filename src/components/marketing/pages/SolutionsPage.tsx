'use client'

import Link from 'next/link'
import { 
  Container, 
  Section, 
  Heading, 
  Copy,
} from '@/components/marketing/core'
import { 
  AnimatedGradient,
  DepthCard,
  MicroButton,
  ScrollSection,
} from '@/components/motion'
import { 
  Building2, 
  Users, 
  User,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react'
import { motion } from 'framer-motion'
import { marketing } from '@/content/marketing.de'

const personas = [
  {
    icon: Building2,
    title: 'Einzelnes Fitnessstudio',
    tagline: 'Perfekt für Studios mit 1 Standort',
    description: 'Du führst ein einzelnes Fitnessstudio und möchtest mehr Zeit für deine Mitglieder haben statt am Telefon zu sitzen? PILAR automatisiert deine Rezeption, Lead-Verwaltung und Follow-Ups.',
    challenges: [
      'Verpasste Anrufe während des Trainings',
      'Keine Zeit für Follow-Ups',
      'Leads gehen verloren',
      'Manuelle Terminverwaltung',
      'Keine Zeit für Marketing'
    ],
    solutions: [
      'AI Phone Rezeption nimmt jeden Anruf entgegen (24/7)',
      'Automatische Lead-Klassifikation (A/B/C)',
      'Follow-Up Sequenzen laufen automatisch',
      'Calendar Sync für Probetrainings',
      'Mehr Zeit für deine Mitglieder'
    ],
    results: [
      { metric: '+40%', label: 'Mehr Leads' },
      { metric: '-60%', label: 'Weniger Verwaltung' },
      { metric: '24/7', label: 'Erreichbar' }
    ],
    plan: 'Basic',
    price: '100€/Monat'
  },
  {
    icon: Users,
    title: 'Studio-Ketten',
    tagline: 'Für Studios mit mehreren Standorten',
    description: 'Du betreibst mehrere Studios und brauchst eine zentrale Lösung für alle Standorte? PILAR skaliert mit dir und gibt dir einen Überblick über alle Locations.',
    challenges: [
      'Unterschiedliche Prozesse pro Standort',
      'Keine zentrale Lead-Verwaltung',
      'Schwierige Koordination zwischen Studios',
      'Hohe Personalkosten für Rezeption',
      'Keine einheitlichen Daten'
    ],
    solutions: [
      'Multi-Location Support (bis zu 5 Standorte)',
      'Zentrale Lead-Verwaltung & Analytics',
      'Einheitliche Prozesse für alle Standorte',
      'Separate Telefonnummern pro Location',
      'Consolidated Reporting & Insights'
    ],
    results: [
      { metric: '+60%', label: 'Effizienz' },
      { metric: '-50%', label: 'Kosten' },
      { metric: '100%', label: 'Transparenz' }
    ],
    plan: 'Pro',
    price: '149€/Monat'
  },
  {
    icon: User,
    title: 'Personal Trainer',
    tagline: 'Für selbstständige Trainer & Coaches',
    description: 'Du bist selbstständiger Personal Trainer und möchtest professioneller wirken? PILAR gibt dir die Tools eines großen Studios – zu einem Bruchteil der Kosten.',
    challenges: [
      'Kein professionelles Setup',
      'Schwierige Terminkoordination',
      'Verpasste Anfragen',
      'Keine automatischen Follow-Ups',
      'Zeitaufwändige Verwaltung'
    ],
    solutions: [
      'Professionelle AI Phone Rezeption',
      'Automatische Terminbuchung',
      'WhatsApp AI für Lead-Kommunikation',
      'Email Automation für Follow-Ups',
      'Wirke wie ein großes Studio'
    ],
    results: [
      { metric: '+80%', label: 'Mehr Kunden' },
      { metric: '-70%', label: 'Admin-Zeit' },
      { metric: '10x', label: 'Professioneller' }
    ],
    plan: 'Basic',
    price: '100€/Monat'
  }
]

export function SolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section id="hero" noPadding className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <AnimatedGradient type="radial" className="absolute inset-0 opacity-30" />
        
        <Container className="relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8"
            >
              <Zap className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Für jedes Studio</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              {marketing.solutions.hero.title}
            </Heading>

            <Copy size="xl" className="max-w-3xl mx-auto mb-10" muted>
              {marketing.solutions.hero.subtitle}
            </Copy>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: '500+', label: 'Studios' },
                { value: '50k+', label: 'Leads/Monat' },
                { value: '98%', label: 'Zufriedenheit' },
                { value: '24/7', label: 'Support' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <Copy size="sm" muted>{stat.label}</Copy>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Persona Sections */}
      {personas.map((persona, index) => {
        const Icon = persona.icon
        const isEven = index % 2 === 0

        return (
          <Section 
            key={index}
            id={`persona-${index}`}
            background={isEven ? 'default' : 'muted'}
          >
            <Container>
              <ScrollSection stagger>
                {/* Header */}
                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cyan/10">
                      <Icon className="w-8 h-8 text-brand-cyan" />
                    </div>
                    <Heading size="xl">{persona.title}</Heading>
                  </div>
                  <Copy size="xl" className="font-semibold text-brand-cyan mb-4">
                    {persona.tagline}
                  </Copy>
                  <Copy size="lg" muted className="max-w-3xl mx-auto">
                    {persona.description}
                  </Copy>
                </div>

                {/* Challenges & Solutions */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {/* Challenges */}
                  <DepthCard className="border-red-500/20 bg-red-500/5">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-400" />
                      Deine Herausforderungen
                    </h3>
                    <div className="space-y-3">
                      {persona.challenges.map((challenge, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                          <Copy size="md" muted>{challenge}</Copy>
                        </div>
                      ))}
                    </div>
                  </DepthCard>

                  {/* Solutions */}
                  <DepthCard className="border-brand-cyan/20 bg-brand-cyan/5">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan" />
                      PILAR Lösung
                    </h3>
                    <div className="space-y-3">
                      {persona.solutions.map((solution, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                          <Copy size="md">{solution}</Copy>
                        </div>
                      ))}
                    </div>
                  </DepthCard>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {persona.results.map((result, i) => (
                    <DepthCard key={i} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-brand-cyan" />
                        <div className="text-4xl font-bold text-brand-cyan">{result.metric}</div>
                      </div>
                      <Copy muted>{result.label}</Copy>
                    </DepthCard>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-cyan/10 to-brand-cyan-dark/10 border border-brand-cyan/20">
                    <div>
                      <Copy size="sm" muted className="mb-1">Empfohlener Plan</Copy>
                      <div className="text-2xl font-bold">{persona.plan}</div>
                      <Copy size="sm" className="text-brand-cyan">{persona.price}</Copy>
                    </div>
                    <Link href="/signup">
                      <MicroButton variant="primary">
                        Jetzt starten
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </MicroButton>
                    </Link>
                  </div>
                </div>
              </ScrollSection>
            </Container>
          </Section>
        )
      })}

      {/* Comparison Table */}
      <Section id="comparison" background="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Welche Lösung passt zu dir?
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Schneller Vergleich der drei Personas
            </Copy>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4">
                    <Copy size="sm" muted>Feature</Copy>
                  </th>
                  {personas.map((persona, i) => {
                    const Icon = persona.icon
                    return (
                      <th key={i} className="text-center py-4 px-4">
                        <div className="flex flex-col items-center gap-2">
                          <Icon className="h-6 w-6 text-brand-cyan" />
                          <Copy size="sm" className="font-semibold">{persona.title}</Copy>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Phone Rezeption', values: ['✓', '✓', '✓'] },
                  { feature: 'WhatsApp AI', values: ['Add-on', '✓', '✓'] },
                  { feature: 'Email Automation', values: ['✓', '✓', '✓'] },
                  { feature: 'Lead Engine', values: ['✓', '✓', '✓'] },
                  { feature: 'Calendar Sync', values: ['✓', '✓', '✓'] },
                  { feature: 'Analytics', values: ['Basic', 'Advanced', 'Basic'] },
                  { feature: 'Standorte', values: ['1', 'bis zu 5', '1'] },
                  { feature: 'Support', values: ['Email', 'Priority', 'Email'] },
                  { feature: 'Preis', values: ['100€/Mo', '149€/Mo', '100€/Mo'] }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-4">
                      <Copy size="md">{row.feature}</Copy>
                    </td>
                    {row.values.map((value, j) => (
                      <td key={j} className="text-center py-4 px-4">
                        <Copy size="md" className={value === '✓' ? 'text-brand-cyan' : ''}>
                          {value}
                        </Copy>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section id="cta">
        <Container>
          <ScrollSection>
            <DepthCard className="text-center py-16 border-brand-cyan/30 relative overflow-hidden">
              <AnimatedGradient type="conic" className="absolute inset-0 opacity-20" />
              
              <div className="relative z-10">
                <Heading size="xl" className="mb-4">
                  Bereit für deine Lösung?
                </Heading>
                <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                  Starte jetzt und finde heraus, wie PILAR dein Business transformiert
                </Copy>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <MicroButton variant="primary" size="lg">
                      Jetzt starten
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </MicroButton>
                  </Link>
                  <Link href="/pricing">
                    <MicroButton variant="secondary" size="lg">
                      Preise vergleichen
                    </MicroButton>
                  </Link>
                </div>
              </div>
            </DepthCard>
          </ScrollSection>
        </Container>
      </Section>
    </div>
  )
}
