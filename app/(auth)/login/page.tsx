'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthDivider } from '@/components/auth'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      setError(null)
      alert('Magic Link wurde gesendet! Überprüfe deine E-Mails.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Senden des Magic Links')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-sm mb-4">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Willkommen zurück</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Anmelden
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            icon={<Mail className="h-5 w-5" />}
            placeholder="E-Mail Adresse"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput
            icon={<Lock className="h-5 w-5" />}
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <AuthButton type="submit" fullWidth loading={loading}>
            Anmelden
          </AuthButton>
        </form>

        <AuthDivider text="oder" delay={0.3} />

        <AuthButton
          variant="secondary"
          fullWidth
          onClick={handleMagicLink}
          loading={loading}
          icon={<Sparkles className="h-5 w-5" />}
        >
          Magic Link senden
        </AuthButton>

        <p className="text-center text-gray-400 text-sm mt-6">
          Noch kein Konto?{' '}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Jetzt registrieren
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}