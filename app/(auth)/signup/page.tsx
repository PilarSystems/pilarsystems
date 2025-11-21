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
import { Mail, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

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

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Diese E-Mail-Adresse ist bereits registriert')
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Passwort muss mindestens 8 Zeichen lang sein')
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Ungültige E-Mail-Adresse')
        }
        throw error
      }

      setRegisteredEmail(email)
      setEmailSent(true)
    } catch (error: any) {
      toast.error(error.message || 'Konto konnte nicht erstellt werden')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full bg-gray-900/80 backdrop-blur-sm border-gray-800">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Bitte bestätige deine E-Mail-Adresse
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Wir haben eine Bestätigungs-E-Mail an
              </CardDescription>
              <p className="text-blue-400 font-medium text-lg">
                {registeredEmail}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Prüfe deinen Posteingang und klicke auf den Bestätigungslink
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Schaue auch im Spam-Ordner nach, falls die E-Mail nicht ankommt
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Nach der Bestätigung kannst du dich anmelden und loslegen
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Zurück zum Login
              </Button>
              <p className="text-xs text-center text-gray-500">
                E-Mail nicht erhalten?{' '}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Erneut versuchen
                </button>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Konto erstellen</CardTitle>
          <CardDescription className="text-gray-400">
            Starten Sie jetzt mit PILAR SYSTEMS
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-200">Vollständiger Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Max Mustermann"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studioName" className="text-gray-200">Studio Name</Label>
              <Input
                id="studioName"
                type="text"
                placeholder="Mein Fitness Studio"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors" 
              disabled={loading}
            >
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </Button>
            <p className="text-sm text-center text-gray-400">
              Bereits ein Konto?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Jetzt anmelden
              </Link>
            </p>
            <p className="text-xs text-center text-gray-500">
              Mit der Registrierung stimmen Sie unseren AGB und Datenschutzbestimmungen zu
            </p>
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </div>
  )
}
