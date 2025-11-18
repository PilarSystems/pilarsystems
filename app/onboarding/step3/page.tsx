'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function OnboardingStep3() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState([
    { name: 'Probetraining', price: '0', description: 'Free trial session' },
    { name: 'Monatsmitgliedschaft', price: '79', description: 'Monthly membership' },
  ])

  const addOffer = () => {
    setOffers([...offers, { name: '', price: '', description: '' }])
  }

  const removeOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index))
  }

  const updateOffer = (index: number, field: string, value: string) => {
    const newOffers = [...offers]
    newOffers[index] = { ...newOffers[index], [field]: value }
    setOffers(newOffers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, offers }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Offers saved')
      router.push('/onboarding/step4')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={3}
      title="Offers & Pricing"
      description="Define your studio's offers and pricing"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {offers.map((offer, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Offer {index + 1}</h3>
              {offers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOffer(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Offer Name *</Label>
                <Input
                  value={offer.name}
                  onChange={(e) => updateOffer(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price (€) *</Label>
                <Input
                  type="number"
                  value={offer.price}
                  onChange={(e) => updateOffer(index, 'price', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={offer.description}
                onChange={(e) => updateOffer(index, 'description', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addOffer}>
          Add Another Offer
        </Button>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step2')}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}
