'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studioName: '',
    studioSize: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact-page',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          studioName: '',
          studioSize: '',
          message: ''
        })
        setTimeout(() => setSubmitted(false), 8000)
      } else {
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Lass uns sprechen
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Buche deine Demo oder kontaktiere uns für Fragen zu PILAR SYSTEMS
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Demo buchen</h2>
              <p className="text-gray-400 mb-8">
                Fülle das Formular aus und wir melden uns innerhalb von 24 Stunden bei dir.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/50 text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Vielen Dank!</h3>
                  <p className="text-gray-400">
                    Wir haben deine Anfrage erhalten und melden uns bald bei dir.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="Max Mustermann"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="max@studio.de"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="+49 123 456789"
                    />
                  </div>

                  <div>
                    <label htmlFor="studioName" className="block text-sm font-medium text-gray-300 mb-2">
                      Studio Name *
                    </label>
                    <input
                      type="text"
                      id="studioName"
                      name="studioName"
                      required
                      value={formData.studioName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="Mein Fitnessstudio"
                    />
                  </div>

                  <div>
                    <label htmlFor="studioSize" className="block text-sm font-medium text-gray-300 mb-2">
                      Studio-Größe *
                    </label>
                    <select
                      id="studioSize"
                      name="studioSize"
                      required
                      value={formData.studioSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="small">Klein (bis 200 Mitglieder)</option>
                      <option value="medium">Mittel (200-500 Mitglieder)</option>
                      <option value="large">Groß (500+ Mitglieder)</option>
                      <option value="chain">Kette (mehrere Standorte)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors resize-none"
                      placeholder="Erzähl uns von deinem Studio und deinen Herausforderungen..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Demo buchen
                    <Send className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    Mit dem Absenden stimmst du unserer{' '}
                    <a href="/datenschutz" className="text-cyan-400 hover:underline">
                      Datenschutzerklärung
                    </a>{' '}
                    zu.
                  </p>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Kontaktinformationen</h2>
                <p className="text-gray-400 mb-8">
                  Du kannst uns auch direkt kontaktieren. Wir antworten in der Regel innerhalb von 24 Stunden.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Mail className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">E-Mail</h3>
                    <a href="mailto:hello@pilarsystems.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      hello@pilarsystems.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Phone className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Telefon</h3>
                    <a href="tel:+4912345678" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      +49 (0) 123 456 78
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mo-Fr, 9:00-18:00 Uhr</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <MapPin className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Adresse</h3>
                    <p className="text-gray-400">
                      PILAR SYSTEMS GmbH<br />
                      Musterstraße 123<br />
                      10115 Berlin<br />
                      Deutschland
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30">
                <h3 className="text-xl font-semibold text-white mb-3">Schnelle Antworten?</h3>
                <p className="text-gray-400 mb-4">
                  Schau dir unsere FAQ-Sektion auf der Homepage an. Viele Fragen werden dort bereits beantwortet.
                </p>
                <a href="/#faq" className="text-cyan-400 hover:underline">
                  Zu den FAQs →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Map Section (Placeholder) */}
      <Section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Karte wird hier angezeigt</p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
