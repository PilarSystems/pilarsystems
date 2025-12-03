'use client'

import { AuthLayout, AuthCard, AuthInput, AuthButton } from '@/components/auth'
import { Mail, Lock } from 'lucide-react'
import { useState } from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    // TODO: Implement login logic with Supabase
    console.log('Login attempt:', email)
  }

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Willkommen zurück</h1>
        <AuthInput 
          icon={<Mail className="w-5 h-5" />} 
          placeholder="E-Mail" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput 
          icon={<Lock className="w-5 h-5" />} 
          placeholder="Passwort" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthButton onClick={handleLogin}>Anmelden</AuthButton>
      </AuthCard>
    </AuthLayout>
  )
}

export default LoginPage