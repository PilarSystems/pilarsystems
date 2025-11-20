import { Inter } from 'next/font/google'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { ConsentManager } from '@/components/marketing/ConsentManager'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TransitionRoot } from '@/components/motion/TransitionRoot'
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
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          <main className="pt-16">
            <TransitionRoot>{children}</TransitionRoot>
          </main>
          <Footer />
          <ConsentManager />
        </ThemeProvider>
      </body>
    </html>
  )
}
