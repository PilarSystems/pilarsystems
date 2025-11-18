'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PRO'>('BASIC')
  const [whatsappAddon, setWhatsappAddon] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signup')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router])

  const handleCheckout = async () => {
    if (!user) return

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          whatsappAddon,
          userId: user.id,
          email: user.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  const plans = {
    BASIC: {
      name: 'PILAR BASIC',
      price: 100,
      setupFee: 500,
      features: [
        'Lead Management',
        'Basic AI Automation',
        'Email Integration',
        'Calendar Sync',
        'Up to 2 team members',
        'Basic Analytics',
      ],
    },
    PRO: {
      name: 'PILAR PRO',
      price: 149,
      setupFee: 1000,
      features: [
        'Everything in BASIC',
        'Advanced AI Automation',
        'Phone AI Integration',
        'WhatsApp Integration',
        'Unlimited team members',
        'Advanced Analytics',
        'Custom AI Rules',
        'Priority Support',
      ],
    },
  }

  const selectedPlanData = plans[selectedPlan]
  const totalSetupFee = selectedPlanData.setupFee
  const monthlyTotal = selectedPlanData.price + (whatsappAddon ? 20 : 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
                selectedPlan === key
                  ? 'ring-2 ring-blue-600 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(key as 'BASIC' | 'PRO')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {key === 'PRO' && (
                    <Badge variant="default">Most Popular</Badge>
                  )}
                </div>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">€{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <div className="mt-2 text-sm">
                    One-time setup fee: €{plan.setupFee}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                checked={whatsappAddon}
                onCheckedChange={(checked) => setWhatsappAddon(checked as boolean)}
              />
              <label
                htmlFor="whatsapp"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                WhatsApp AI Add-on (+€20/month)
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
              AI-powered WhatsApp automation for customer communication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Plan: {selectedPlanData.name}</span>
              <span>€{selectedPlanData.price}/month</span>
            </div>
            {whatsappAddon && (
              <div className="flex justify-between">
                <span>WhatsApp AI Add-on</span>
                <span>€20/month</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Monthly Total</span>
              <span>€{monthlyTotal}/month</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>One-time setup fee</span>
              <span>€{totalSetupFee}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          14-day free trial. Cancel anytime. No credit card required for trial.
        </p>
      </div>
    </div>
  )
}
