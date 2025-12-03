'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AuthCardProps {
  children: ReactNode
  delay?: number
}

export function AuthCard({ children, delay = 0.2 }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay }}
      className="w-full backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-white/10 rounded-3xl shadow-2xl p-8"
    >
      {children}
    </motion.div>
  )
}
