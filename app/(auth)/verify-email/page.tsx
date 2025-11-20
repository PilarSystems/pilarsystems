'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
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
          <CardTitle className="text-2xl font-bold text-center text-white">E-Mail verifizieren</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Wir haben einen Verifizierungslink an Ihre E-Mail-Adresse gesendet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-gray-300">
              Bitte prüfen Sie Ihre E-Mail und klicken Sie auf den Verifizierungslink, um Ihr Konto zu aktivieren.
            </p>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Nach der Verifizierung werden Sie weitergeleitet, um Ihr Abonnement abzuschließen und das Onboarding zu starten.
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
