'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/marketing/Section'
import { CheckCircle2, Copy, QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AffiliateSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [affiliateData, setAffiliateData] = useState<{
    code: string
    referralLink: string
    qrCodeUrl: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      setAffiliateData(data)
      setSubmitted(true)
    } catch (error) {
      alert('Fehler bei der Registrierung. Bitte versuche es erneut.')
    }
  }

  const copyToClipboard = () => {
    if (affiliateData) {
      navigator.clipboard.writeText(affiliateData.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
            className="text-center mb-12"
          >
            <Link
              href="/affiliate"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Übersicht
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {submitted ? 'Willkommen als Partner!' : 'Werde PILAR Partner'}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {submitted
                ? 'Dein Affiliate-Account wurde erfolgreich erstellt. Hier sind deine Referral-Links.'
                : 'Fülle das Formular aus und erhalte sofort deinen persönlichen Referral-Link.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form or Success Section */}
      <Section className="bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                      placeholder="max@beispiel.de"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Firma / Website
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="Meine Firma"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                      Website / Social Media
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Nachricht (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors resize-none"
                    placeholder="Erzähl uns, wie du PILAR empfehlen möchtest..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Jetzt Partner werden
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Mit der Registrierung stimmst du unseren{' '}
                  <a href="/agb" className="text-cyan-400 hover:underline">
                    AGB
                  </a>{' '}
                  und{' '}
                  <a href="/datenschutz" className="text-cyan-400 hover:underline">
                    Datenschutzbestimmungen
                  </a>{' '}
                  zu.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Success Message */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/50 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Erfolgreich registriert!</h3>
                <p className="text-gray-400">
                  Dein Affiliate-Code: <span className="text-cyan-400 font-mono font-semibold">{affiliateData?.code}</span>
                </p>
              </div>

              {/* Referral Link */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Dein Referral-Link</h3>
                <p className="text-gray-400 mb-4">
                  Teile diesen Link mit Fitnessstudios und verdiene Provision für jeden Kunden:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={affiliateData?.referralLink || ''}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white font-mono text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 text-center">
                <h3 className="text-xl font-bold text-white mb-4">QR-Code</h3>
                <p className="text-gray-400 mb-6">
                  Nutze diesen QR-Code für Flyer, Visitenkarten oder Social Media Posts:
                </p>
                {affiliateData?.qrCodeUrl && (
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <Image
                      src={affiliateData.qrCodeUrl}
                      alt="Affiliate QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  Rechtsklick → Bild speichern unter...
                </p>
              </div>

              {/* Next Steps */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Nächste Schritte</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Teile deinen Referral-Link in deinem Netzwerk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Verfolge deine Klicks und Conversions im Dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Erhalte monatliche Provisionen ab 50€ Mindestauszahlung</span>
                  </li>
                </ul>
                <div className="mt-6 flex gap-4">
                  <Link href="/dashboard/affiliate" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      Zum Dashboard
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800">
                      Support kontaktieren
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Section>
    </div>
  )
}
