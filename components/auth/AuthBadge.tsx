'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface AuthBadgeProps {
  children: React.ReactNode
  icon: React.ReactNode
  delay?: number
}

export function AuthBadge({ children, icon, delay = 0 }: AuthBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm mb-6"
    >
      {icon}
      {children}
    </motion.div>
  )
}