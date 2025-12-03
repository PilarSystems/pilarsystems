'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Custom hook to read consent status from localStorage
function useConsentStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback)
      return () => window.removeEventListener('storage', callback)
    },
    () => !localStorage.getItem('cookie-consent'),
    () => false // Server snapshot - don't show banner during SSR
  )
}

export function ConsentManager() {
  const shouldShowBanner = useConsentStatus()
  const [isHidden, setIsHidden] = useState(false)

  const showBanner = shouldShowBanner && !isHidden

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }))
    setIsHidden(true)
    // Trigger storage event for useSyncExternalStore
    window.dispatchEvent(new Event('storage'))
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setIsHidden(true)
    // Trigger storage event for useSyncExternalStore
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-4xl bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <Cookie className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Cookie-Einstellungen
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Wir nutzen Cookies, um dein Erlebnis zu verbessern und unseren Service zu optimieren. 
                  Mehr Infos findest du in unserer{' '}
                  <Link href="/datenschutz" className="text-cyan-400 hover:underline">
                    Datenschutzerklärung
                  </Link>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Alle akzeptieren
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    Nur notwendige
                  </Button>
                </div>
              </div>
              <button
                onClick={acceptNecessary}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
