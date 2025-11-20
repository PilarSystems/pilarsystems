'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { 
  Users, 
  TrendingUp, 
  Euro, 
  Gift,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

export default function AffiliatePage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-blue-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
            >
              <Gift className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Affiliate Programm</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-white">Empfehle PILAR,</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                verdiene Provision
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Werde Partner und verdiene bis zu 30% wiederkehrende Provision für jedes Studio, 
              das du zu PILAR bringst. Passives Einkommen durch Empfehlungen.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/affiliate/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt Partner werden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                  Wie es funktioniert
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: 'Provision', value: 'bis 30%' },
                { label: 'Cookie-Laufzeit', value: '30 Tage' },
                { label: 'Auszahlung', value: 'monatlich' },
                { label: 'Min. Auszahlung', value: '50€' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Commission Structure */}
      <Section id="commission" className="bg-gradient-to-b from-black to-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Deine Provisionen
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Verdiene an jedem Kunden, den du vermittelst – wiederkehrend, jeden Monat
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan Commission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Basic Plan</h3>
              <p className="text-gray-400 mb-6">100€/Monat + 500€ Setup</p>
              <div className="mb-6">
                <div className="text-5xl font-bold text-cyan-400 mb-2">25%</div>
                <p className="text-gray-400">wiederkehrende Provision</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>25€ pro Monat pro Kunde</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>125€ einmalig (Setup-Provision)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>Solange Kunde aktiv bleibt</span>
                </div>
              </div>
            </motion.div>

            {/* Pro Plan Commission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/50 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold">
                Höhere Provision
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-gray-400 mb-6">149€/Monat + 1.000€ Setup</p>
              <div className="mb-6">
                <div className="text-5xl font-bold text-cyan-400 mb-2">30%</div>
                <p className="text-gray-400">wiederkehrende Provision</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>45€ pro Monat pro Kunde</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>300€ einmalig (Setup-Provision)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>Solange Kunde aktiv bleibt</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Example Calculation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Beispiel-Rechnung</h3>
            <div className="space-y-4 text-gray-300">
              <p className="text-center text-lg">
                Du vermittelst <span className="text-cyan-400 font-semibold">5 Studios</span> (3x Basic, 2x Pro):
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-black/50">
                  <div className="text-sm text-gray-400 mb-1">Einmalig (Setup)</div>
                  <div className="text-2xl font-bold text-white">975€</div>
                  <div className="text-xs text-gray-500 mt-1">3×125€ + 2×300€</div>
                </div>
                <div className="p-4 rounded-lg bg-black/50">
                  <div className="text-sm text-gray-400 mb-1">Monatlich (wiederkehrend)</div>
                  <div className="text-2xl font-bold text-cyan-400">165€</div>
                  <div className="text-xs text-gray-500 mt-1">3×25€ + 2×45€</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">
                Nach 12 Monaten: <span className="text-white font-semibold">2.955€</span> Gesamtverdienst
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              So funktioniert's
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              In 3 einfachen Schritten zum Affiliate-Partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Users,
                title: 'Registrieren',
                desc: 'Melde dich kostenlos als Affiliate-Partner an und erhalte deinen persönlichen Referral-Link.',
              },
              {
                step: 2,
                icon: Target,
                title: 'Empfehlen',
                desc: 'Teile deinen Link mit Fitnessstudios, Gym-Besitzern oder in deinem Netzwerk.',
              },
              {
                step: 3,
                icon: Euro,
                title: 'Verdienen',
                desc: 'Erhalte Provision für jeden Kunden, der sich über deinen Link registriert und zahlt.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-6">
                  <item.icon className="h-12 w-12 text-cyan-400" />
                </div>
                <div className="text-4xl font-bold text-cyan-400 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Warum PILAR Affiliate?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Wiederkehrende Provision',
                desc: 'Verdiene jeden Monat, solange dein vermittelter Kunde aktiv bleibt.',
              },
              {
                icon: Zap,
                title: 'Hohe Conversion',
                desc: 'PILAR löst echte Probleme – Studios kaufen gerne.',
              },
              {
                icon: Euro,
                title: 'Attraktive Provisionen',
                desc: 'Bis zu 30% wiederkehrend + einmalige Setup-Provision.',
              },
              {
                icon: BarChart3,
                title: 'Transparentes Dashboard',
                desc: 'Verfolge Klicks, Leads, Conversions und Provisionen in Echtzeit.',
              },
              {
                icon: Gift,
                title: 'Marketing-Material',
                desc: 'Wir stellen dir Banner, Texte und Assets zur Verfügung.',
              },
              {
                icon: CheckCircle2,
                title: 'Faire Bedingungen',
                desc: '30 Tage Cookie-Laufzeit, monatliche Auszahlung ab 50€.',
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
                  <benefit.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
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
              Bereit, Partner zu werden?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Registriere dich jetzt kostenlos und starte mit deinem ersten Referral-Link.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/affiliate/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt Partner werden
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
