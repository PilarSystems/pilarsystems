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
  DeviceFrame
} from '@/components/marketing/core'
import { 
  MessageSquare, 
  ArrowRight,
  Zap,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Bot,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'

const useCases = [
  {
    title: 'Lead-Qualifizierung',
    description: 'Der Coach chattet mit neuen Interessenten, stellt Fragen zu Zielen und Budget, und klassifiziert sie automatisch als A/B/C Leads.',
    icon: Users
  },
  {
    title: 'Probetraining-Buchung',
    description: 'Leads können direkt im Chat einen Termin für ein Probetraining buchen. Der Coach prüft Verfügbarkeit und bestätigt sofort.',
    icon: Clock
  },
  {
    title: 'FAQ Beantwortung',
    description: 'Häufige Fragen zu Öffnungszeiten, Preisen, Kursen und Ausstattung werden sofort beantwortet – 24/7.',
    icon: MessageSquare
  },
  {
    title: 'Follow-Up Sequenzen',
    description: 'Der Coach sendet automatische Follow-Ups an Leads, die noch nicht konvertiert haben. Personalisiert und zur richtigen Zeit.',
    icon: TrendingUp
  },
  {
    title: 'Mitglieder-Support',
    description: 'Bestehende Mitglieder können Fragen stellen, Kurse buchen oder Feedback geben – alles über WhatsApp.',
    icon: Heart
  },
  {
    title: 'Event-Ankündigungen',
    description: 'Informiere deine Community über neue Kurse, Events oder Angebote direkt über WhatsApp.',
    icon: Sparkles
  }
]

const chatExamples = [
  {
    from: 'lead',
    message: 'Hey, ich interessiere mich für eine Mitgliedschaft. Was kostet das?',
    time: '14:23'
  },
  {
    from: 'coach',
    message: 'Hi! 👋 Schön, dass du dich für unser Studio interessierst! Wir haben verschiedene Mitgliedschaften:\n\n💪 Basic: 49€/Monat\n🔥 Premium: 79€/Monat\n⭐ VIP: 129€/Monat\n\nMöchtest du mehr über die Unterschiede erfahren?',
    time: '14:23'
  },
  {
    from: 'lead',
    message: 'Ja, was ist bei Premium dabei?',
    time: '14:24'
  },
  {
    from: 'coach',
    message: 'Premium beinhaltet:\n\n✅ Unbegrenzter Zugang (24/7)\n✅ Alle Gruppenkurse\n✅ Sauna & Wellness\n✅ Ernährungsberatung\n✅ Personal Training (1x/Monat)\n\nMöchtest du ein kostenloses Probetraining vereinbaren? 🎯',
    time: '14:24'
  },
  {
    from: 'lead',
    message: 'Ja gerne! Wann habt ihr Zeit?',
    time: '14:25'
  },
  {
    from: 'coach',
    message: 'Super! 🎉 Ich habe folgende Slots frei:\n\n📅 Morgen, 18:00 Uhr\n📅 Freitag, 17:00 Uhr\n📅 Samstag, 10:00 Uhr\n\nWelcher passt dir am besten?',
    time: '14:25'
  }
]

const benefits = [
  'Sofortige Antworten auf WhatsApp (< 2 Sekunden)',
  'Personalisierte Gespräche basierend auf Lead-Historie',
  'Automatische Terminbuchung mit Calendar-Sync',
  'Follow-Up Sequenzen für nicht-konvertierte Leads',
  'Mehrsprachig (Deutsch, Englisch, Türkisch)',
  'DSGVO-konform mit Opt-In/Opt-Out',
  'Integration mit deinem CRM',
  'Analytics & Performance-Tracking'
]

export function CoachPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section noPadding className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-background to-brand-cyan-dark/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.1),transparent_50%)]" />
        
        <Container className="relative z-10 py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8"
              >
                <Bot className="h-4 w-4 text-brand-cyan" />
                <span className="text-sm font-medium text-brand-cyan">WhatsApp AI Coach</span>
              </motion.div>

              <Heading as="h1" size="3xl" className="mb-6">
                Dein AI Coach auf
                <br />
                <span className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent">
                  WhatsApp
                </span>
              </Heading>

              <Copy size="xl" className="mb-8" muted>
                Chatte mit deinen Leads und Mitgliedern über WhatsApp. Vollautomatisch. 
                Persönlich. 24/7 verfügbar.
              </Copy>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline">
                    Alle Features
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Clock, value: '< 2s', label: 'Antwortzeit' },
                  { icon: Users, value: '24/7', label: 'Verfügbar' },
                  { icon: TrendingUp, value: '+60%', label: 'Conversion' }
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-brand-cyan" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </div>
                      <Copy size="sm" muted>{stat.label}</Copy>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <DeviceFrame type="phone">
                <div className="w-full h-full bg-background p-4 overflow-y-auto">
                  {/* WhatsApp Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">PILAR Coach</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-3">
                    {chatExamples.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.3 + 0.5 }}
                        className={`flex ${msg.from === 'lead' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                            msg.from === 'lead'
                              ? 'bg-muted text-foreground'
                              : 'bg-brand-cyan text-white'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                          <div className={`text-[10px] mt-1 ${msg.from === 'lead' ? 'text-muted-foreground' : 'text-white/70'}`}>
                            {msg.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </DeviceFrame>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Use Cases */}
      <Section background="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Was kann der WhatsApp Coach?
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Von Lead-Qualifizierung bis Mitglieder-Support – alles über WhatsApp
            </Copy>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => {
              const Icon = useCase.icon
              return (
                <MotionInView key={i} delay={i * 0.05}>
                  <GlassCard>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-cyan/10">
                        <Icon className="w-5 h-5 text-brand-cyan" />
                      </div>
                      <h3 className="text-lg font-semibold">{useCase.title}</h3>
                    </div>
                    <Copy size="md" muted>{useCase.description}</Copy>
                  </GlassCard>
                </MotionInView>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <MotionInView>
              <Heading size="xl" className="mb-6">
                Warum WhatsApp?
              </Heading>
              <Copy size="lg" muted className="mb-8">
                WhatsApp ist der meistgenutzte Messenger in Deutschland. Deine Leads und Mitglieder 
                sind bereits dort – warum nicht auch dein Coach?
              </Copy>

              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                    <Copy size="md">{benefit}</Copy>
                  </div>
                ))}
              </div>
            </MotionInView>

            <MotionInView delay={0.2}>
              <GlassCard className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-bold text-brand-cyan mb-2">2 Mrd+</div>
                    <Copy muted>WhatsApp Nutzer weltweit</Copy>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-brand-cyan mb-2">98%</div>
                    <Copy muted>Öffnungsrate bei WhatsApp</Copy>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-brand-cyan mb-2">&lt; 2 Min</div>
                    <Copy muted>Durchschnittliche Antwortzeit</Copy>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-brand-cyan mb-2">+60%</div>
                    <Copy muted>Höhere Conversion vs. Email</Copy>
                  </div>
                </div>
              </GlassCard>
            </MotionInView>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section background="gradient">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              So funktioniert's
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              In 3 einfachen Schritten zum WhatsApp Coach
            </Copy>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'WhatsApp Business verbinden',
                description: 'Verbinde deinen WhatsApp Business Account mit PILAR. Dauert 5 Minuten.'
              },
              {
                step: '2',
                title: 'AI trainieren',
                description: 'Gib der AI Infos zu deinem Studio: Preise, Kurse, Öffnungszeiten, FAQs.'
              },
              {
                step: '3',
                title: 'Live gehen',
                description: 'Aktiviere den Coach und er startet sofort mit dem Chatten. 24/7.'
              }
            ].map((item, i) => (
              <MotionInView key={i} delay={i * 0.1}>
                <GlassCard className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dark flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <Copy muted>{item.description}</Copy>
                </GlassCard>
              </MotionInView>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <MotionInView>
            <GlassCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10">
              <Heading size="xl" className="mb-4">
                Bereit für deinen WhatsApp Coach?
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Starte jetzt und chatte automatisch mit deinen Leads über WhatsApp
              </Copy>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    Preise ansehen
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
