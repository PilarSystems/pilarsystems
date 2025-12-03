'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { CHECKOUT_CONTENT } from '@/lib/constants/checkout'
import {
  Shield,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Phone,
  Calendar,
  BarChart3,
  Users,
  Zap,
  RefreshCcw,
} from 'lucide-react'

// Plan configuration
const PLANS = {
  BASIC: {
    name: 'PILAR BASIC',
    price: 100,
    yearlyPrice: 960, // 20% discount
    setupFee: 500,
    description: 'Perfect for small studios getting started with AI automation',
    features: [
      { icon: Users, text: 'Lead Management', description: 'Organize and track all your leads' },
      { icon: Zap, text: 'Basic AI Automation', description: 'Automated responses and follow-ups' },
      { icon: MessageSquare, text: 'Email Integration', description: 'Connect your email accounts' },
      { icon: Calendar, text: 'Calendar Sync', description: 'Sync with Google Calendar' },
      { icon: Users, text: 'Up to 2 team members', description: 'Collaborate with your team' },
      { icon: BarChart3, text: 'Basic Analytics', description: 'Track key metrics' },
    ],
  },
  PRO: {
    name: 'PILAR PRO',
    price: 149,
    yearlyPrice: 1428, // 20% discount
    setupFee: 1000,
    description: 'For growing studios that want the full AI-powered experience',
    features: [
      { icon: CheckCircle2, text: 'Everything in BASIC', description: 'All basic features included' },
      { icon: Sparkles, text: 'Advanced AI Automation', description: 'Smart lead classification & priority' },
      { icon: Phone, text: 'Phone AI Integration', description: 'AI-powered phone handling' },
      { icon: MessageSquare, text: 'WhatsApp Integration', description: 'Full WhatsApp automation' },
      { icon: Users, text: 'Unlimited team members', description: 'No team size limits' },
      { icon: BarChart3, text: 'Advanced Analytics', description: 'Detailed insights & reports' },
      { icon: Zap, text: 'Custom AI Rules', description: 'Configure AI behavior' },
      { icon: Shield, text: 'Priority Support', description: '24/7 dedicated support' },
    ],
  },
} as const

const WHATSAPP_ADDON = {
  name: 'WhatsApp AI Add-on',
  price: 20,
  description: 'AI-powered WhatsApp automation for customer communication',
}

// Error messages for user-friendly display
const ERROR_MESSAGES: Record<string, string> = {
  'Failed to create checkout session': 'Unable to start checkout. Please try again.',
  'You already have an active subscription': 'You already have an active subscription. Visit your dashboard to manage it.',
  'Plan configuration error': 'There was an issue with plan configuration. Please contact support.',
  'Network error': 'Network connection issue. Please check your internet and try again.',
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PRO'>('PRO')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [whatsappAddon, setWhatsappAddon] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; user_metadata?: { full_name?: string } } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await getSupabase().auth.getUser()
        if (!user) {
          router.push('/signup?redirect=/checkout')
          return
        }
        setUser(user as { id: string; email: string; user_metadata?: { full_name?: string } })
        
        // Check for affiliate reference in URL or localStorage
        const ref = searchParams.get('ref') || localStorage.getItem('affiliateRef')
        if (ref) {
          setAffiliateRef(ref)
          localStorage.setItem('affiliateRef', ref)
        }
        
        // Check for pre-selected plan from URL
        const planParam = searchParams.get('plan')?.toUpperCase()
        if (planParam === 'BASIC' || planParam === 'PRO') {
          setSelectedPlan(planParam)
        }
        
        // Check for billing cycle from URL
        const cycleParam = searchParams.get('cycle')?.toLowerCase()
        if (cycleParam === 'yearly') {
          setBillingCycle('yearly')
        }
      } catch {
        toast.error('Failed to load user information')
      } finally {
        setInitialLoading(false)
      }
    }
    checkUser()
  }, [router, searchParams])

  const handleCheckout = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          billingCycle,
          whatsappAddon,
          userId: user.id,
          email: user.email,
          affiliateRef: affiliateRef || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = ERROR_MESSAGES[data.error] || data.error || 'Failed to start checkout'
        throw new Error(errorMessage)
      }

      // Clear affiliate ref after successful checkout initiation
      localStorage.removeItem('affiliateRef')
      
      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
    }
  }, [user, selectedPlan, billingCycle, whatsappAddon, affiliateRef])

  const selectedPlanData = PLANS[selectedPlan]
  const monthlyPrice = selectedPlanData.price + (whatsappAddon ? WHATSAPP_ADDON.price : 0)
  const yearlyPrice = selectedPlanData.yearlyPrice + (whatsappAddon ? WHATSAPP_ADDON.price * 12 : 0)
  const effectiveMonthlyPrice = billingCycle === 'yearly' ? yearlyPrice / 12 : monthlyPrice
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice
  const totalDueToday = (billingCycle === 'yearly' ? yearlyPrice : monthlyPrice) + selectedPlanData.setupFee
  const subscriptionPeriod = billingCycle === 'yearly' ? 'first year subscription' : 'first month subscription'

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Select the plan that best fits your studio. Cancel anytime with no commitments.
          </p>
          {user?.email && (
            <p className="text-sm text-muted-foreground mt-2">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 p-1.5 bg-muted rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS.BASIC][]).map(([key, plan]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedPlan === key
                  ? 'ring-2 ring-primary shadow-lg scale-[1.02]'
                  : 'hover:shadow-md hover:scale-[1.01]'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              {key === 'PRO' && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === key ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {selectedPlan === key && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold">
                      €{billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Billed €{plan.yearlyPrice} yearly (save €{(plan.price * 12) - plan.yearlyPrice})
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time setup fee: €{plan.setupFee}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <feature.icon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{feature.text}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                whatsappAddon ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => setWhatsappAddon(!whatsappAddon)}
            >
              <Checkbox
                id="whatsapp"
                checked={whatsappAddon}
                onCheckedChange={(checked) => setWhatsappAddon(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="whatsapp" className="text-sm font-medium cursor-pointer">
                    {WHATSAPP_ADDON.name}
                  </label>
                  <span className="text-sm font-semibold">+€{WHATSAPP_ADDON.price}/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{WHATSAPP_ADDON.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{selectedPlanData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-medium capitalize">{billingCycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} subscription
              </span>
              <span>€{billingCycle === 'yearly' ? selectedPlanData.yearlyPrice : selectedPlanData.price}</span>
            </div>
            {whatsappAddon && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{WHATSAPP_ADDON.name}</span>
                <span>+€{billingCycle === 'yearly' ? WHATSAPP_ADDON.price * 12 : WHATSAPP_ADDON.price}/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>One-time setup fee</span>
              <span>€{selectedPlanData.setupFee}</span>
            </div>
            {billingCycle === 'yearly' && yearlySavings > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Yearly savings</span>
                <span>-€{yearlySavings}</span>
              </div>
            )}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Monthly cost</p>
                </div>
                <span className="text-xl font-bold">€{Math.round(effectiveMonthlyPrice)}/mo</span>
              </div>
            </div>
            <div className="pt-3 border-t bg-muted/50 -mx-6 px-6 py-4 -mb-6 rounded-b-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Due today</p>
                  <p className="text-xs text-muted-foreground">First payment + setup fee</p>
                </div>
                <span className="text-2xl font-bold text-primary">€{totalDueToday}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Includes setup fee of €{selectedPlanData.setupFee} and {subscriptionPeriod}.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-6">
            {error && (
              <div className="w-full p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-destructive/80 hover:text-destructive underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <Button
              className="w-full h-12 text-base font-semibold"
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <Lock className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-medium">{CHECKOUT_CONTENT.TRUST_SIGNALS.SSL.TITLE}</p>
            <p className="text-xs text-muted-foreground">{CHECKOUT_CONTENT.TRUST_SIGNALS.SSL.DESCRIPTION}</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-medium">{CHECKOUT_CONTENT.TRUST_SIGNALS.PAYMENTS.TITLE}</p>
            <p className="text-xs text-muted-foreground">{CHECKOUT_CONTENT.TRUST_SIGNALS.PAYMENTS.DESCRIPTION}</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-medium">{CHECKOUT_CONTENT.TRUST_SIGNALS.GDPR.TITLE}</p>
            <p className="text-xs text-muted-foreground">{CHECKOUT_CONTENT.TRUST_SIGNALS.GDPR.DESCRIPTION}</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <RefreshCcw className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-medium">{CHECKOUT_CONTENT.TRUST_SIGNALS.CANCEL.TITLE}</p>
            <p className="text-xs text-muted-foreground">{CHECKOUT_CONTENT.TRUST_SIGNALS.CANCEL.DESCRIPTION}</p>
          </div>
        </div>

        {/* GDPR Notice */}
        <div className="text-center text-xs text-muted-foreground max-w-2xl mx-auto space-y-2">
          <p>
            By proceeding, you agree to our{' '}
            <a href="/agb" className="underline hover:text-foreground">Terms of Service</a>{' '}
            and{' '}
            <a href="/datenschutz" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
          <p>{CHECKOUT_CONTENT.PRIVACY_STATEMENT}</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
