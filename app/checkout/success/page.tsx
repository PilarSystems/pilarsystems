'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Loader2, ArrowRight, PartyPopper, Rocket } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Verify the session and set up workspace
    const verifySession = async () => {
      if (!sessionId) {
        // No session ID, redirect to checkout
        router.push('/checkout')
        return
      }

      // Short delay to allow webhooks to process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
    }

    verifySession()
  }, [sessionId, router])

  useEffect(() => {
    if (loading) return

    // Countdown and auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/onboarding')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Setting up your account...</p>
          <p className="text-sm text-muted-foreground">This will only take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 relative">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <PartyPopper className="w-8 h-8 absolute -top-2 -right-2 text-yellow-500 animate-bounce" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Welcome to PILAR!</CardTitle>
          <CardDescription className="text-base">
            Your 14-day free trial has started successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              What&apos;s next?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Set up your studio profile and branding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Configure your AI assistant preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Connect your communication channels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span>Start automating your lead management</span>
              </li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push('/onboarding')}
            >
              Start Setup
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Redirecting to onboarding in {countdown} seconds...
            </p>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>
              Need help? Contact us at{' '}
              <a href="mailto:support@pilarsystems.de" className="underline hover:text-foreground">
                support@pilarsystems.de
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
