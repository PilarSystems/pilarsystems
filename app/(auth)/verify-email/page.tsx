'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">E-Mail verifizieren</CardTitle>
          <CardDescription>
            Wir haben einen Verifizierungslink an Ihre E-Mail-Adresse gesendet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bitte prüfen Sie Ihre E-Mail und klicken Sie auf den Verifizierungslink, um Ihr Konto zu aktivieren.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  )
}
