'use client'

import { motion } from 'framer-motion'

interface AuthDividerProps {
  text?: string
  delay?: number
}

export function AuthDivider({ text = 'oder', delay = 0 }: AuthDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="relative flex items-center justify-center my-6"
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/20" />
      </div>
      <div className="relative px-4 bg-gray-950">
        <span className="text-sm text-white/50 font-medium">{text}</span>
      </div>
    </motion.div>
  )
}