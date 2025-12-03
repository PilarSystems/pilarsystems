'use client'

import { useState } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Add Supabase authentication
    console.log('Login attempt:', { email, password })
    setLoading(false)
  }

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 text-center">
          Willkommen zurück
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            icon={<Mail className="h-5 w-5" />}
            placeholder="E-Mail"
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
          <AuthButton type="submit" loading={loading}>
            Anmelden
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}