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

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!fullName.trim()) {
      const msg = 'Bitte geben Sie Ihren vollständigen Namen ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    if (!studioName.trim()) {
      const msg = 'Bitte geben Sie Ihren Studio-Namen ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    if (!email.trim() || !email.includes('@')) {
      const msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    if (password.length < 8) {
      const msg = 'Passwort muss mindestens 8 Zeichen lang sein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    if (password !== confirmPassword) {
      const msg = 'Passwörter stimmen nicht überein'
      setFormError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            studio_name: studioName,
          },
          // WICHTIG: Kein emailRedirectTo mehr, um den Flow zu simplifizieren
        },
      })

      if (error) {
        let msg = error.message || 'Konto konnte nicht erstellt werden'

        if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          msg = 'Diese E-Mail-Adresse ist bereits registriert'
        }
        if (error.message.includes('Password should be at least')) {
          msg = 'Passwort muss mindestens 8 Zeichen lang sein'
        }
        if (error.message.includes('Invalid email')) {
          msg = 'Ungültige E-Mail-Adresse'
        }

        setFormError(msg)
        toast.error(msg)
        return
      }

      toast.success('Konto erfolgreich erstellt! Bitte schließen Sie jetzt die Zahlung ab.', {
        duration: 6000,
      })
      setFormSuccess('Konto erstellt. Sie werden zum Checkout weitergeleitet...')

      // Direkt ins Checkout – Benutzer ist durch Supabase-Session schon eingeloggt
      router.push('/checkout')
    } catch (err: any) {
      const msg = err?.message || 'Konto konnte nicht erstellt werden'
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
            <CardTitle className="text-2xl font-bold text-white">Konto erstellen</CardTitle>
            <CardDescription className="text-gray-300">
              Starten Sie jetzt mit PILAR SYSTEMS
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-200">
                  Vollständiger Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Max Mustermann"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studioName" className="text-gray-200">
                  Studio Name
                </Label>
                <Input
                  id="studioName"
                  type="text"
                  placeholder="Mein Fitness Studio"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Passwort bestätigen
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-400">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="text-sm text-emerald-400">
                  {formSuccess}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
              </Button>
              <p className="text-sm text-center text-gray-300">
                Bereits ein Konto?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                  Jetzt anmelden
                </Link>
              </p>
              <p className="text-xs text-center text-gray-400">
                Mit der Registrierung stimmen Sie unseren AGB und Datenschutzbestimmungen zu
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
