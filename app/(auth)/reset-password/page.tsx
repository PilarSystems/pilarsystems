'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getAuthErrorMessage, validateEmail } from '@/lib/auth-errors'
import { Mail } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const emailValid = validateEmail(email)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailValid) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setLoading(true)

    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        throw new Error(getAuthErrorMessage(error))
      }

      setSent(true)
      toast.success('Passwort-Reset-Link wurde erfolgreich versendet')
    } catch (error: any) {
      toast.error(error.message || 'Reset-Link konnte nicht gesendet werden')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full bg-gray-900 border-gray-800">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center"
                >
                  <Mail className="w-8 h-8 text-cyan-400" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white">E-Mail prüfen</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Wir haben einen Passwort-Reset-Link an <span className="text-cyan-400">{email}</span> gesendet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm text-gray-300">
                  Klicken Sie auf den Link in der E-Mail, um Ihr Passwort zurückzusetzen. Der Link läuft in 1 Stunde ab.
                </p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Keine E-Mail erhalten? Prüfen Sie Ihren Spam-Ordner oder versuchen Sie es erneut.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Zurück zur Anmeldung
                </Button>
              </Link>
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
        <Card className="w-full bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Passwort zurücksetzen</CardTitle>
            <CardDescription className="text-gray-400">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Reset-Link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading || !emailValid}>
                {loading ? 'Wird gesendet...' : 'Reset-Link senden'}
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Zurück zur Anmeldung
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
