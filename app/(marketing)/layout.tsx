import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { ConsentManager } from '@/components/marketing/ConsentManager'
import '@/app/globals.css'

export const metadata = {
  title: 'PILAR SYSTEMS - AI SaaS für Fitnessstudios',
  description: 'Automatisiere dein Fitnessstudio mit AI. 24/7 Rezeption, Lead-Management, WhatsApp & Phone AI, Follow-Up Automation.',
  openGraph: {
    title: 'PILAR SYSTEMS - AI SaaS für Fitnessstudios',
    description: 'Automatisiere dein Fitnessstudio mit AI. 24/7 Rezeption, Lead-Management, WhatsApp & Phone AI, Follow-Up Automation.',
    type: 'website',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body className="font-sans bg-black text-white antialiased">
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
