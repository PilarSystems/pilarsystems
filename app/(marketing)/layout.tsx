import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { ConsentManager } from '@/components/marketing/ConsentManager'
import '@/app/globals.css'

export const metadata = {
  title: 'PILAR SYSTEMS - KI-gesteuerte Automatisierung für Fitnessstudios',
  description: 'Automatisiere dein Fitnessstudio mit KI: WhatsApp AI, Phone AI, Lead Management. 100% Self-Service Onboarding.',
  openGraph: {
    title: 'PILAR SYSTEMS - KI-gesteuerte Automatisierung für Fitnessstudios',
    description: 'Automatisiere dein Fitnessstudio mit KI: WhatsApp AI, Phone AI, Lead Management.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'PILAR SYSTEMS',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body 
        className="bg-black text-white antialiased"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  )
}
