'use client'

import { useState } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { AuthBadge } from '@/components/auth/AuthBadge'
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
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
    
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }
    setLoading(true)
    // TODO: Add Supabase signUp with user metadata
    setLoading(false)
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-6">
          <AuthBadge icon={<Sparkles className="h-4 w-4 text-blue-400" />}>
            <span className="text-sm text-blue-300">Jetzt registrieren</span>
          </AuthBadge>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Studio erstellen
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <AuthInput
              placeholder="Vollständiger Name"
              icon={<User className="h-5 w-5" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <AuthInput
              placeholder="Studio Name"
              icon={<Building className="h-5 w-5" />}
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              required
            />
            <AuthInput
              placeholder="E-Mail"
              icon={<Mail className="h-5 w-5" />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              placeholder="Passwort"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <AuthInput
              placeholder="Passwort bestätigen"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </motion.div>
          <div className="mt-6">
            <AuthButton type="submit" loading={loading}>
              Registrieren
            </AuthButton>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
