'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthDivider } from '@/components/auth'
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }

    // Validate password length
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            studio_name: studioName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      router.push('/checkout')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen')
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
            <span className="text-sm text-cyan-300">Jetzt starten</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Konto erstellen
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AuthInput
              placeholder="Vollständiger Name"
              icon={<User className="h-5 w-5" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              delay={0}
            />
            <AuthInput
              placeholder="Studio Name"
              icon={<Building className="h-5 w-5" />}
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              required
              delay={0.1}
            />
            <AuthInput
              placeholder="E-Mail Adresse"
              type="email"
              icon={<Mail className="h-5 w-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              delay={0.2}
            />
            <AuthInput
              placeholder="Passwort (mind. 8 Zeichen)"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              delay={0.3}
            />
            <AuthInput
              placeholder="Passwort bestätigen"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              delay={0.4}
            />
          </motion.div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <AuthButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<Sparkles className="h-5 w-5" />}
          >
            Registrieren
          </AuthButton>
        </form>

        <AuthDivider text="oder" delay={0.5} />

        <p className="text-center text-gray-400 text-sm">
          Bereits ein Konto?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Jetzt anmelden
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
