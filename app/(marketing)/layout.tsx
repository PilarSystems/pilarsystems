import { Inter } from 'next/font/google'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { CookieBanner } from '@/components/marketing/CookieBanner'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
