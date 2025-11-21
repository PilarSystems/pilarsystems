'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getAuthErrorMessage, validateEmail } from '@/lib/auth-errors'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const emailValid = validateEmail(email)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailValid) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    if (!password) {
      toast.error('Bitte geben Sie Ihr Passwort ein')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(getAuthErrorMessage(error))
      }

      toast.success('Erfolgreich angemeldet! Willkommen zurück.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Anmeldung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!emailValid) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setLoading(true)

    try {
      const { error } = await getSupabase().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        throw new Error(getAuthErrorMessage(error))
      }

      toast.success('Magic Link wurde an Ihre E-Mail gesendet. Bitte prüfen Sie Ihr Postfach.')
    } catch (error: any) {
      toast.error(error.message || 'Magic Link konnte nicht gesendet werden')
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
          <CardTitle className="text-2xl font-bold">Willkommen zurück</CardTitle>
          <CardDescription>
            Melden Sie sich bei Ihrem PILAR SYSTEMS Konto an
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>
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
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Noch kein Konto?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
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
