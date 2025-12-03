'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  delay?: number
  className?: string
}

export function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  delay = 0,
  className = '',
}: AuthButtonProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20',
    secondary: 'border border-gray-600 hover:bg-gray-800 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-white',
  }[variant]

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantStyles}
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
        px-6 py-3 rounded-xl font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      {children}
    </motion.button>
  )
}