'use client'

import { useState } from 'react'
import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthBadge } from '@/components/auth'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Complete the signUp logic with Supabase
    const userData: UserData = { full_name: fullName, studio_name: studioName }
    console.log('Signup attempt:', userData, email)
  }

  return (
    <AuthLayout>
      <AuthCard>
        <form onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <AuthInput 
              placeholder="Full Name" 
              icon={<User className="w-5 h-5" />} 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
            <AuthInput 
              placeholder="Studio Name" 
              icon={<Building className="w-5 h-5" />} 
              value={studioName} 
              onChange={(e) => setStudioName(e.target.value)} 
              required 
            />
            <AuthInput 
              placeholder="Email" 
              icon={<Mail className="w-5 h-5" />} 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <AuthInput 
              placeholder="Password" 
              type="password" 
              icon={<Lock className="w-5 h-5" />} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={8} 
            />
            <AuthInput 
              placeholder="Confirm Password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </motion.div>
          <AuthButton type="submit">
            <AuthBadge icon={<Sparkles className="w-4 h-4" />}>Sign Up</AuthBadge>
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignupPage
