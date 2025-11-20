'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      return
    }

    if (password.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen lang sein')
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

      if (error) throw error

      toast.success('Konto erstellt! Bitte prüfen Sie Ihre E-Mail zur Verifizierung.')
      
      router.push('/checkout')
    } catch (error: any) {
      toast.error(error.message || 'Konto konnte nicht erstellt werden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
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
    </div>
  )
}
