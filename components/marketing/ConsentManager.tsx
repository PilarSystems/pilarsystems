'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Cookie } from 'lucide-react'

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-4xl bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Cookie-Einstellungen</h3>
                  <p className="text-sm text-gray-400">
                    Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten.
                    Weitere Informationen finden Sie in unserer{' '}
                    <a href="/datenschutz" className="text-cyan-400 hover:underline">
                      Datenschutzerklärung
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-initial border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={handleDecline}
                >
                  Ablehnen
                </Button>
                <Button
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-blue-600"
                  onClick={handleAccept}
                >
                  Akzeptieren
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
