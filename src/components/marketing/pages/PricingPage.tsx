'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Container, 
  Section, 
  Heading, 
  Copy, 
  GlassCard, 
  MotionInView 
} from '@/components/marketing/core'
import { CheckCircle2, ArrowRight, Zap, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const plans = {
  basic: {
    name: 'Basic',
    tagline: 'Perfekt für kleinere Studios',
    monthly: 100,
    setup: 500,
    features: [
      'AI Phone Rezeption (24/7)',
      'AI Email Automation',
      'Lead Engine (A/B/C Klassifikation)',
      'Calendar Sync (Google Calendar)',
      'Basic Analytics Dashboard',
      'Follow-Up Automation',
      'Email Support',
      '1 Standort'
    ]
  },
  pro: {
    name: 'Pro',
    tagline: 'Für wachsende Studios & Ketten',
    monthly: 149,
    setup: 1000,
    recommended: true,
    features: [
      'Alles aus Basic',
      'AI WhatsApp Business',
      'Advanced Analytics & Reports',
      'Multi-Location Support (bis zu 5 Standorte)',
      'Custom AI Rules & Workflows',
      'Priority Support',
      'Dedicated Account Manager',
      'White-Label Option (auf Anfrage)'
    ]
  }
}

const setupIncludes = [
  {
    title: 'Twilio Subaccount',
    desc: 'Automatische Erstellung deines eigenen Twilio-Subaccounts mit isolierten Credentials'
  },
  {
    title: 'Telefonnummer',
    desc: 'Kauf einer deutschen Telefonnummer in deiner Region (oder Verbindung deiner eigenen)'
  },
  {
    title: 'WhatsApp Business',
    desc: 'Verbindung deines WhatsApp Business Accounts mit der AI'
  },
  {
    title: 'Email Integration',
    desc: 'Anbindung deiner Studio-Email für automatische Verarbeitung'
  },
  {
    title: 'Calendar Sync',
    desc: 'Google Calendar Integration für Probetrainings & Termine'
  },
  {
    title: 'AI Training',
    desc: 'Anpassung der AI auf deine Studio-Angebote, Preise und FAQs'
  },
  {
    title: 'Webhook Setup',
    desc: 'Automatische Konfiguration aller Webhooks für Phone, WhatsApp, Email'
  },
  {
    title: 'Testing & QA',
    desc: 'Vollständiger Test aller Kanäle vor dem Go-Live'
  },
  {
    title: 'Onboarding Call',
    desc: '30-minütiger Onboarding-Call mit deinem Account Manager'
  }
]

const faqs = [
  {
    q: 'Gibt es eine Mindestlaufzeit?',
    a: 'Nein. Nach dem ersten Monat kannst du monatlich kündigen. Die Setup-Gebühr wird nicht erstattet.'
  },
  {
    q: 'Was passiert, wenn ich kündige?',
    a: 'Du kannst jederzeit mit einer Frist von 30 Tagen zum Monatsende kündigen. Deine Daten werden nach 90 Tagen gelöscht.'
  },
  {
    q: 'Kann ich zwischen Basic und Pro wechseln?',
    a: 'Ja, jederzeit. Beim Upgrade zahlst du die Differenz der Setup-Gebühr. Beim Downgrade gibt es keine Erstattung.'
  },
  {
    q: 'Sind die Preise pro Standort?',
    a: 'Basic ist für 1 Standort. Pro unterstützt bis zu 5 Standorte. Für mehr Standorte kontaktiere uns für ein Custom-Angebot.'
  },
  {
    q: 'Welche Zahlungsmethoden akzeptiert ihr?',
    a: 'Wir akzeptieren Kreditkarte, SEPA-Lastschrift und Rechnung (ab Pro-Plan).'
  },
  {
    q: 'Gibt es versteckte Kosten?',
    a: 'Nein. Die einzigen Kosten sind die monatliche Gebühr und die einmalige Setup-Gebühr. Twilio-Kosten für Anrufe/SMS sind bereits inklusive (Fair-Use-Policy).'
  },
  {
    q: 'Was ist die Fair-Use-Policy?',
    a: 'Bis zu 1.000 Minuten Telefonie und 5.000 SMS pro Monat sind inklusive. Darüber hinaus berechnen wir 0,02€/Min und 0,01€/SMS.'
  },
  {
    q: 'Bietet ihr Rabatte für Jahresverträge?',
    a: 'Ja. Bei Jahreszahlung gibt es 15% Rabatt. Kontaktiere uns für ein individuelles Angebot.'
  }
]

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section noPadding className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-background to-brand-cyan-dark/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.1),transparent_50%)]" />
        
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
              <span className="text-sm font-medium text-brand-cyan">Transparente Preise</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              Einfache, faire Preise
            </Heading>

            <Copy size="xl" className="max-w-2xl mx-auto mb-10" muted>
              Keine versteckten Kosten. Keine Überraschungen. Monatlich kündbar.
            </Copy>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-3 p-1 rounded-full bg-muted/50 border border-border"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-brand-cyan text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-brand-cyan text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Jährlich
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                  -15%
                </span>
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Pricing Cards */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <MotionInView>
              <GlassCard className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">{plans.basic.name}</h3>
                  <Copy muted>{plans.basic.tagline}</Copy>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-bold">
                      {billingCycle === 'yearly' 
                        ? Math.round(plans.basic.monthly * 0.85)
                        : plans.basic.monthly}€
                    </span>
                    <span className="text-xl text-muted-foreground">/Monat</span>
                  </div>
                  <Copy size="sm" muted>
                    + {plans.basic.setup}€ Setup-Gebühr (einmalig)
                  </Copy>
                  {billingCycle === 'yearly' && (
                    <Copy size="sm" className="text-green-400 mt-1">
                      Spare {(plans.basic.monthly * 12 * 0.15).toFixed(0)}€ pro Jahr
                    </Copy>
                  )}
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plans.basic.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                      <Copy size="md">{feature}</Copy>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </GlassCard>
            </MotionInView>

            {/* Pro Plan */}
            <MotionInView delay={0.1}>
              <GlassCard className="h-full flex flex-col border-brand-cyan/50 bg-brand-cyan/5 relative">
                {plans.pro.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-sm font-semibold text-white shadow-lg">
                    ⭐ Empfohlen
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">{plans.pro.name}</h3>
                  <Copy muted>{plans.pro.tagline}</Copy>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-bold">
                      {billingCycle === 'yearly' 
                        ? Math.round(plans.pro.monthly * 0.85)
                        : plans.pro.monthly}€
                    </span>
                    <span className="text-xl text-muted-foreground">/Monat</span>
                  </div>
                  <Copy size="sm" muted>
                    + {plans.pro.setup}€ Setup-Gebühr (einmalig)
                  </Copy>
                  {billingCycle === 'yearly' && (
                    <Copy size="sm" className="text-green-400 mt-1">
                      Spare {(plans.pro.monthly * 12 * 0.15).toFixed(0)}€ pro Jahr
                    </Copy>
                  )}
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plans.pro.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                      <Copy size="md">{feature}</Copy>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </GlassCard>
            </MotionInView>
          </div>

          {/* WhatsApp Add-on */}
          <MotionInView className="mt-12 max-w-3xl mx-auto">
            <GlassCard>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">WhatsApp Add-on</h3>
                  <Copy muted>Für Basic-Kunden, die WhatsApp AI nutzen möchten</Copy>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-4xl font-bold mb-1">20€</div>
                  <Copy muted>/Monat</Copy>
                </div>
              </div>
            </GlassCard>
          </MotionInView>
        </Container>
      </Section>

      {/* What's Included in Setup */}
      <Section background="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Was ist im Setup enthalten?
            </Heading>
            <Copy size="lg" muted className="max-w-2xl mx-auto">
              Einmalige Setup-Gebühr für vollständige Konfiguration
            </Copy>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setupIncludes.map((item, i) => (
              <MotionInView key={i} delay={i * 0.05}>
                <GlassCard>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <Copy size="sm" muted>{item.desc}</Copy>
                </GlassCard>
              </MotionInView>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section>
        <Container size="lg">
          <div className="text-center mb-16">
            <Heading size="xl" className="mb-4">
              Häufige Fragen zu Preisen
            </Heading>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <MotionInView key={i} delay={i * 0.05}>
                <GlassCard>
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-semibold">{faq.q}</h3>
                  </div>
                  <Copy size="md" muted>{faq.a}</Copy>
                </GlassCard>
              </MotionInView>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient">
        <Container>
          <MotionInView>
            <GlassCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10">
              <Heading size="xl" className="mb-4">
                Bereit zu starten?
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Buche jetzt deine Demo und erlebe PILAR in Aktion.
              </Copy>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt Demo buchen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Fragen? Kontakt aufnehmen
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
