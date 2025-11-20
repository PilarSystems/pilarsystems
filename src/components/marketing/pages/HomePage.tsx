'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Container, 
  Section, 
  Heading, 
  Copy, 
  GlassCard, 
  MotionInView,
  SystemGraph,
  FeatureGrid 
} from '@/components/marketing/core'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Users, 
  Calendar, 
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle2,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react'
import { motion } from 'framer-motion'

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

const features = [
  {
    icon: Phone,
    title: 'AI Phone Rezeption',
    description: 'Nimmt jeden Anruf entgegen, beantwortet Fragen, bucht Probetrainings und leitet wichtige Anrufe weiter. 24/7 verfügbar.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp AI',
    description: 'Chattet mit Leads und Mitgliedern, beantwortet FAQs und führt Follow-Up Sequenzen durch. Automatisch und persönlich.',
  },
  {
    icon: Mail,
    title: 'Email Automation',
    description: 'Verarbeitet eingehende E-Mails, antwortet automatisch und kategorisiert Anfragen nach Priorität.',
  },
  {
    icon: Users,
    title: 'Lead Engine',
    description: 'Klassifiziert jeden Lead (A/B/C), priorisiert automatisch und zeigt dir die heißesten Leads zuerst.',
  },
  {
    icon: Calendar,
    title: 'Calendar Sync',
    description: 'Synchronisiert mit Google Calendar, bucht Probetrainings automatisch und sendet Erinnerungen.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Echtzeit-Dashboard mit KPIs, Lead-Conversion und Performance-Metriken für datenbasierte Entscheidungen.',
  },
]

const stats = [
  { value: '24/7', label: 'Verfügbarkeit', icon: Clock },
  { value: '< 2 Min', label: 'Antwortzeit', icon: Zap },
  { value: '+40%', label: 'Mehr Leads', icon: TrendingUp },
  { value: '100%', label: 'DSGVO-konform', icon: Shield },
]

const faqs = [
  {
    question: 'Wie lange dauert das Setup?',
    answer: 'Das komplette Setup dauert ca. 15-20 Minuten. Du wirst durch einen geführten Onboarding-Prozess geleitet und kannst sofort loslegen.',
  },
  {
    question: 'Brauche ich technische Kenntnisse?',
    answer: 'Nein, überhaupt nicht. PILAR ist so designed, dass jeder Studio-Betreiber es ohne technische Vorkenntnisse nutzen kann.',
  },
  {
    question: 'Kann ich PILAR testen?',
    answer: 'Ja! Buche einfach eine Demo und wir zeigen dir live, wie PILAR für dein Studio funktioniert.',
  },
  {
    question: 'Was passiert mit meinen Daten?',
    answer: 'Alle Daten werden DSGVO-konform in Deutschland gespeichert. Du behältst die volle Kontrolle über deine Daten.',
  },
  {
    question: 'Kann ich PILAR mit meinen bestehenden Tools verbinden?',
    answer: 'Ja, PILAR integriert sich mit Google Calendar, Stripe, und vielen anderen Tools. Weitere Integrationen folgen laufend.',
  },
  {
    question: 'Wie funktioniert die AI?',
    answer: 'PILAR nutzt modernste AI-Modelle (GPT-4, Claude), die speziell für Fitnessstudios trainiert wurden. Die AI lernt kontinuierlich dazu.',
  },
]

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section noPadding className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-background to-brand-cyan-dark/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(79,209,197,0.05),transparent_50%)]" />
        
        <Container className="relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8"
            >
              <Zap className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Vollautomatisches AI Studio</span>
            </motion.div>

            {/* Heading */}
            <Heading as="h1" size="3xl" className="mb-6">
              Dein Fitnessstudio,
              <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent">
                vollautomatisch
              </span>
            </Heading>

            {/* Subheading */}
            <Copy size="xl" className="max-w-3xl mx-auto mb-10" muted>
              24/7 AI Rezeption, WhatsApp & Phone Automation, Lead-Engine und Follow-Up System. 
              Alles in einer Plattform – speziell für Fitnessstudios.
            </Copy>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Features ansehen
                </Button>
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
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-brand-cyan mr-2" />
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* System Graph Section */}
      <Section background="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Ein System. Alle Kanäle.
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              PILAR verbindet alle deine Kommunikationskanäle und automatisiert den kompletten Lead-Prozess
            </Copy>
          </div>

          <MotionInView>
            <SystemGraph nodes={systemNodes} connections={systemConnections} />
          </MotionInView>
        </Container>
      </Section>

      {/* Problem → Solution Section */}
      <Section>
        <Container>
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
            <MotionInView>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-destructive mb-6">❌ Ohne PILAR</h3>
                {[
                  'Telefon klingelt durch – Leads gehen verloren',
                  'WhatsApp & Instagram voll – keine Zeit zu antworten',
                  'Leads antworten nicht auf Follow-Ups',
                  'Kein Überblick über Termine & Probetrainings',
                  'Trainer verbringen Stunden am Telefon'
                ].map((problem, i) => (
                  <GlassCard key={i} className="border-destructive/20 bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <div className="text-destructive mt-1">✗</div>
                      <Copy size="md" className="flex-1">{problem}</Copy>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </MotionInView>

            {/* Solutions */}
            <MotionInView delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-brand-cyan mb-6">✓ Mit PILAR</h3>
                {[
                  { title: 'AI Phone', desc: 'Nimmt jeden Anruf an, 24/7' },
                  { title: 'AI WhatsApp', desc: 'Antwortet sofort auf jede Nachricht' },
                  { title: 'AI Email', desc: 'Bearbeitet Anfragen automatisch' },
                  { title: 'Lead Engine', desc: 'Klassifiziert & priorisiert jeden Lead' },
                  { title: 'Follow-Up Automation', desc: 'Kein Lead wird vergessen' }
                ].map((solution, i) => (
                  <GlassCard key={i} className="border-brand-cyan/20 bg-brand-cyan/5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{solution.title}</p>
                        <Copy size="sm" muted>{solution.desc}</Copy>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </MotionInView>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section background="gradient">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Alles, was dein Studio braucht
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Eine Plattform. Alle Kanäle. Vollautomatisch.
            </Copy>
          </div>

          <FeatureGrid features={features} columns={3} />

          <MotionInView className="mt-12 text-center">
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-brand-cyan/50 text-brand-cyan hover:bg-brand-cyan/10">
                Alle Features ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </MotionInView>
        </Container>
      </Section>

      {/* Pricing Preview */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Transparente Preise
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Keine versteckten Kosten. Keine Überraschungen.
            </Copy>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <GlassCard>
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <Copy muted className="mb-6">Für kleinere Studios</Copy>
              <div className="mb-6">
                <span className="text-5xl font-bold">100€</span>
                <span className="text-muted-foreground">/Monat</span>
                <Copy size="sm" muted className="mt-2">+ 500€ Setup (einmalig)</Copy>
              </div>
              <ul className="space-y-3 mb-8">
                {['AI Phone', 'AI Email', 'Lead Engine', 'Calendar Sync', 'Basic Analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0" />
                    <Copy size="md">{feature}</Copy>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Pro Plan */}
            <GlassCard className="border-brand-cyan/50 bg-brand-cyan/5 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-sm font-semibold text-white">
                Empfohlen
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <Copy muted className="mb-6">Für wachsende Studios</Copy>
              <div className="mb-6">
                <span className="text-5xl font-bold">149€</span>
                <span className="text-muted-foreground">/Monat</span>
                <Copy size="sm" muted className="mt-2">+ 1.000€ Setup (einmalig)</Copy>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Alles aus Basic',
                  'AI WhatsApp',
                  'Advanced Analytics',
                  'Multi-Location Support',
                  'Priority Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0" />
                    <Copy size="md">{feature}</Copy>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <MotionInView className="mt-12 text-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                Alle Preise ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </MotionInView>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section background="muted">
        <Container size="lg">
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Häufige Fragen
            </Heading>
            <Copy size="lg" muted>
              Alles, was du über PILAR wissen musst
            </Copy>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <MotionInView key={i} delay={i * 0.05}>
                <GlassCard>
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <Copy size="md" muted>{faq.answer}</Copy>
                </GlassCard>
              </MotionInView>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section>
        <Container>
          <MotionInView>
            <GlassCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10">
              <Heading size="xl" className="mb-4">
                Bereit für dein automatisches Studio?
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Starte jetzt und automatisiere dein Fitnessstudio in wenigen Minuten
              </Copy>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Demo buchen
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </MotionInView>
        </Container>
      </Section>
    </div>
  )
}
