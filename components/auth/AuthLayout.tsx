'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-purple-600/30 blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute -bottom-40 left-1/3 w-72 h-72 rounded-full bg-pink-600/20 blur-[80px]"
        />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="group inline-flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-white"
          >
            PILAR
            <span className="text-blue-500"> SYSTEMS</span>
          </motion.div>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 z-50">
        <p className="text-center text-sm text-white/40">
          © 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  )
}
