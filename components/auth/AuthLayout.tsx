'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Logo */}
      <Link href="/" className="mb-8 relative z-10">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          PILAR SYSTEMS
        </motion.span>
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 relative z-10">
        <p className="text-gray-500 text-sm">© 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
