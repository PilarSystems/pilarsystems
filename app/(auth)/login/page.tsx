'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (!email.trim() || !email.includes('@')) {
      const msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    if (!password.trim()) {
      const msg = 'Bitte geben Sie Ihr Passwort ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let msg = error.message || 'Anmeldung fehlgeschlagen'

        if (error.message.includes('Invalid login credentials')) {
          msg = 'E-Mail oder Passwort ist falsch'
        } else if (error.message.includes('Email not confirmed')) {
          msg =
            'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr Postfach (auch Spam-Ordner).'
        } else if (error.message.includes('Invalid email')) {
          msg = 'Ungültige E-Mail-Adresse'
        }

        setFormError(msg)
        toast.error(msg)
        return
      }

      toast.success('Erfolgreich angemeldet! Willkommen zurück.')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err?.message || 'Anmeldung fehlgeschlagen'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setFormError(null)

    if (!email.trim() || !email.includes('@')) {
      const msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        const msg = error.message || 'Magic Link konnte nicht gesendet werden'
        setFormError(msg)
        toast.error(msg)
        return
      }

      toast.success(
        'Magic Link wurde an Ihre E-Mail gesendet. Bitte prüfen Sie Ihr Postfach (auch Spam-Ordner).',
        { duration: 6000 },
      )
    } catch (err: any) {
      const msg = err?.message || 'Magic Link konnte nicht gesendet werden'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Willkommen zurück</CardTitle>
            <CardDescription className="text-gray-300">
              Melden Sie sich bei Ihrem PILAR SYSTEMS Konto an
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Passwort
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Passwort vergessen?
                </Link>
              </div>

              {formError && (
                <p className="text-sm text-red-400">
                  {formError}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Anmeldung läuft...' : 'Anmelden'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleMagicLink}
                disabled={loading || !email}
              >
                Magic Link senden
              </Button>
              <p className="text-sm text-center text-gray-300">
                Noch kein Konto?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
                  Jetzt registrieren
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
