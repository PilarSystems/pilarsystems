'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Erfolgreich angemeldet!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Bitte E-Mail-Adresse eingeben')
      return
    }

    setMagicLinkLoading(true)

    try {
      const { error } = await getSupabase().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success('Magic Link wurde an Ihre E-Mail gesendet!')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Magic Link konnte nicht gesendet werden'
      toast.error(message)
    } finally {
      setMagicLinkLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 rounded-full bg-cyan-600/15 blur-[80px]" />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="text-2xl font-bold text-white">
          PILAR<span className="text-blue-500"> SYSTEMS</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full bg-gray-900/80 backdrop-blur-xl border-gray-800">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm mx-auto mb-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">KI-Plattform für Studios</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Willkommen zurück</CardTitle>
            <CardDescription className="text-gray-400">
              Melden Sie sich an, um Ihr Dashboard zu öffnen
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-right">
                <Link href="/reset-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Passwort vergessen?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={loading}
              >
                {loading ? 'Wird angemeldet...' : 'Anmelden'}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-500">oder</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleMagicLink}
                disabled={magicLinkLoading}
              >
                {magicLinkLoading ? 'Wird gesendet...' : 'Magic Link senden'}
              </Button>

              <p className="text-center text-sm text-gray-400">
                Noch kein Konto?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                  Jetzt registrieren
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 z-10">
        <p className="text-center text-sm text-gray-500">
          © 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  )
}