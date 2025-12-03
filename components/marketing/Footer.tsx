import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PILAR SYSTEMS
            </span>
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              Die AI-Plattform für Fitnessstudios. Automatisiere deine Rezeption, 
              Lead-Verwaltung und Follow-Ups – 24/7.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Produkt</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/whatsapp-coach" className="text-sm text-gray-400 hover:text-white transition-colors">
                  WhatsApp Coach
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Unternehmen</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PILAR SYSTEMS. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-sm text-gray-400 hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-white transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="text-sm text-gray-400 hover:text-white transition-colors">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
