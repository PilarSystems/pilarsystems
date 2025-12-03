'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase'
import { useLocale, type Locale } from '@/lib/i18n'
import { accountSettingsSchema, type AccountSettingsData } from '@/lib/validation'
import { Loader2, User, Mail, Phone, Globe, Bell, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'

/**
 * Account Settings Page
 * 
 * Self-service account customization for Phase C:
 * - Profile information editing
 * - Language preference
 * - Notification settings
 */
export default function AccountSettingsPage() {
  const router = useRouter()
  const { locale, setLocale, t } = useLocale()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<AccountSettingsData>({
    fullName: '',
    email: '',
    phone: '',
    language: locale,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        // Load user profile data
        setFormData(prev => ({
          ...prev,
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          language: (user.user_metadata?.language as Locale) || locale,
        }))
      } catch (error) {
        console.error('Failed to load user data:', error)
        toast.error('Fehler beim Laden der Benutzerdaten')
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [router, locale])

  const validateField = useCallback((name: keyof AccountSettingsData, value: unknown) => {
    try {
      accountSettingsSchema.shape[name].parse(value)
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: err.issues[0]?.message || 'Ungültig' }))
      }
    }
  }, [])

  const handleChange = (name: keyof AccountSettingsData, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'language') {
      setLocale(value as Locale)
    }
  }

  const handleNotificationChange = (type: 'email' | 'push' | 'sms', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        email: prev.notifications?.email ?? true,
        push: prev.notifications?.push ?? true,
        sms: prev.notifications?.sms ?? false,
        [type]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const result = accountSettingsSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.')
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    
    setSaving(true)
    
    try {
      const supabase = getSupabase()
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName.trim(),
          phone: formData.phone?.trim() || null,
          language: formData.language,
          timezone: formData.timezone,
          notifications: formData.notifications,
        },
      })
      
      if (error) {
        throw error
      }
      
      toast.success(locale === 'de' ? 'Einstellungen gespeichert' : 'Settings saved')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error(locale === 'de' ? 'Fehler beim Speichern' : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {locale === 'de' ? 'Konto-Einstellungen' : 'Account Settings'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'de' 
                ? 'Verwalte dein Profil und deine Präferenzen' 
                : 'Manage your profile and preferences'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {locale === 'de' ? 'Profil-Information' : 'Profile Information'}
              </CardTitle>
              <CardDescription>
                {locale === 'de' 
                  ? 'Deine persönlichen Kontaktdaten' 
                  : 'Your personal contact information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {locale === 'de' ? 'Vollständiger Name' : 'Full Name'} *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => validateField('fullName', formData.fullName)}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500">
                    {locale === 'de' 
                      ? 'E-Mail kann nicht geändert werden' 
                      : 'Email cannot be changed'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {locale === 'de' ? 'Telefonnummer' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => validateField('phone', formData.phone)}
                  placeholder="+49 123 456789"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Language and Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {locale === 'de' ? 'Sprache & Region' : 'Language & Region'}
              </CardTitle>
              <CardDescription>
                {locale === 'de' 
                  ? 'Wähle deine bevorzugte Sprache' 
                  : 'Choose your preferred language'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    {locale === 'de' ? 'Sprache' : 'Language'}
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleChange('language', value as Locale)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    {locale === 'de' ? 'Zeitzone' : 'Timezone'}
                  </Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                      <SelectItem value="Europe/Vienna">Wien (CET)</SelectItem>
                      <SelectItem value="Europe/Zurich">Zürich (CET)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {locale === 'de' ? 'Benachrichtigungen' : 'Notifications'}
              </CardTitle>
              <CardDescription>
                {locale === 'de' 
                  ? 'Wähle wie du benachrichtigt werden möchtest' 
                  : 'Choose how you want to be notified'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {locale === 'de' ? 'E-Mail-Benachrichtigungen' : 'Email Notifications'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {locale === 'de' 
                        ? 'Erhalte Updates per E-Mail' 
                        : 'Receive updates via email'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications?.email ?? true}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {locale === 'de' ? 'Push-Benachrichtigungen' : 'Push Notifications'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {locale === 'de' 
                        ? 'Erhalte Push-Benachrichtigungen im Browser' 
                        : 'Receive push notifications in browser'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications?.push ?? true}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {locale === 'de' ? 'SMS-Benachrichtigungen' : 'SMS Notifications'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {locale === 'de' 
                        ? 'Erhalte wichtige Updates per SMS' 
                        : 'Receive important updates via SMS'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications?.sms ?? false}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/settings">
              <Button type="button" variant="outline">
                {locale === 'de' ? 'Abbrechen' : 'Cancel'}
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {locale === 'de' ? 'Wird gespeichert...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {locale === 'de' ? 'Einstellungen speichern' : 'Save Settings'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
