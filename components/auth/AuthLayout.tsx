'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-10">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-2xl font-bold text-white"
        >
          PILAR SYSTEMS
        </motion.div>
      </Link>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-48 -right-48"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -bottom-48 -left-48"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute w-64 h-64 bg-pink-600/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        {children}
      </div>
      <footer className="absolute bottom-4 text-center text-white/50 text-sm">
        <p>© 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
