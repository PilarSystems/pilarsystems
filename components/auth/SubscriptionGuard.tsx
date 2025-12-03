'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface SubscriptionGuardProps {
  children: React.ReactNode
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch('/api/auth/check-subscription')
        
        if (!response.ok) {
          // Server error - redirect to login for safety
          router.push('/login')
          return
        }

        const data = await response.json()

        if (!data.authenticated) {
          router.push('/login')
          return
        }

        if (!data.hasActiveSubscription) {
          router.push('/checkout')
          return
        }

        setHasSubscription(true)
      } catch {
        // Network error - redirect to login
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Lade...</p>
        </div>
      </div>
    )
  }

  if (!hasSubscription) {
    return null
  }

  return <>{children}</>
}
