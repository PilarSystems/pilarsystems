'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { Zap, Target, Users, Rocket, ArrowRight } from 'lucide-react'

export default function AboutPage() {
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
              <Rocket className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Über uns</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Von der Gym-Floor zur AI SaaS
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Wir bauen die Zukunft der Fitnessstudio-Automatisierung
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Unsere Mission
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Wir glauben, dass Trainer trainieren sollten – nicht telefonieren. 
                Dass Studio-Besitzer wachsen sollten – nicht im Chaos versinken. 
                Und dass jeder Lead eine Chance verdient – nicht verloren zu gehen.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                PILAR SYSTEMS automatisiert alles, was automatisiert werden kann, 
                damit du dich auf das konzentrieren kannst, was wirklich zählt: 
                Menschen zu besseren Versionen ihrer selbst zu machen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/30 p-8 flex items-center justify-center">
                <Target className="h-32 w-32 text-cyan-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Story Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Wie alles begann
            </h2>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Das Problem</h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Als Studio-Besitzer haben wir am eigenen Leib erlebt, wie frustrierend es ist: 
                Das Telefon klingelt durch, WhatsApp quillt über, Leads antworten nicht auf Follow-Ups, 
                und am Ende des Tages hast du mehr Zeit am Telefon verbracht als auf der Trainingsfläche. 
                Wir wussten: Das muss besser gehen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Die Lösung</h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Wir haben PILAR SYSTEMS gebaut – eine AI-Plattform, die speziell für Fitnessstudios entwickelt wurde. 
                Keine generische Chatbot-Lösung, sondern ein System, das Probetrainings versteht, 
                Mitgliedschaften kennt und weiß, wie man mit Leads spricht. Ein System, das 24/7 arbeitet, 
                damit du es nicht musst.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Die Vision</h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Wir bauen ein AI-Ökosystem für die gesamte Fitness-Industrie. Von der Studio-Automatisierung 
                über den WhatsApp Gym Buddy für Athleten bis hin zu AI-gestützten Trainingsplänen und Ernährungsberatung. 
                Unser Ziel: Fitness für alle zugänglicher, effizienter und persönlicher machen.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unsere Werte
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Automatisierung',
                desc: 'Wir automatisieren alles, was automatisiert werden kann – damit du Zeit für das Wesentliche hast.'
              },
              {
                icon: Target,
                title: 'Fokus',
                desc: 'Wir bauen ausschließlich für Fitnessstudios. Keine generischen Lösungen, sondern Fitness-spezifisch.'
              },
              {
                icon: Users,
                title: 'Community',
                desc: 'Wir hören auf unsere Kunden. Jedes Feature entsteht aus echtem Feedback von echten Studios.'
              },
              {
                icon: Rocket,
                title: 'Innovation',
                desc: 'Wir nutzen modernste AI-Technologie, um die Fitness-Industrie in die Zukunft zu bringen.'
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
                  <value.icon className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Made in Germany
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Entwickelt von Fitness-Enthusiasten und AI-Experten aus dem DACH-Raum
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 text-center"
          >
            <p className="text-lg text-gray-400 leading-relaxed">
              Wir sind ein kleines, aber feines Team aus Entwicklern, Designern und Fitness-Experten. 
              Alle mit einem gemeinsamen Ziel: Die beste AI-Plattform für Fitnessstudios zu bauen. 
              DSGVO-konform, in Deutschland gehostet, und mit Support auf Deutsch.
            </p>
          </motion.div>
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
              Teil der Zukunft werden
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Bist du bereit, dein Studio zu automatisieren? Buche jetzt deine Demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Jetzt Demo buchen
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
