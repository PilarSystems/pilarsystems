'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { 
  MessageSquare, 
  Dumbbell,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function WhatsAppCoachPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 via-black to-emerald-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <MessageSquare className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">WhatsApp Gym Buddy</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="block">Dein persönlicher</span>
              <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                AI Fitness Coach
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              24/7 Motivation, Trainingsplanung und Ernährungsberatung – direkt in WhatsApp. 
              Dein AI Buddy, der dich zu deinen Zielen bringt.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Frühzugang sichern
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                Wie es funktioniert
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-sm text-gray-500"
            >
              🚀 Beta startet Q1 2026 • Jetzt auf Warteliste eintragen
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What is it Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Was ist der WhatsApp Gym Buddy?
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Stell dir vor, du hättest einen Personal Trainer, der 24/7 für dich da ist – 
                direkt in WhatsApp. Der WhatsApp Gym Buddy ist dein AI-gestützter Fitness-Coach, 
                der dich motiviert, Trainingspläne erstellt und deine Fortschritte trackt.
              </p>
              <div className="space-y-4">
                {[
                  'Personalisierte Trainingspläne basierend auf deinen Zielen',
                  'Tägliche Motivation & Erinnerungen',
                  'Ernährungsberatung & Makro-Tracking',
                  'Progress-Tracking mit Fotos & Messungen',
                  'Antworten auf alle Fitness-Fragen',
                  'Integration mit deinem Studio (optional)'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
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
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/30 p-8 flex items-center justify-center">
                <MessageSquare className="h-32 w-32 text-green-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dein Buddy kann alles
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Von Trainingsplanung bis Ernährung – alles in einem Chat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Dumbbell}
              title="Trainingsplanung"
              description="Erstellt personalisierte Trainingspläne basierend auf deinem Level, Zielen und verfügbarer Zeit. Push/Pull/Legs, Full Body, oder Custom."
            />
            <FeatureCard
              icon={Target}
              title="Ziel-Tracking"
              description="Definiere deine Ziele (Muskelaufbau, Fettabbau, Kraft) und tracke deinen Fortschritt mit Fotos, Gewicht und Messungen."
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Progress Analytics"
              description="Visualisiere deine Fortschritte mit Grafiken und Statistiken. Sieh, wie weit du gekommen bist."
              delay={0.2}
            />
            <FeatureCard
              icon={Calendar}
              title="Workout Reminders"
              description="Bekomme tägliche Erinnerungen für dein Training. Dein Buddy fragt nach, ob du trainiert hast."
              delay={0.3}
            />
            <FeatureCard
              icon={MessageSquare}
              title="24/7 Support"
              description="Frag alles zu Training, Ernährung, Supplements. Dein Buddy antwortet sofort – auch nachts."
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
              title="Studio Integration"
              description="Verbinde deinen Buddy mit deinem Studio. Dein Trainer sieht deine Fortschritte und kann Feedback geben."
              delay={0.5}
            />
          </div>
        </div>
      </Section>

      {/* Two Models */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Zwei Wege zum Buddy
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Direkt bei uns oder über dein Studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Direct Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Direkt-Abo</h3>
                <p className="text-gray-400">Für alle Athleten & Gym-Gänger</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">9,99€</span>
                  <span className="text-xl text-gray-400">/Monat</span>
                </div>
                <p className="text-sm text-gray-500">Monatlich kündbar</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Alle Features inklusive',
                  'Personalisierte Trainingspläne',
                  'Ernährungsberatung',
                  'Progress-Tracking',
                  '24/7 WhatsApp Support',
                  'Keine Studio-Bindung'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Auf Warteliste
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Studio Partner Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/50"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Studio-Partner</h3>
                <p className="text-gray-400">Über dein Fitnessstudio</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">Variabel</span>
                </div>
                <p className="text-sm text-gray-500">Preis setzt dein Studio fest</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Alle Features inklusive',
                  'Integration mit Studio-System',
                  'Trainer kann Feedback geben',
                  'Studio-spezifische Trainingspläne',
                  'Dein Studio verdient mit',
                  'QR-Code Registrierung im Studio'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Studio-Partner werden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* How it Works */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              So funktioniert's
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Registrieren',
                desc: 'Scanne den QR-Code im Studio oder registriere dich direkt über unsere Website.'
              },
              {
                step: 2,
                title: 'Ziele definieren',
                desc: 'Sag deinem Buddy, was du erreichen willst: Muskelaufbau, Fettabbau, Kraft, oder Ausdauer.'
              },
              {
                step: 3,
                title: 'Loslegen',
                desc: 'Bekomme deinen ersten Trainingsplan und starte durch. Dein Buddy begleitet dich jeden Tag.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-2xl font-bold text-white mb-4 shadow-lg shadow-green-500/50">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-green-950/30 via-black to-emerald-950/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-green-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bereit für deinen AI Buddy?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Trag dich jetzt auf die Warteliste ein und sei einer der Ersten, 
              die den WhatsApp Gym Buddy nutzen können.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Frühzugang sichern
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 hover:bg-gray-800">
                  Für Studios: Partner werden
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
