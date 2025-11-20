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
import { CheckCircle2, ArrowRight, Zap, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { marketing } from '@/content/marketing.de'

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

  const basicPrice = billingCycle === 'yearly' ? '€85' : '€100'
  const proPrice = billingCycle === 'yearly' ? '€127' : '€149'

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
              <span className="text-sm font-medium text-brand-cyan">Transparente Preise</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              {marketing.pricing.hero.title}
            </Heading>

            <Copy size="xl" className="max-w-2xl mx-auto mb-10" muted>
              {marketing.pricing.hero.subtitle}
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
                {marketing.pricing.billing.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-brand-cyan text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {marketing.pricing.billing.yearly}
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                  {marketing.pricing.billing.save}
                </span>
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Pricing Cards */}
      <Section id="plans">
        <Container>
          <ScrollSection stagger>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <DepthCard className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">{marketing.pricing.plans.basic.name}</h3>
                  <Copy muted>{marketing.pricing.plans.basic.description}</Copy>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-bold">{basicPrice}</span>
                    <span className="text-xl text-muted-foreground">/Monat</span>
                  </div>
                  <Copy size="sm" muted>
                    {marketing.pricing.plans.basic.setup}
                  </Copy>
                  {billingCycle === 'yearly' && (
                    <Copy size="sm" className="text-green-400 mt-1">
                      Spare €180 pro Jahr
                    </Copy>
                  )}
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {marketing.pricing.plans.basic.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                      <Copy size="md">{feature}</Copy>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block">
                  <MicroButton variant="secondary" size="lg" className="w-full">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MicroButton>
                </Link>
              </DepthCard>

              {/* Pro Plan */}
              <DepthCard className="h-full flex flex-col border-brand-cyan/50 bg-brand-cyan/5 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-sm font-semibold text-white shadow-lg">
                  ⭐ Empfohlen
                </div>

                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">{marketing.pricing.plans.pro.name}</h3>
                  <Copy muted>{marketing.pricing.plans.pro.description}</Copy>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-bold">{proPrice}</span>
                    <span className="text-xl text-muted-foreground">/Monat</span>
                  </div>
                  <Copy size="sm" muted>
                    {marketing.pricing.plans.pro.setup}
                  </Copy>
                  {billingCycle === 'yearly' && (
                    <Copy size="sm" className="text-green-400 mt-1">
                      Spare €264 pro Jahr
                    </Copy>
                  )}
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {marketing.pricing.plans.pro.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                      <Copy size="md">{feature}</Copy>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block">
                  <MicroButton variant="primary" size="lg" className="w-full">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MicroButton>
                </Link>
              </DepthCard>
            </div>

            {/* WhatsApp Add-on */}
            <div className="mt-12 max-w-3xl mx-auto">
              <DepthCard>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{marketing.pricing.addon.title}</h3>
                    <Copy muted>{marketing.pricing.addon.description}</Copy>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-bold mb-1">{marketing.pricing.addon.price}</div>
                    <Copy muted>/Monat</Copy>
                  </div>
                </div>
              </DepthCard>
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
                {marketing.pricing.faq.title}
              </Heading>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {marketing.pricing.faq.items.map((faq, i) => (
                <DepthCard key={i}>
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                  </div>
                  <Copy size="md" muted>{faq.answer}</Copy>
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
                  Bereit zu starten?
                </Heading>
                <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                  Buche jetzt deine Demo und erlebe PILAR in Aktion.
                </Copy>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <MicroButton variant="primary" size="lg">
                      Jetzt Demo buchen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </MicroButton>
                  </Link>
                  <Link href="/contact">
                    <MicroButton variant="secondary" size="lg">
                      Fragen? Kontakt aufnehmen
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
