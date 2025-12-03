'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) {
        setShowBanner(true)
      }
    })
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-300">
            Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung unserer Website 
            stimmen Sie der Verwendung von Cookies zu.{' '}
            <a href="/datenschutz" className="underline hover:text-white">
              Mehr erfahren
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Ablehnen
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Akzeptieren
          </Button>
        </div>
      </div>
    </div>
  )
}
