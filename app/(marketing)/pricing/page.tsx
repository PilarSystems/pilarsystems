'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'

export default function PricingPage() {
  const features = {
    basic: [
      'AI Phone Rezeption (24/7)',
      'AI Email Automation',
      'Lead Engine (A/B/C Klassifikation)',
      'Calendar Sync (Google Calendar)',
      'Basic Analytics Dashboard',
      'Follow-Up Automation',
      'Email Support',
      '1 Standort'
    ],
    pro: [
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

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-blue-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Transparente Preise</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Einfache, faire Preise
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Keine versteckten Kosten. Keine Überraschungen. Monatlich kündbar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <Section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Basic</h3>
                <p className="text-gray-400">Perfekt für kleinere Studios</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-white">100€</span>
                  <span className="text-xl text-gray-400">/Monat</span>
                </div>
                <p className="text-gray-500">+ 500€ Setup-Gebühr (einmalig)</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.basic.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border-2 border-cyan-500/50 hover:border-cyan-500 transition-all duration-300 shadow-2xl shadow-cyan-500/20"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold shadow-lg">
                ⭐ Empfohlen
              </div>

              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400">Für wachsende Studios & Ketten</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-white">149€</span>
                  <span className="text-xl text-gray-400">/Monat</span>
                </div>
                <p className="text-gray-500">+ 1.000€ Setup-Gebühr (einmalig)</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.pro.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* WhatsApp Add-on */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Add-on</h3>
                <p className="text-gray-400">Für Basic-Kunden, die WhatsApp AI nutzen möchten</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold text-white mb-1">20€</div>
                <div className="text-gray-400">/Monat</div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* What's Included in Setup */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Was ist im Setup enthalten?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Einmalige Setup-Gebühr für vollständige Konfiguration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Häufige Fragen zu Preisen
            </h2>
          </div>

          <div className="space-y-6">
            {[
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
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-cyan-950/30 via-black to-blue-950/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bereit zu starten?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Starte jetzt und erlebe PILAR in Aktion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                  Fragen? Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
