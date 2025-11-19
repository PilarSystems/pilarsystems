'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'

export default function OnboardingStep4() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string>('')

  const [classificationRules, setClassificationRules] = useState({
    aLeadCriteria: 'Sofortiger Vertragsabschluss, hohe Zahlungsbereitschaft',
    bLeadCriteria: 'Interesse an Probetraining, mittlere Priorität',
    cLeadCriteria: 'Allgemeine Anfrage, niedrige Priorität',
  })

  const [followUpSequences, setFollowUpSequences] = useState({
    probetrainingReminder: {
      enabled: true,
      timing: '24h',
      channel: 'whatsapp',
      message: 'Hallo! Wir freuen uns auf dein Probetraining morgen. Hast du noch Fragen?',
    },
    noShowFollowUp: {
      enabled: true,
      timing: '2h',
      channel: 'whatsapp',
      message: 'Schade, dass wir dich heute nicht sehen konnten. Möchtest du einen neuen Termin vereinbaren?',
    },
    leadNurturing: {
      enabled: true,
      timing: '3d',
      channel: 'email',
      message: 'Hi! Hast du schon über deine Fitness-Ziele nachgedacht? Wir helfen dir gerne dabei.',
    },
  })

  const [automationTriggers, setAutomationTriggers] = useState({
    autoReplyWhatsApp: true,
    autoReplyEmail: true,
    autoClassifyLeads: true,
    autoScheduleFollowUps: true,
    autoCreateCalendarEvents: true,
  })

  useEffect(() => {
    const loadWorkspace = async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/onboarding/workspace?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setWorkspaceId(data.workspaceId)
      }
    }
    loadWorkspace()
  }, [router])

  const handleSubmit = async () => {
    if (!workspaceId) {
      toast.error('Workspace nicht gefunden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/onboarding/step4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          classificationRules,
          followUpSequences,
          automationTriggers,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Automatisierungsregeln gespeichert')
      router.push('/onboarding/step5')
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={4}
      title="Lead-Regeln & Automatisierung"
      description="Definiere, wie dein KI-Assistent Leads klassifiziert und nachfasst"
    >
      <div className="space-y-6">
        {/* Lead Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Lead-Klassifizierung</CardTitle>
            <CardDescription>
              Definiere Kriterien für A-, B- und C-Leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>A-Lead (Höchste Priorität)</Label>
              <Textarea
                value={classificationRules.aLeadCriteria}
                onChange={(e) =>
                  setClassificationRules({
                    ...classificationRules,
                    aLeadCriteria: e.target.value,
                  })
                }
                rows={2}
                placeholder="z.B. Sofortiger Vertragsabschluss, hohe Zahlungsbereitschaft"
              />
            </div>
            <div className="space-y-2">
              <Label>B-Lead (Mittlere Priorität)</Label>
              <Textarea
                value={classificationRules.bLeadCriteria}
                onChange={(e) =>
                  setClassificationRules({
                    ...classificationRules,
                    bLeadCriteria: e.target.value,
                  })
                }
                rows={2}
                placeholder="z.B. Interesse an Probetraining"
              />
            </div>
            <div className="space-y-2">
              <Label>C-Lead (Niedrige Priorität)</Label>
              <Textarea
                value={classificationRules.cLeadCriteria}
                onChange={(e) =>
                  setClassificationRules({
                    ...classificationRules,
                    cLeadCriteria: e.target.value,
                  })
                }
                rows={2}
                placeholder="z.B. Allgemeine Anfrage"
              />
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Sequences */}
        <Card>
          <CardHeader>
            <CardTitle>Nachfass-Sequenzen</CardTitle>
            <CardDescription>
              Automatische Follow-ups für verschiedene Szenarien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Probetraining Reminder */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Probetraining-Erinnerung</h4>
                <input
                  type="checkbox"
                  checked={followUpSequences.probetrainingReminder.enabled}
                  onChange={(e) =>
                    setFollowUpSequences({
                      ...followUpSequences,
                      probetrainingReminder: {
                        ...followUpSequences.probetrainingReminder,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </div>
              {followUpSequences.probetrainingReminder.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zeitpunkt</Label>
                      <Select
                        value={followUpSequences.probetrainingReminder.timing}
                        onValueChange={(value) =>
                          setFollowUpSequences({
                            ...followUpSequences,
                            probetrainingReminder: {
                              ...followUpSequences.probetrainingReminder,
                              timing: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2h">2 Stunden vorher</SelectItem>
                          <SelectItem value="24h">24 Stunden vorher</SelectItem>
                          <SelectItem value="48h">48 Stunden vorher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kanal</Label>
                      <Select
                        value={followUpSequences.probetrainingReminder.channel}
                        onValueChange={(value) =>
                          setFollowUpSequences({
                            ...followUpSequences,
                            probetrainingReminder: {
                              ...followUpSequences.probetrainingReminder,
                              channel: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">E-Mail</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nachricht</Label>
                    <Textarea
                      value={followUpSequences.probetrainingReminder.message}
                      onChange={(e) =>
                        setFollowUpSequences({
                          ...followUpSequences,
                          probetrainingReminder: {
                            ...followUpSequences.probetrainingReminder,
                            message: e.target.value,
                          },
                        })
                      }
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>

            {/* No-Show Follow-up */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">No-Show Nachfass</h4>
                <input
                  type="checkbox"
                  checked={followUpSequences.noShowFollowUp.enabled}
                  onChange={(e) =>
                    setFollowUpSequences({
                      ...followUpSequences,
                      noShowFollowUp: {
                        ...followUpSequences.noShowFollowUp,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </div>
              {followUpSequences.noShowFollowUp.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zeitpunkt</Label>
                      <Select
                        value={followUpSequences.noShowFollowUp.timing}
                        onValueChange={(value) =>
                          setFollowUpSequences({
                            ...followUpSequences,
                            noShowFollowUp: {
                              ...followUpSequences.noShowFollowUp,
                              timing: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2h">2 Stunden danach</SelectItem>
                          <SelectItem value="24h">24 Stunden danach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kanal</Label>
                      <Select
                        value={followUpSequences.noShowFollowUp.channel}
                        onValueChange={(value) =>
                          setFollowUpSequences({
                            ...followUpSequences,
                            noShowFollowUp: {
                              ...followUpSequences.noShowFollowUp,
                              channel: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">E-Mail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nachricht</Label>
                    <Textarea
                      value={followUpSequences.noShowFollowUp.message}
                      onChange={(e) =>
                        setFollowUpSequences({
                          ...followUpSequences,
                          noShowFollowUp: {
                            ...followUpSequences.noShowFollowUp,
                            message: e.target.value,
                          },
                        })
                      }
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Automation Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Automatisierungs-Trigger</CardTitle>
            <CardDescription>
              Welche Aktionen soll die KI automatisch ausführen?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Automatische WhatsApp-Antworten</Label>
              <input
                type="checkbox"
                checked={automationTriggers.autoReplyWhatsApp}
                onChange={(e) =>
                  setAutomationTriggers({
                    ...automationTriggers,
                    autoReplyWhatsApp: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Automatische E-Mail-Antworten</Label>
              <input
                type="checkbox"
                checked={automationTriggers.autoReplyEmail}
                onChange={(e) =>
                  setAutomationTriggers({
                    ...automationTriggers,
                    autoReplyEmail: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Automatische Lead-Klassifizierung</Label>
              <input
                type="checkbox"
                checked={automationTriggers.autoClassifyLeads}
                onChange={(e) =>
                  setAutomationTriggers({
                    ...automationTriggers,
                    autoClassifyLeads: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Automatische Follow-Up Planung</Label>
              <input
                type="checkbox"
                checked={automationTriggers.autoScheduleFollowUps}
                onChange={(e) =>
                  setAutomationTriggers({
                    ...automationTriggers,
                    autoScheduleFollowUps: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Automatische Kalender-Termine</Label>
              <input
                type="checkbox"
                checked={automationTriggers.autoCreateCalendarEvents}
                onChange={(e) =>
                  setAutomationTriggers({
                    ...automationTriggers,
                    autoCreateCalendarEvents: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/onboarding/step3')}>
            Zurück
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Wird gespeichert...' : 'Weiter'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
