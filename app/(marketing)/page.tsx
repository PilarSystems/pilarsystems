'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  BarChart3, 
  Bot,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
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
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Vollautomatisches AI Studio</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-white">Dein Fitnessstudio,</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                vollautomatisch
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              24/7 AI Rezeption, WhatsApp & Phone Automation, Lead-Engine und Follow-Up System. 
              Alles in einer Plattform – speziell für Fitnessstudios.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                  Funktionen ansehen
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <p className="text-sm text-gray-500">Vertraut von führenden Studios in DACH</p>
              <div className="flex gap-8 items-center opacity-50">
                <div className="text-gray-600 font-semibold">Your Logo Here</div>
                <div className="text-gray-600 font-semibold">Your Logo Here</div>
                <div className="text-gray-600 font-semibold">Your Logo Here</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <Section className="bg-gradient-to-b from-black to-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Schluss mit manueller Arbeit
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Während andere Studios im Chaos versinken, automatisiert PILAR alles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-red-400 mb-6">❌ Ohne PILAR</h3>
              <div className="space-y-4">
                {[
                  'Telefon klingelt durch – Leads gehen verloren',
                  'WhatsApp & Instagram voll – keine Zeit zu antworten',
                  'Leads antworten nicht auf Follow-Ups',
                  'Kein Überblick über Termine & Probetrainings',
                  'Trainer verbringen Stunden am Telefon statt im Training'
                ].map((problem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-red-950/20 border border-red-900/30"
                  >
                    <div className="text-red-400 mt-1">✗</div>
                    <p className="text-gray-300">{problem}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-6">✓ Mit PILAR</h3>
              <div className="space-y-4">
                {[
                  { title: 'AI Phone', desc: 'Nimmt jeden Anruf an, 24/7' },
                  { title: 'AI WhatsApp', desc: 'Antwortet sofort auf jede Nachricht' },
                  { title: 'AI Email', desc: 'Bearbeitet Anfragen automatisch' },
                  { title: 'Lead Engine', desc: 'Klassifiziert & priorisiert jeden Lead' },
                  { title: 'Follow-Up Automation', desc: 'Kein Lead wird vergessen' }
                ].map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-cyan-950/20 border border-cyan-900/30 hover:border-cyan-500/50 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">{solution.title}</p>
                      <p className="text-sm text-gray-400">{solution.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Product Modules Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Alles, was dein Studio braucht
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Eine Plattform. Alle Kanäle. Vollautomatisch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Phone}
              title="AI Phone Rezeption"
              description="Nimmt jeden Anruf entgegen, beantwortet Fragen, bucht Probetrainings und leitet wichtige Anrufe weiter."
              delay={0}
            />
            <FeatureCard
              icon={MessageSquare}
              title="WhatsApp AI"
              description="Chattet mit Leads und Mitgliedern, beantwortet FAQs und führt Follow-Up Sequenzen durch."
              delay={0.1}
            />
            <FeatureCard
              icon={Mail}
              title="Email Automation"
              description="Verarbeitet eingehende E-Mails, antwortet automatisch und kategorisiert Anfragen."
              delay={0.2}
            />
            <FeatureCard
              icon={Users}
              title="Lead Engine"
              description="Klassifiziert jeden Lead (A/B/C), priorisiert automatisch und zeigt dir die heißesten Leads."
              delay={0.3}
            />
            <FeatureCard
              icon={Calendar}
              title="Calendar Sync"
              description="Synchronisiert mit Google Calendar, bucht Probetrainings und sendet Erinnerungen."
              delay={0.4}
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Insights"
              description="Echtzeit-Dashboard mit KPIs, Lead-Conversion und Performance-Metriken."
              delay={0.5}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30">
                Alle Features ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Onboarding Flow Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              In 7 Schritten live
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Setup in wenigen Minuten. Keine technischen Kenntnisse erforderlich.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent hidden md:block" />

            <div className="space-y-12">
              {[
                { step: 1, title: 'Studio Info', desc: 'Name, Standort, Öffnungszeiten' },
                { step: 2, title: 'Kanäle verbinden', desc: 'Phone, WhatsApp, Email, Calendar' },
                { step: 3, title: 'Angebote & Preise', desc: 'Mitgliedschaften, Probetrainings, PT' },
                { step: 4, title: 'AI Regeln', desc: 'Wie soll die AI reagieren?' },
                { step: 5, title: 'Test & Go Live', desc: 'Teste alles, dann live schalten' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/50">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing Preview */}
      <Section className="bg-gradient-to-b from-gray-950 to-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transparente Preise
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Keine versteckten Kosten. Keine Überraschungen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">Für kleinere Studios</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">100€</span>
                <span className="text-gray-400">/Monat</span>
                <p className="text-sm text-gray-500 mt-2">+ 500€ Setup (einmalig)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['AI Phone', 'AI Email', 'Lead Engine', 'Calendar Sync', 'Basic Analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/50 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold">
                Empfohlen
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">Für wachsende Studios</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">149€</span>
                <span className="text-gray-400">/Monat</span>
                <p className="text-sm text-gray-500 mt-2">+ 1.000€ Setup (einmalig)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Alles aus Basic',
                  'AI WhatsApp',
                  'Advanced Analytics',
                  'Multi-Location Support',
                  'Priority Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                Alle Preise ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Why PILAR Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Warum PILAR?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Speziell für Fitnessstudios entwickelt
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Zap}
              title="Fitness-Spezifisch"
              description="Kennt Probetrainings, Mitgliedschaften, PT-Pakete und Gym-Sprache."
            />
            <FeatureCard
              icon={Globe}
              title="DACH-Fokus"
              description="Deutsche Sprache, DSGVO-konform, auf deutsche Studios optimiert."
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Multi-Tenant Ready"
              description="Perfekt für Studio-Ketten mit mehreren Standorten."
              delay={0.2}
            />
            <FeatureCard
              icon={Bot}
              title="Multichannel AI"
              description="Phone, WhatsApp, Email – alles aus einer Hand."
              delay={0.3}
            />
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Häufige Fragen
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Wie lange dauert das Setup?',
                a: 'Das komplette Setup dauert ca. 15-20 Minuten. Du durchläufst einen geführten 7-Schritt-Wizard und kannst sofort loslegen.'
              },
              {
                q: 'Brauche ich technische Kenntnisse?',
                a: 'Nein. Der Onboarding-Prozess ist komplett geführt und selbsterklärend. Wenn du WhatsApp bedienen kannst, kannst du PILAR nutzen.'
              },
              {
                q: 'Wie funktioniert die AI Phone Rezeption?',
                a: 'Wir kaufen automatisch eine deutsche Telefonnummer für dich. Alle Anrufe werden von unserer AI entgegengenommen, die Fragen beantwortet und Termine bucht.'
              },
              {
                q: 'Ist PILAR DSGVO-konform?',
                a: 'Ja, absolut. Alle Daten werden verschlüsselt in Deutschland gespeichert. Wir sind vollständig DSGVO-konform.'
              },
              {
                q: 'Kann ich jederzeit kündigen?',
                a: 'Ja. Monatliche Kündigungsfrist. Keine Mindestlaufzeit nach dem ersten Monat.'
              },
              {
                q: 'Was passiert mit meinen bestehenden Telefonnummern?',
                a: 'Du kannst entweder eine neue Nummer von uns nutzen oder deine bestehende Twilio-Nummer verbinden.'
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

      {/* Final CTA */}
      <Section className="bg-gradient-to-br from-cyan-950/30 via-black to-blue-950/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Starte dein AI Studio in 7 Tagen
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Starte jetzt und erlebe, wie PILAR dein Studio automatisiert.
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
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
