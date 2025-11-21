'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'
import { Loader2, Play } from 'lucide-react'

interface Voice {
  id: string
  name: string
  category: string
  description?: string
}

export default function OnboardingStep3() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingVoices, setLoadingVoices] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [tone, setTone] = useState<'professional' | 'friendly' | 'motivating'>('friendly')
  const [targetAudience, setTargetAudience] = useState<'premium' | 'budget' | 'boutique'>('premium')

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const wsResponse = await fetch(`/api/onboarding/workspace?userId=${user.id}`)
      if (wsResponse.ok) {
        const data = await wsResponse.json()
        setWorkspaceId(data.workspaceId)
      }

      try {
        const voicesResponse = await fetch('/api/voices')
        if (voicesResponse.ok) {
          const data = await voicesResponse.json()
          setVoices(data.voices || [])
        }
      } catch (error) {
        // console.error('Failed to load voices:', error)
      } finally {
        setLoadingVoices(false)
      }
    }
    loadData()
  }, [router])

  const handlePlayPreview = async (voiceId: string) => {
    setPlayingVoice(voiceId)
    
    try {
      const audio = new Audio(`/api/voices/preview?voiceId=${voiceId}`)
      audio.onended = () => setPlayingVoice(null)
      audio.onerror = () => {
        setPlayingVoice(null)
        toast.error('Fehler beim Abspielen der Vorschau')
      }
      await audio.play()
    } catch (error) {
      setPlayingVoice(null)
      toast.error('Fehler beim Abspielen der Vorschau')
    }
  }

  const handleSubmit = async () => {
    if (!selectedVoice) {
      toast.error('Bitte wähle eine Stimme aus')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/onboarding/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          voiceId: selectedVoice,
          tone,
          targetAudience,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('KI-Persönlichkeit gespeichert')
      router.push('/onboarding/step4')
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={3}
      title="KI-Persönlichkeit & Stimme"
      description="Wähle die Stimme und den Ton deines KI-Assistenten"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Kommunikationston</CardTitle>
            <CardDescription>Wie soll dein KI-Assistent kommunizieren?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={tone} onValueChange={(value: any) => setTone(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">Professionell & Sachlich</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly">Freundlich & Locker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="motivating" id="motivating" />
                <Label htmlFor="motivating">Motivierend & Energisch</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zielgruppe</CardTitle>
            <CardDescription>Für welche Art von Studio ist die KI?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={targetAudience} onValueChange={(value: any) => setTargetAudience(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium">Premium-Gym / High-End</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="budget" id="budget" />
                <Label htmlFor="budget">Discounter / Budget-Freundlich</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boutique" id="boutique" />
                <Label htmlFor="boutique">Boutique-Studio / Spezialisiert</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stimmenauswahl</CardTitle>
            <CardDescription>Wähle die Stimme für deinen KI-Assistenten</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVoices ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : voices.length === 0 ? (
              <p className="text-sm text-gray-500">
                Keine Stimmen verfügbar. Bitte konfiguriere ELEVENLABS_API_KEY.
              </p>
            ) : (
              <div className="space-y-3">
                {voices.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedVoice === voice.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{voice.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {voice.category}
                        </p>
                        {voice.description && (
                          <p className="text-xs text-gray-500 mt-1">{voice.description}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayPreview(voice.id)
                        }}
                        disabled={playingVoice === voice.id}
                      >
                        {playingVoice === voice.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="ml-2">Vorschau</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step2')}>
            Zurück
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedVoice}>
            {loading ? 'Wird gespeichert...' : 'Weiter'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
