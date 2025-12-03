'use client'

import { useState } from 'react'
import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthBadge, AuthDivider } from '@/components/auth'
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

type UserData = {
  full_name: string
  studio_name: string
}

const SignupPage = () => {
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      console.error('Passwörter stimmen nicht überein')
      return
    }
    setLoading(true)
    // TODO: Complete the signUp logic with Supabase
    const userData: UserData = { full_name: fullName, studio_name: studioName }
    console.log('Signup attempt:', userData, email)
    // Simulate loading state
    setTimeout(() => setLoading(false), 2000)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    // TODO: Implement Google OAuth
    console.log('Google signup')
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <AuthLayout>
      <AuthCard>
        {/* Premium Badge */}
        <div className="flex justify-center">
          <AuthBadge icon={<Sparkles className="w-4 h-4" />} delay={0.1}>
            Premium Registrierung
          </AuthBadge>
        </div>

        {/* Gradient Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-center mb-3"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Starte jetzt durch
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white/60 text-center mb-8"
        >
          Erstelle dein kostenloses Konto in wenigen Sekunden
        </motion.p>

        <form onSubmit={handleSubmit}>
          <AuthInput 
            label="Vollständiger Name"
            placeholder="Max Mustermann" 
            icon={<User className="w-5 h-5" />} 
            id="fullName"
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            delay={0.4}
            required 
          />

          <AuthInput 
            label="Studio Name"
            placeholder="Mein Fitnessstudio" 
            icon={<Building className="w-5 h-5" />} 
            id="studioName"
            value={studioName} 
            onChange={(e) => setStudioName(e.target.value)} 
            delay={0.5}
            required 
          />

          <AuthInput 
            label="E-Mail"
            placeholder="deine@email.de" 
            icon={<Mail className="w-5 h-5" />} 
            type="email"
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            delay={0.6}
            required 
          />

          <AuthInput 
            label="Passwort"
            placeholder="Mindestens 8 Zeichen" 
            type="password" 
            icon={<Lock className="w-5 h-5" />} 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            delay={0.7}
            required 
            minLength={8} 
          />

          <AuthInput 
            label="Passwort bestätigen"
            placeholder="Passwort wiederholen" 
            type="password"
            icon={<Lock className="w-5 h-5" />}
            id="confirmPassword"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            delay={0.8}
            required 
          />

          {/* Terms Checkbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="flex items-start gap-3 mb-6"
          >
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              required
            />
            <label htmlFor="terms" className="text-sm text-white/70 leading-relaxed">
              Ich akzeptiere die{' '}
              <a href="/agb" className="text-blue-400 hover:text-blue-300 transition-colors">
                AGB
              </a>
              {' '}und{' '}
              <a href="/datenschutz" className="text-blue-400 hover:text-blue-300 transition-colors">
                Datenschutzerklärung
              </a>
            </label>
          </motion.div>

          {/* Primary Signup Button */}
          <AuthButton 
            type="submit" 
            variant="primary" 
            loading={loading}
            disabled={!acceptedTerms}
            delay={1.0}
            icon={<Sparkles className="w-5 h-5" />}
          >
            {loading ? 'Konto wird erstellt...' : 'Kostenloses Konto erstellen'}
          </AuthButton>
        </form>

        {/* Divider */}
        <AuthDivider text="oder" delay={1.1} />

        {/* Google Signup Button */}
        <AuthButton 
          variant="secondary" 
          onClick={handleGoogleSignup}
          delay={1.2}
          disabled={loading}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          }
        >
          Mit Google registrieren
        </AuthButton>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          className="text-center text-white/60 text-sm mt-6"
        >
          Bereits registriert?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Jetzt anmelden
          </a>
        </motion.p>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignupPage
