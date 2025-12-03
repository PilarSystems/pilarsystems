'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Building, Mail, Lock, Sparkles, Check } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [studioName, setStudioName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Name ist erforderlich'
    }
    if (!studioName.trim()) {
      newErrors.studioName = 'Studio-Name ist erforderlich'
    }
    if (!email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }
    if (!password) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen haben'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
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
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/checkout`,
        },
      })

      if (error) throw error

      if (data.user && !data.session) {
        // Email verification required
        router.push('/verify-email')
      } else {
        // Direct signup success (no email verification)
        toast.success('Konto erfolgreich erstellt!')
        router.push('/checkout')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    '24/7 KI-Rezeption',
    'WhatsApp & Phone AI',
    'Lead-Management',
    'Automatische Follow-ups',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 py-12">
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
              <span className="text-sm text-white/80">Starten Sie heute</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Konto erstellen</CardTitle>
            <CardDescription className="text-gray-400">
              Automatisieren Sie Ihr Fitnessstudio mit KI
            </CardDescription>
            
            {/* Feature list */}
            <div className="grid grid-cols-2 gap-2 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Check className="w-4 h-4 text-green-400" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">Ihr Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Max Mustermann"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-400">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studioName" className="text-gray-300">Studio-Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="studioName"
                    type="text"
                    placeholder="Mein Fitness Studio"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.studioName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.studioName && <p className="text-sm text-red-400">{errors.studioName}</p>}
              </div>

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
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mindestens 8 Zeichen"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Passwort bestätigen</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Passwort wiederholen"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={loading}
              >
                {loading ? 'Wird erstellt...' : 'Kostenlos starten'}
              </Button>

              <p className="text-center text-sm text-gray-400">
                Bereits ein Konto?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  Jetzt anmelden
                </Link>
              </p>

              <p className="text-center text-xs text-gray-500">
                Mit der Registrierung akzeptieren Sie unsere{' '}
                <Link href="/legal/terms" className="text-blue-400 hover:text-blue-300">AGB</Link>
                {' '}und{' '}
                <Link href="/legal/privacy" className="text-blue-400 hover:text-blue-300">Datenschutzrichtlinie</Link>
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
