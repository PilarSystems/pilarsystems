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
  Users,
  Lock,
  Award,
  Clock,
  CreditCard,
  Rocket,
  Star,
  Quote,
  BadgeCheck,
  RefreshCw
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-black">
      {/* Hero Section - Enhanced with Benefit Bullets */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-blue-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 md:py-32">
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

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-white">Dein Fitnessstudio,</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                vollautomatisch
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              24/7 AI Rezeption, WhatsApp & Phone Automation, Lead-Engine und Follow-Up System. 
              Alles in einer Plattform – speziell für Fitnessstudios.
            </p>

            {/* CTA Buttons - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4"
            >
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                  <Rocket className="mr-2 h-5 w-5" />
                  Jetzt starten
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-gray-600 hover:bg-gray-800 text-white">
                  Funktionen ansehen
                </Button>
              </Link>
            </motion.div>

            {/* Benefit Bullets - NEW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-400 px-4"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan-400" />
                <span>Sichere Zahlung mit Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Setup in 15 Minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-cyan-400" />
                <span>Jederzeit kündbar</span>
              </div>
            </motion.div>

            {/* Trust Signals Stats - NEW */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 sm:mt-16"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white">50+</div>
                  <div className="text-sm text-gray-400 mt-1">Studios vertrauen uns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400 mt-1">Uptime Garantie</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white">10k+</div>
                  <div className="text-sm text-gray-400 mt-1">Leads verarbeitet</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-400 mt-1">Kundenbewertung</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section - NEW */}
      <Section className="bg-gradient-to-b from-black to-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 sm:gap-12 items-center"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <div className="font-semibold text-white text-sm">DSGVO-konform</div>
                <div className="text-xs text-gray-400">100% Datenschutz</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <Lock className="h-8 w-8 text-cyan-400" />
              <div>
                <div className="font-semibold text-white text-sm">SSL-verschlüsselt</div>
                <div className="text-xs text-gray-400">256-bit Encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <Award className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="font-semibold text-white text-sm">ISO 27001</div>
                <div className="text-xs text-gray-400">Zertifiziert</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <Globe className="h-8 w-8 text-blue-400" />
              <div>
                <div className="font-semibold text-white text-sm">Server in DE</div>
                <div className="text-xs text-gray-400">Frankfurt am Main</div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Problem → Solution Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Schluss mit manueller Arbeit
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Während andere Studios im Chaos versinken, automatisiert PILAR alles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-red-400 mb-6">❌ Ohne PILAR</h3>
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
                    <div className="text-red-400 mt-1 flex-shrink-0">✗</div>
                    <p className="text-gray-300 text-sm sm:text-base">{problem}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-6">✓ Mit PILAR</h3>
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

      {/* Testimonials Section - NEW */}
      <Section className="bg-gradient-to-b from-gray-950 to-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6"
            >
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-yellow-300">Von Studios empfohlen</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Das sagen unsere Kunden
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Echte Erfahrungen von echten Fitnessstudios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Thomas Müller',
                role: 'Inhaber',
                studio: 'FitZone München',
                quote: 'Seit wir PILAR nutzen, verpassen wir keinen Anruf mehr. Die AI nimmt jeden Lead professionell entgegen und bucht automatisch Probetrainings. Unsere Conversion-Rate ist um 40% gestiegen!',
                rating: 5
              },
              {
                name: 'Sarah Schmidt',
                role: 'Studio-Managerin',
                studio: 'BodyPower Berlin',
                quote: 'Die WhatsApp-Automation hat unsere Arbeit revolutioniert. Wir sparen täglich 3-4 Stunden, die wir vorher mit Nachrichten beantworten verbracht haben. Absolute Empfehlung!',
                rating: 5
              },
              {
                name: 'Michael Weber',
                role: 'Geschäftsführer',
                studio: 'Fitness Factory Hamburg',
                quote: 'Das beste Investment für unser Studio. Die Lead-Engine priorisiert automatisch die heißesten Leads, und unser Team kann sich auf das konzentrieren, was zählt: unsere Mitglieder.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-400" />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-5 w-5 ${
                        j < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}, {testimonial.studio}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Product Modules Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Alles, was dein Studio braucht
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Eine Plattform. Alle Kanäle. Vollautomatisch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* 30-Day Guarantee Section - NEW */}
      <Section className="bg-gradient-to-b from-black to-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-500/30 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <BadgeCheck className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  30 Tage Geld-zurück-Garantie
                </h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                  Teste PILAR ohne Risiko. Wenn du innerhalb von 30 Tagen nicht zufrieden bist, 
                  erhältst du dein Geld vollständig zurück – keine Fragen, keine Haken.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Kein Risiko</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Schnelle Erstattung</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Keine versteckten Kosten</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Onboarding Flow Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              In 5 Schritten live
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Setup in wenigen Minuten. Keine technischen Kenntnisse erforderlich.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent hidden md:block" />

            <div className="space-y-8 sm:space-y-12">
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
                  className={`flex flex-col md:flex-row items-center gap-4 sm:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg shadow-cyan-500/50">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Transparente Preise
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Keine versteckten Kosten. Keine Überraschungen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">Für kleinere Studios</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">100€</span>
                <span className="text-gray-400">/Monat</span>
                <p className="text-sm text-gray-500 mt-2">+ 500€ Setup (einmalig)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['AI Phone', 'AI Email', 'Lead Engine', 'Calendar Sync', 'Basic Analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
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
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/50 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold">
                Empfohlen
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">Für wachsende Studios</p>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">149€</span>
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
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Warum PILAR?
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Speziell für Fitnessstudios entwickelt
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Häufige Fragen
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Wie lange dauert das Setup?',
                a: 'Das komplette Setup dauert ca. 15-20 Minuten. Du durchläufst einen geführten 5-Schritt-Wizard und kannst sofort loslegen.'
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
                className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm sm:text-base">{faq.a}</p>
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
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Starte dein AI Studio heute
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Erlebe, wie dein Studio mit PILAR vollautomatisch läuft. Jetzt starten und sofort loslegen.
            </p>
            
            {/* Benefit reminders */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Sichere Zahlung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>30 Tage Geld-zurück</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>15 Min Setup</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
                  <Rocket className="mr-2 h-5 w-5" />
                  Jetzt starten
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-gray-600 hover:bg-gray-800 text-white">
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
