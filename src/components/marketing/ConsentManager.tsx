'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Cookie, Shield } from 'lucide-react'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true, // Always true
  analytics: false,
  marketing: false,
  timestamp: 0,
}

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent-v2')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ConsentPreferences
        setPreferences(parsed)
        loadScripts(parsed)
      } catch (e) {
        setShowBanner(true)
      }
    } else {
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const loadScripts = (prefs: ConsentPreferences) => {
    if (prefs.analytics && typeof window !== 'undefined') {
      console.log('Analytics consent granted, loading scripts...')
    }

    if (prefs.marketing && typeof window !== 'undefined') {
      console.log('Marketing consent granted, loading scripts...')
    }
  }

  const savePreferences = (prefs: ConsentPreferences) => {
    const toSave = {
      ...prefs,
      timestamp: Date.now(),
    }
    localStorage.setItem('cookie-consent-v2', JSON.stringify(toSave))
    setPreferences(toSave)
    loadScripts(toSave)
    setShowBanner(false)
    setShowDetails(false)
  }

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  const saveCustom = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Close button */}
            <button
              onClick={acceptNecessary}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Schließen"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>

            <div className="p-6 md:p-8">
              {!showDetails ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-cyan-500/10">
                      <Cookie className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Wir respektieren deine Privatsphäre
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Wir verwenden Cookies, um dir die beste Erfahrung auf unserer Website zu bieten. 
                        Technisch notwendige Cookies sind immer aktiv. Du kannst optional Analytics und 
                        Marketing-Cookies aktivieren.{' '}
                        <a href="/datenschutz" className="text-cyan-400 hover:underline">
                          Mehr erfahren
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                      onClick={() => setShowDetails(true)}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      Einstellungen
                    </Button>
                    <Button
                      onClick={acceptNecessary}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      Nur Notwendige
                    </Button>
                    <Button
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      Alle akzeptieren
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Cookie-Einstellungen
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Necessary cookies */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            Notwendige Cookies
                          </h4>
                          <p className="text-sm text-gray-400">
                            Diese Cookies sind für die Grundfunktionen der Website erforderlich und 
                            können nicht deaktiviert werden.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Immer aktiv</span>
                          <div className="w-12 h-6 rounded-full bg-cyan-500 flex items-center justify-end px-1">
                            <div className="w-4 h-4 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics cookies */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            Analytics Cookies
                          </h4>
                          <p className="text-sm text-gray-400">
                            Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website 
                            interagieren. Alle Daten sind anonymisiert.
                          </p>
                        </div>
                        <button
                          onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.analytics ? 'bg-cyan-500 justify-end' : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                    </div>

                    {/* Marketing cookies */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            Marketing Cookies
                          </h4>
                          <p className="text-sm text-gray-400">
                            Diese Cookies werden verwendet, um Werbung relevanter zu machen und 
                            Affiliate-Partner zu vergüten.
                          </p>
                        </div>
                        <button
                          onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.marketing ? 'bg-cyan-500 justify-end' : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={() => setShowDetails(false)}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      Zurück
                    </Button>
                    <Button
                      onClick={saveCustom}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      Auswahl speichern
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook to check if a specific consent category has been granted
 */
export function useConsent(category: 'necessary' | 'analytics' | 'marketing'): boolean {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent-v2')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ConsentPreferences
        setHasConsent(parsed[category])
      } catch (e) {
        setHasConsent(false)
      }
    }
  }, [category])

  return hasConsent
}
