'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AuthBadgeProps {
  children?: ReactNode
  icon?: ReactNode
  delay?: number
}

export function AuthBadge({ children, icon, delay = 0 }: AuthBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-sm"
    >
      {icon}
      {children}
    </motion.div>
  )
}