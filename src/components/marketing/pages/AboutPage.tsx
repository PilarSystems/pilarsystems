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
  Target, 
  Heart, 
  Zap,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import { marketing } from '@/content/marketing.de'

const timeline = [
  {
    year: '2023',
    title: 'Die Idee',
    description: 'Wir erkannten, dass Fitnessstudios täglich Dutzende Anrufe verpassen und Leads verlieren. Die Idee für PILAR war geboren.'
  },
  {
    year: '2024 Q1',
    title: 'Erste Prototypen',
    description: 'Entwicklung der ersten AI Phone Rezeption. Tests mit 5 Pilot-Studios in München und Berlin.'
  },
  {
    year: '2024 Q2',
    title: 'WhatsApp AI Launch',
    description: 'Integration von WhatsApp Business API. Erste Studios erreichen +40% mehr Leads.'
  },
  {
    year: '2024 Q3',
    title: 'Multi-Tenant Platform',
    description: 'Vollständige Isolation pro Studio. Twilio Subaccounts, separate Credentials, DSGVO-konform.'
  },
  {
    year: '2024 Q4',
    title: 'Scale-Up',
    description: '100+ Studios nutzen PILAR. Expansion nach Österreich und Schweiz.'
  },
  {
    year: '2025',
    title: 'Die Zukunft',
    description: 'Vision: 1000+ Studios in DACH. Neue Features: Video-Calls, AI Personal Training, Nutrition AI.'
  }
]

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'Wir wollen Fitnessstudios helfen, mehr Zeit für ihre Mitglieder zu haben statt am Telefon zu sitzen.'
  },
  {
    icon: Shield,
    title: 'DSGVO First',
    description: 'Datenschutz ist kein Afterthought. Alle Daten werden in Deutschland gehostet und sind vollständig DSGVO-konform.'
  },
  {
    icon: Users,
    title: 'Customer Obsessed',
    description: 'Jedes Feature wird mit echten Studios entwickelt und getestet. Kein Feature ohne echten Mehrwert.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Wir nutzen die neueste AI-Technologie (GPT-4, ElevenLabs) um die beste Erfahrung zu bieten.'
  }
]

const team = [
  {
    role: 'Founder & CEO',
    description: 'Ex-Google Engineer mit 10+ Jahren Erfahrung in AI & Machine Learning. Passion für Fitness.'
  },
  {
    role: 'CTO',
    description: 'Ex-Amazon Tech Lead. Experte für skalierbare Cloud-Infrastruktur und Multi-Tenant Systeme.'
  },
  {
    role: 'Head of Product',
    description: 'Ex-Fitnessstudio-Besitzer. Versteht die Pain Points aus erster Hand.'
  },
  {
    role: 'Head of AI',
    description: 'PhD in Natural Language Processing. Entwickelt die AI-Modelle hinter PILAR.'
  }
]

const stats = [
  { value: '500+', label: 'Studios' },
  { value: '50k+', label: 'Leads/Monat' },
  { value: '98%', label: 'Zufriedenheit' },
  { value: '24/7', label: 'Verfügbar' },
  { value: '+40%', label: 'Mehr Conversions' },
  { value: '100%', label: 'DSGVO' }
]

export function AboutPage() {
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
              <Heart className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Über PILAR</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              {marketing.about.hero.title}
            </Heading>

            <Copy size="xl" className="max-w-3xl mx-auto mb-10" muted>
              {marketing.about.hero.subtitle}
            </Copy>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <Copy size="sm" muted>{stat.label}</Copy>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section id="mission">
        <Container>
          <ScrollSection stagger>
            <div className="grid md:grid-cols-2 gap-12">
              <DepthCard className="h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10">
                    <Target className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <Heading size="lg">Unsere Mission</Heading>
                </div>
                <Copy size="lg" className="mb-4">
                  Fitnessstudios dabei helfen, mehr Leads zu konvertieren und mehr Zeit für ihre 
                  Mitglieder zu haben.
                </Copy>
                <Copy muted>
                  Wir glauben, dass Fitnessstudio-Besitzer ihre Zeit mit Training und Community-Building 
                  verbringen sollten – nicht mit Telefonaten und Verwaltung. PILAR automatisiert die 
                  repetitiven Aufgaben, damit du dich auf das konzentrieren kannst, was wirklich zählt.
                </Copy>
              </DepthCard>

              <DepthCard className="h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10">
                    <Globe className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <Heading size="lg">Unsere Vision</Heading>
                </div>
                <Copy size="lg" className="mb-4">
                  Die führende AI-Plattform für Fitnessstudios in Europa werden.
                </Copy>
                <Copy muted>
                  Bis 2026 wollen wir 1000+ Studios in DACH dabei helfen, ihre Prozesse zu automatisieren. 
                  Wir entwickeln kontinuierlich neue Features: Video-Calls, AI Personal Training, 
                  Nutrition AI – alles mit dem Ziel, Studios erfolgreicher zu machen.
                </Copy>
              </DepthCard>
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Values */}
      <Section id="values" background="muted">
        <Container>
          <ScrollSection stagger>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                Unsere Werte
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                Was uns antreibt und wie wir arbeiten
              </Copy>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon
                return (
                  <DepthCard key={i}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-cyan/10">
                        <Icon className="w-5 h-5 text-brand-cyan" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                    </div>
                    <Copy muted>{value.description}</Copy>
                  </DepthCard>
                )
              })}
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Timeline */}
      <Section id="timeline">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Unsere Journey
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Von der Idee zur führenden AI-Plattform
            </Copy>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-cyan via-brand-cyan-dark to-transparent hidden md:block" />

            <ScrollSection stagger>
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <DepthCard>
                        <div className="text-2xl font-bold text-brand-cyan mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <Copy muted>{item.description}</Copy>
                      </DepthCard>
                    </div>

                    {/* Dot */}
                    <div className="hidden md:block w-4 h-4 rounded-full bg-brand-cyan border-4 border-background relative z-10" />

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </ScrollSection>
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section id="team" background="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Unser Team
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Experten aus Tech, AI und Fitness
            </Copy>
          </div>

          <ScrollSection stagger>
            <div className="grid md:grid-cols-2 gap-6">
              {team.map((member, i) => (
                <DepthCard key={i}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dark flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      {member.role.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{member.role}</h3>
                      <Copy size="sm" muted>{member.description}</Copy>
                    </div>
                  </div>
                </DepthCard>
              ))}
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section id="why-choose-us">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Warum PILAR?
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Was uns von anderen unterscheidet
            </Copy>
          </div>

          <ScrollSection stagger>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: '100% DSGVO',
                  description: 'Alle Daten in Deutschland. Vollständig DSGVO-konform. Keine Kompromisse.'
                },
                {
                  icon: Zap,
                  title: 'Neueste KI',
                  description: 'GPT-4, ElevenLabs, Twilio. Wir nutzen die beste verfügbare Technologie.'
                },
                {
                  icon: Users,
                  title: 'Made for Studios',
                  description: 'Von Studio-Besitzern für Studio-Besitzer. Wir verstehen deine Challenges.'
                },
                {
                  icon: TrendingUp,
                  title: 'Proven Results',
                  description: '500+ Studios vertrauen uns. +40% mehr Leads im Durchschnitt.'
                },
                {
                  icon: Heart,
                  title: 'Support',
                  description: 'Deutscher Support. Schnelle Antworten. Wir sind für dich da.'
                },
                {
                  icon: Globe,
                  title: 'Skalierbar',
                  description: 'Von 1 Studio bis 100+ Standorte. PILAR wächst mit dir.'
                }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <DepthCard key={i} className="text-center h-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10 mx-auto mb-4">
                      <Icon className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <Copy size="sm" muted>{item.description}</Copy>
                  </DepthCard>
                )
              })}
            </div>
          </ScrollSection>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section id="cta">
        <Container>
          <ScrollSection>
            <DepthCard className="text-center py-16 border-brand-cyan/30 relative overflow-hidden">
              <AnimatedGradient type="conic" className="absolute inset-0 opacity-20" />
              
              <div className="relative z-10">
                <Heading size="xl" className="mb-4">
                  Bereit, Teil der PILAR Familie zu werden?
                </Heading>
                <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                  Schließe dich 500+ Studios an, die bereits mit PILAR automatisieren
                </Copy>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <MicroButton variant="primary" size="lg">
                      Jetzt starten
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </MicroButton>
                  </Link>
                  <Link href="/contact">
                    <MicroButton variant="secondary" size="lg">
                      Kontakt aufnehmen
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
