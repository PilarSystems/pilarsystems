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
  Phone, 
  MessageSquare, 
  Mail, 
  Users, 
  Calendar, 
  BarChart3,
  ArrowRight,
  Zap,
  Bot,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { marketing } from '@/content/marketing.de'

const features = [
  {
    icon: Phone,
    title: 'AI Phone Rezeption',
    tagline: '24/7 Anrufannahme ohne Wartezeit',
    description: 'Deine AI-Rezeption nimmt jeden Anruf entgegen, beantwortet Fragen zu Öffnungszeiten, Preisen und Angeboten, bucht Probetrainings und leitet wichtige Anrufe an dich weiter.',
    benefits: [
      'Keine verpassten Anrufe mehr',
      'Sofortige Antworten auf häufige Fragen',
      'Automatische Terminbuchung',
      'Intelligente Weiterleitung bei Bedarf',
      'Mehrsprachig (Deutsch, Englisch, Türkisch)'
    ],
    codeExample: `// AI Phone Call Flow
const handleIncomingCall = async (call) => {
  const intent = await ai.detectIntent(call.speech)
  
  if (intent === 'book_trial') {
    const slot = await calendar.findNextSlot()
    await call.say(\`Ich habe \${slot} frei\`)
    await calendar.book(slot, call.from)
  } else if (intent === 'pricing') {
    await call.say(pricing.info)
  }
}`
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp AI',
    tagline: 'Automatische Chats mit deinen Leads',
    description: 'Die AI chattet mit Interessenten und Mitgliedern über WhatsApp, beantwortet Fragen, sendet Follow-Ups und führt Leads durch den Verkaufsprozess.',
    benefits: [
      'Sofortige Antworten auf WhatsApp',
      'Automatische Follow-Up Sequenzen',
      'Personalisierte Nachrichten',
      'Lead-Qualifizierung im Chat',
      'Integration mit deinem CRM'
    ],
    codeExample: `// WhatsApp AI Flow
const handleWhatsAppMessage = async (msg) => {
  const lead = await db.findOrCreateLead(msg.from)
  const response = await ai.generateResponse({
    message: msg.body,
    context: lead.history,
    studioInfo: studio.data
  })
  
  await whatsapp.send(msg.from, response)
  await lead.updateHistory(msg.body, response)
}`
  },
  {
    icon: Mail,
    title: 'Email Automation',
    tagline: 'Intelligente Email-Verarbeitung',
    description: 'Eingehende Emails werden automatisch kategorisiert, beantwortet und an die richtige Person weitergeleitet. Kein manuelles Sortieren mehr.',
    benefits: [
      'Automatische Kategorisierung',
      'Sofortige Antworten auf Standard-Anfragen',
      'Intelligente Weiterleitung',
      'Follow-Up Erinnerungen',
      'Email-Vorlagen für häufige Fälle'
    ],
    codeExample: `// Email AI Classification
const processEmail = async (email) => {
  const category = await ai.classify(email.body)
  
  if (category === 'trial_request') {
    await sendTrialInfo(email.from)
    await createLead(email.from, 'A')
  } else if (category === 'complaint') {
    await notifyManager(email)
  }
}`
  },
  {
    icon: Users,
    title: 'Lead Engine',
    tagline: 'Automatische Lead-Klassifikation',
    description: 'Jeder Lead wird automatisch als A, B oder C klassifiziert basierend auf Interesse, Budget und Kaufbereitschaft. Fokussiere dich auf die heißesten Leads.',
    benefits: [
      'A/B/C Klassifikation',
      'Lead-Scoring basierend auf Verhalten',
      'Automatische Priorisierung',
      'Follow-Up Empfehlungen',
      'Conversion-Tracking'
    ],
    codeExample: `// Lead Scoring Algorithm
const scoreLead = (lead) => {
  let score = 0
  
  if (lead.responseTime < 5min) score += 30
  if (lead.askedAboutPricing) score += 25
  if (lead.visitedWebsite > 3) score += 20
  if (lead.openedEmails > 2) score += 15
  
  return score > 70 ? 'A' : score > 40 ? 'B' : 'C'
}`
  },
  {
    icon: Calendar,
    title: 'Calendar Sync',
    tagline: 'Automatische Terminverwaltung',
    description: 'Synchronisiert mit Google Calendar, bucht Probetrainings automatisch, sendet Erinnerungen und verhindert Doppelbuchungen.',
    benefits: [
      'Google Calendar Integration',
      'Automatische Terminbuchung',
      'SMS & Email Erinnerungen',
      'No-Show Tracking',
      'Wartelisten-Management'
    ],
    codeExample: `// Calendar Integration
const bookTrial = async (lead, slot) => {
  const event = await calendar.create({
    summary: \`Probetraining: \${lead.name}\`,
    start: slot.start,
    end: slot.end,
    attendees: [lead.email]
  })
  
  await sendConfirmation(lead, event)
  await scheduleReminder(lead, event, '24h')
}`
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    tagline: 'Datenbasierte Entscheidungen',
    description: 'Echtzeit-Dashboard mit allen wichtigen KPIs: Lead-Conversion, Anrufvolumen, Response-Zeiten, Umsatz-Tracking und mehr.',
    benefits: [
      'Echtzeit-Dashboard',
      'Lead-Conversion Tracking',
      'Channel-Performance',
      'AI-Performance Metriken',
      'Custom Reports'
    ],
    codeExample: `// Analytics Dashboard
const getDashboardData = async (studioId) => {
  return {
    leads: await getLeadStats(studioId),
    calls: await getCallStats(studioId),
    conversion: await getConversionRate(studioId),
    revenue: await getRevenueStats(studioId),
    aiPerformance: await getAIMetrics(studioId)
  }
}`
  }
]

export function FeaturesPage() {
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
              <Bot className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Vollautomatische KI Features</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              {marketing.features.hero.title}
            </Heading>

            <Copy size="xl" className="max-w-3xl mx-auto mb-10" muted>
              {marketing.features.hero.subtitle}
            </Copy>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Clock, value: '24/7', label: 'Verfügbar' },
                { icon: Zap, value: '< 2 Min', label: 'Antwortzeit' },
                { icon: TrendingUp, value: '+40%', label: 'Mehr Leads' },
                { icon: Shield, value: '100%', label: 'DSGVO' }
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-brand-cyan mr-2" />
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                    <Copy size="sm" muted>{stat.label}</Copy>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Feature Deep Dives */}
      {features.map((feature, index) => {
        const Icon = feature.icon
        const isEven = index % 2 === 0

        return (
          <Section 
            key={index} 
            id={`feature-${index}`}
            background={isEven ? 'default' : 'muted'}
          >
            <Container>
              <ScrollSection stagger>
                <div className={`grid md:grid-cols-2 gap-12 items-center ${!isEven && 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={!isEven ? 'md:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10">
                        <Icon className="w-6 h-6 text-brand-cyan" />
                      </div>
                      <Heading size="lg">{feature.title}</Heading>
                    </div>

                    <Copy size="xl" className="mb-4 font-semibold text-brand-cyan">
                      {feature.tagline}
                    </Copy>

                    <Copy size="lg" muted className="mb-8">
                      {feature.description}
                    </Copy>

                    <div className="space-y-3 mb-8">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                          <Copy size="md">{benefit}</Copy>
                        </div>
                      ))}
                    </div>

                    <Link href="/signup">
                      <MicroButton variant="primary">
                        Feature testen
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </MicroButton>
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className={!isEven ? 'md:order-1' : ''}>
                    <DepthCard className="p-8">
                      <div className="w-full h-64 bg-gradient-to-br from-brand-cyan/20 to-brand-cyan-dark/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-24 h-24 text-brand-cyan opacity-50" />
                      </div>
                    </DepthCard>
                  </div>
                </div>
              </ScrollSection>
            </Container>
          </Section>
        )
      })}

      {/* Integration Section */}
      <Section id="integrations" background="muted">
        <Container>
          <ScrollSection stagger>
            <div className="text-center mb-16">
              <Heading size="xl" className="mb-4">
                Nahtlose Integrationen
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto">
                PILAR integriert sich mit deinen bestehenden Tools
              </Copy>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Google Calendar', desc: 'Automatische Terminverwaltung' },
                { name: 'Stripe', desc: 'Zahlungsabwicklung & Abos' },
                { name: 'Twilio', desc: 'Phone & WhatsApp Backend' },
                { name: 'OpenAI', desc: 'GPT-4 KI Engine' },
                { name: 'SendGrid', desc: 'Email Versand' },
                { name: 'Zapier', desc: 'Custom Workflows' }
              ].map((integration, i) => (
                <DepthCard key={i}>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-5 w-5 text-brand-cyan" />
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                  </div>
                  <Copy size="sm" muted>{integration.desc}</Copy>
                </DepthCard>
              ))}
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
                  Bereit, alle Features zu nutzen?
                </Heading>
                <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                  Starte jetzt und automatisiere dein Fitnessstudio in wenigen Minuten
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
                      Preise ansehen
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
