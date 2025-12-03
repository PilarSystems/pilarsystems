'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-20">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-2xl font-bold text-white"
        >
          PILAR
        </motion.div>
      </Link>
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
      
      <footer className="absolute bottom-4 z-10">
        <p className="text-white/50 text-sm">© 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
