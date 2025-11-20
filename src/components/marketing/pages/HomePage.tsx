'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Container, 
  Section, 
  Heading, 
  Copy, 
  SystemGraph,
} from '@/components/marketing/core'
import { 
  AnimatedGradient,
  DepthCard,
  MicroButton,
  ScrollSection,
  NodeFlow
} from '@/components/motion'
import { useParallax } from '@/hooks/useParallax'
import { AnchorTabs } from '@/components/marketing/AnchorTabs'
import { marketing } from '@/content/marketing.de'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Users, 
  Calendar, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react'

const systemNodes = [
  { id: 'phone', label: 'Phone AI', x: 200, y: 100 },
  { id: 'whatsapp', label: 'WhatsApp', x: 400, y: 80 },
  { id: 'email', label: 'Email AI', x: 600, y: 100 },
  { id: 'leads', label: 'Lead Engine', x: 400, y: 250 },
  { id: 'calendar', label: 'Calendar', x: 200, y: 400 },
  { id: 'analytics', label: 'Analytics', x: 600, y: 400 },
]

const systemConnections = [
  { from: 'phone', to: 'leads' },
  { from: 'whatsapp', to: 'leads' },
  { from: 'email', to: 'leads' },
  { from: 'leads', to: 'calendar' },
  { from: 'leads', to: 'analytics' },
]

const features = marketing.home.features.items.slice(0, 6).map((item, i) => ({
  icon: [Phone, MessageSquare, Mail, Users, Calendar, BarChart3][i],
  title: item.title,
  description: item.description,
}))

const stats = [
  { value: '24/7', label: 'Verfügbarkeit', icon: Clock },
  { value: '< 2 Min', label: 'Antwortzeit', icon: Zap },
  { value: '+40%', label: 'Mehr Leads', icon: TrendingUp },
  { value: '100%', label: 'DSGVO-konform', icon: Shield },
]

const anchorTabs = [
  { id: 'hero', label: 'Überblick' },
  { id: 'system', label: 'System' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Preise' },
  { id: 'faq', label: 'FAQ' },
]

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Sticky Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <Container>
          <div className="py-3 flex justify-center">
            <AnchorTabs tabs={anchorTabs} />
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <Section id="hero" noPadding className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <AnimatedGradient type="radial" className="absolute inset-0 opacity-30" />
        
        <Container className="relative z-10 py-32">
          <motion.div
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8"
            >
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Vollautomatisches KI Studio</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heading as="h1" size="3xl" className="mb-6">
                {marketing.home.hero.title}
              </Heading>
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Copy size="xl" className="max-w-3xl mx-auto mb-10" muted>
                {marketing.home.hero.subtitle}
              </Copy>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/signup">
                <MicroButton variant="primary" size="lg">
                  {marketing.cta.primary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MicroButton>
              </Link>
              <Link href="/features">
                <MicroButton variant="secondary" size="lg">
                  {marketing.cta.learnMore}
                </MicroButton>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-brand-cyan mr-2" />
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* System Graph Section */}
      <Section id="system" background="muted">
        <Container>
          <ScrollSection>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                Ein System. Alle Kanäle.
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                PILAR verbindet alle deine Kommunikationskanäle und automatisiert den kompletten Lead-Prozess
              </Copy>
            </div>

            <div className="relative">
              <NodeFlow nodes={systemNodes} edges={systemConnections} />
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Problem → Solution Section */}
      <Section>
        <Container>
          <ScrollSection>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                Schluss mit manueller Arbeit
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                Während andere Studios im Chaos versinken, automatisiert PILAR alles
              </Copy>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Problems */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-destructive mb-6">❌ Ohne PILAR</h3>
                {[
                  'Telefon klingelt durch – Leads gehen verloren',
                  'WhatsApp & Instagram voll – keine Zeit zu antworten',
                  'Leads antworten nicht auf Follow-Ups',
                  'Kein Überblick über Termine & Probetrainings',
                  'Trainer verbringen Stunden am Telefon'
                ].map((problem, i) => (
                  <DepthCard key={i} className="border-destructive/20 bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <div className="text-destructive mt-1">✗</div>
                      <Copy size="md" className="flex-1">{problem}</Copy>
                    </div>
                  </DepthCard>
                ))}
              </div>

              {/* Solutions */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-brand-cyan mb-6">✓ Mit PILAR</h3>
                {[
                  { title: 'AI Phone', desc: 'Nimmt jeden Anruf an, 24/7' },
                  { title: 'AI WhatsApp', desc: 'Antwortet sofort auf jede Nachricht' },
                  { title: 'AI Email', desc: 'Bearbeitet Anfragen automatisch' },
                  { title: 'Lead Engine', desc: 'Klassifiziert & priorisiert jeden Lead' },
                  { title: 'Follow-Up Automation', desc: 'Kein Lead wird vergessen' }
                ].map((solution, i) => (
                  <DepthCard key={i} className="border-brand-cyan/20 bg-brand-cyan/5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{solution.title}</p>
                        <Copy size="sm" muted>{solution.desc}</Copy>
                      </div>
                    </div>
                  </DepthCard>
                ))}
              </div>
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" background="gradient">
        <Container>
          <ScrollSection stagger>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                {marketing.home.features.title}
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                {marketing.home.features.subtitle}
              </Copy>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <DepthCard key={i}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-brand-cyan/10">
                        <Icon className="h-6 w-6 text-brand-cyan" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <Copy size="sm" muted>{feature.description}</Copy>
                      </div>
                    </div>
                  </DepthCard>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <Link href="/features">
                <MicroButton variant="secondary" size="lg">
                  Alle Features ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MicroButton>
              </Link>
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Pricing Preview */}
      <Section id="pricing">
        <Container>
          <ScrollSection>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                {marketing.pricing.hero.title}
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                {marketing.pricing.hero.subtitle}
              </Copy>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <DepthCard>
                <h3 className="text-2xl font-bold mb-2">{marketing.pricing.plans.basic.name}</h3>
                <Copy muted className="mb-6">{marketing.pricing.plans.basic.description}</Copy>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{marketing.pricing.plans.basic.price}</span>
                  <span className="text-muted-foreground">/Monat</span>
                  <Copy size="sm" muted className="mt-2">{marketing.pricing.plans.basic.setup}</Copy>
                </div>
                <ul className="space-y-3 mb-8">
                  {marketing.pricing.plans.basic.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0" />
                      <Copy size="md">{feature}</Copy>
                    </li>
                  ))}
                </ul>
              </DepthCard>

              {/* Pro Plan */}
              <DepthCard className="border-brand-cyan/50 bg-brand-cyan/5 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-sm font-semibold text-white">
                  Empfohlen
                </div>
                <h3 className="text-2xl font-bold mb-2">{marketing.pricing.plans.pro.name}</h3>
                <Copy muted className="mb-6">{marketing.pricing.plans.pro.description}</Copy>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{marketing.pricing.plans.pro.price}</span>
                  <span className="text-muted-foreground">/Monat</span>
                  <Copy size="sm" muted className="mt-2">{marketing.pricing.plans.pro.setup}</Copy>
                </div>
                <ul className="space-y-3 mb-8">
                  {marketing.pricing.plans.pro.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0" />
                      <Copy size="md">{feature}</Copy>
                    </li>
                  ))}
                </ul>
              </DepthCard>
            </div>

            <div className="mt-12 text-center">
              <Link href="/pricing">
                <MicroButton variant="primary" size="lg">
                  Alle Preise ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MicroButton>
              </Link>
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" background="muted">
        <Container size="lg">
          <ScrollSection stagger>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                Häufige Fragen
              </Heading>
              <Copy size="lg" muted>
                Alles, was du über PILAR wissen musst
              </Copy>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {marketing.pricing.faq.items.map((faq, i) => (
                <DepthCard key={i}>
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <Copy size="md" muted>{faq.answer}</Copy>
                </DepthCard>
              ))}
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section>
        <Container>
          <ScrollSection>
            <DepthCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10 relative overflow-hidden">
              <AnimatedGradient type="conic" className="absolute inset-0 opacity-20" />
              <div className="relative z-10">
                <Heading size="xl" className="mb-4">
                  Bereit für dein automatisches Studio?
                </Heading>
                <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                  Starte jetzt und automatisiere dein Fitnessstudio in wenigen Minuten
                </Copy>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <MicroButton variant="primary" size="lg">
                      {marketing.cta.primary}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </MicroButton>
                  </Link>
                  <Link href="/contact">
                    <MicroButton variant="secondary" size="lg">
                      {marketing.cta.demo}
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
