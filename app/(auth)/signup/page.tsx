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

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Bitte geben Sie Ihren vollständigen Namen ein')
      return
    }

    if (!studioName.trim()) {
      toast.error('Bitte geben Sie Ihren Studio-Namen ein')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    if (password.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen lang sein')
      return
    }

    if (password !== confirmPassword) {
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
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Diese E-Mail-Adresse ist bereits registriert')
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Passwort muss mindestens 8 Zeichen lang sein')
        }
        if (error.message.includes('Unable to validate email')) {
          throw new Error('Ungültige E-Mail-Adresse')
        }
        throw new Error(error.message)
      }

      toast.success('Konto erfolgreich erstellt! 🎉', {
        description: 'Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre E-Mail-Adresse.',
        duration: 8000,
      })
      
      router.push('/checkout')
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
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
