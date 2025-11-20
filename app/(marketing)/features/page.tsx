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
  Users,
  Zap,
  Shield,
  Clock,
  Target,
  TrendingUp,
  ArrowRight
} from 'lucide-react'

export default function FeaturesPage() {
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
              <span className="text-sm text-cyan-300">Alle Features</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Alles, was dein Studio braucht
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Eine Plattform. Alle Kanäle. Vollautomatisch. Speziell für Fitnessstudios entwickelt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kernfunktionen
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Multichannel AI für dein Studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Phone}
              title="AI Phone Rezeption"
              description="Nimmt jeden Anruf entgegen, beantwortet Fragen zu Öffnungszeiten, Preisen und Angeboten. Bucht Probetrainings direkt in deinen Kalender und leitet wichtige Anrufe an dich weiter."
            />
            <FeatureCard
              icon={MessageSquare}
              title="WhatsApp AI"
              description="Chattet mit Leads und Mitgliedern rund um die Uhr. Beantwortet FAQs, sendet Follow-Up-Nachrichten und führt automatische Sequenzen durch. Unterstützt Bilder, Videos und Sprachnachrichten."
              delay={0.1}
            />
            <FeatureCard
              icon={Mail}
              title="Email Automation"
              description="Verarbeitet eingehende E-Mails automatisch, kategorisiert Anfragen und antwortet mit personalisierten Templates. Integriert mit deinem bestehenden Email-Account."
              delay={0.2}
            />
            <FeatureCard
              icon={Users}
              title="Lead Engine"
              description="Klassifiziert jeden Lead automatisch (A/B/C) basierend auf Interesse, Budget und Kaufbereitschaft. Zeigt dir die heißesten Leads zuerst und priorisiert Follow-Ups intelligent."
              delay={0.3}
            />
            <FeatureCard
              icon={Calendar}
              title="Calendar Sync"
              description="Synchronisiert mit Google Calendar, bucht Probetrainings automatisch und sendet Erinnerungen per WhatsApp, Email und SMS. Verhindert Doppelbuchungen."
              delay={0.4}
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Insights"
              description="Echtzeit-Dashboard mit KPIs: Lead-Conversion, Response-Time, Buchungsrate, Revenue-Tracking. Exportiere Reports für dein Team."
              delay={0.5}
            />
          </div>
        </div>
      </Section>

      {/* AI Phone Deep Dive */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">AI Phone</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Nie wieder einen Anruf verpassen
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Unsere AI Phone Rezeption nimmt jeden Anruf entgegen – 24/7, auch außerhalb der Öffnungszeiten. 
                Sie kennt deine Angebote, Preise und Öffnungszeiten und kann Probetrainings direkt buchen.
              </p>
              <div className="space-y-4">
                {[
                  'Automatische Anrufannahme in unter 2 Sekunden',
                  'Natürliche Konversation auf Deutsch',
                  'Direktbuchung von Probetrainings',
                  'Weiterleitung wichtiger Anrufe',
                  'Aufzeichnung & Transkription aller Gespräche',
                  'Integration mit CRM & Lead Engine'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/30 p-8 flex items-center justify-center">
                <Phone className="h-32 w-32 text-cyan-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* WhatsApp Deep Dive */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/30 p-8 flex items-center justify-center">
                <MessageSquare className="h-32 w-32 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <MessageSquare className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">WhatsApp AI</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                WhatsApp Automation auf Steroiden
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Deine AI antwortet sofort auf jede WhatsApp-Nachricht. Leads bekommen innerhalb von Sekunden 
                eine personalisierte Antwort – auch nachts um 3 Uhr.
              </p>
              <div className="space-y-4">
                {[
                  'Sofortige Antwort auf jede Nachricht',
                  'Personalisierte Follow-Up Sequenzen',
                  'Automatische Lead-Qualifizierung',
                  'Unterstützung für Bilder & Videos',
                  'Broadcast-Nachrichten an Segmente',
                  'WhatsApp Business API Integration'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Lead Engine Deep Dive */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Lead Engine</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Intelligente Lead-Klassifikation
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Nicht alle Leads sind gleich. Unsere AI analysiert jede Interaktion und klassifiziert Leads 
                automatisch nach Kaufbereitschaft, Budget und Interesse.
              </p>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-950/30 to-black border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">A-Leads (Hot)</h3>
                  <p className="text-sm text-gray-400">
                    Hohe Kaufbereitschaft, Budget vorhanden, sofort kontaktieren
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-500/30">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">B-Leads (Warm)</h3>
                  <p className="text-sm text-gray-400">
                    Interesse vorhanden, braucht mehr Infos, Follow-Up in 2-3 Tagen
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">C-Leads (Cold)</h3>
                  <p className="text-sm text-gray-400">
                    Nur Informationssuche, automatische Nurturing-Sequenz
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-500/30 p-8 flex items-center justify-center">
                <Target className="h-32 w-32 text-purple-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Additional Features */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Weitere Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Clock}
              title="24/7 Verfügbar"
              description="Deine AI schläft nie. Leads werden auch nachts und am Wochenende bearbeitet."
            />
            <FeatureCard
              icon={Shield}
              title="DSGVO-konform"
              description="Alle Daten werden verschlüsselt in Deutschland gespeichert. 100% DSGVO-compliant."
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Conversion Boost"
              description="Durchschnittlich 40% mehr Conversions durch sofortige Antworten und Follow-Ups."
              delay={0.2}
            />
            <FeatureCard
              icon={Bot}
              title="Custom AI Rules"
              description="Passe die AI an deine Bedürfnisse an. Definiere eigene Regeln und Workflows."
              delay={0.3}
            />
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
              Bereit, dein Studio zu automatisieren?
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
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                  Preise ansehen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
