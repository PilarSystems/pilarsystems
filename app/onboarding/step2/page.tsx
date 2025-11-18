'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OnboardingStep2() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hours, setHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>({
    Monday: { open: '09:00', close: '20:00', closed: false },
    Tuesday: { open: '09:00', close: '20:00', closed: false },
    Wednesday: { open: '09:00', close: '20:00', closed: false },
    Thursday: { open: '09:00', close: '20:00', closed: false },
    Friday: { open: '09:00', close: '20:00', closed: false },
    Saturday: { open: '10:00', close: '18:00', closed: false },
    Sunday: { open: '', close: '', closed: true },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, hours }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Opening hours saved')
      router.push('/onboarding/step3')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={2}
      title="Opening Hours"
      description="Set your studio's opening hours"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <div className="w-32">
              <Label>{day}</Label>
            </div>
            <Checkbox
              checked={hours[day].closed}
              onCheckedChange={(checked) =>
                setHours({
                  ...hours,
                  [day]: { ...hours[day], closed: checked as boolean },
                })
              }
            />
            <Label className="text-sm">Closed</Label>
            {!hours[day].closed && (
              <>
                <Input
                  type="time"
                  value={hours[day].open}
                  onChange={(e) =>
                    setHours({
                      ...hours,
                      [day]: { ...hours[day], open: e.target.value },
                    })
                  }
                  className="w-32"
                  required
                />
                <span>to</span>
                <Input
                  type="time"
                  value={hours[day].close}
                  onChange={(e) =>
                    setHours({
                      ...hours,
                      [day]: { ...hours[day], close: e.target.value },
                    })
                  }
                  className="w-32"
                  required
                />
              </>
            )}
          </div>
        ))}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step1')}>
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
