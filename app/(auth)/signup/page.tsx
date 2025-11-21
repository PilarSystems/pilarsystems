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
import { getAuthErrorMessage, validatePassword, validateEmail } from '@/lib/auth-errors'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)

  const passwordValidation = validatePassword(password)
  const emailValid = validateEmail(email)
  const passwordsMatch = password === confirmPassword

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailValid) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message || 'Passwort erfüllt nicht die Anforderungen')
      return
    }

    if (!passwordsMatch) {
      toast.error('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            studio_name: studioName,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      })

      if (error) {
        throw new Error(getAuthErrorMessage(error))
      }

      toast.success('Konto erfolgreich erstellt! Bitte prüfen Sie Ihre E-Mail.')
      
      router.push('/verify-email')
    } catch (error: any) {
      toast.error(error.message || 'Konto konnte nicht erstellt werden')
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
          <CardTitle className="text-2xl font-bold">Konto erstellen</CardTitle>
          <CardDescription>
            Starten Sie jetzt mit PILAR SYSTEMS
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Max Mustermann"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studioName">Studio Name</Label>
              <Input
                id="studioName"
                type="text"
                placeholder="Mein Fitness Studio"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
              />
            </div>
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
                onBlur={() => setPasswordTouched(true)}
                required
                className={passwordTouched && !passwordValidation.valid ? 'border-red-500' : ''}
              />
              {passwordTouched && password && !passwordValidation.valid && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{passwordValidation.message}</span>
                </div>
              )}
              {passwordTouched && passwordValidation.valid && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwort erfüllt alle Anforderungen</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Min. 8 Zeichen, Groß- und Kleinbuchstaben, eine Zahl
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                required
                className={confirmTouched && confirmPassword && !passwordsMatch ? 'border-red-500' : ''}
              />
              {confirmTouched && confirmPassword && !passwordsMatch && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Passwörter stimmen nicht überein</span>
                </div>
              )}
              {confirmTouched && confirmPassword && passwordsMatch && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwörter stimmen überein</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </Button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Bereits ein Konto?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Jetzt anmelden
              </Link>
            </p>
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Mit der Registrierung stimmen Sie unseren AGB und Datenschutzbestimmungen zu
            </p>
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </div>
  )
}
