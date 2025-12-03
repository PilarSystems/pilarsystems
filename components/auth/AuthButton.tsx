'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface AuthButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  delay?: number
}

export function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  delay = 0,
}: AuthButtonProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
    secondary: 'border-2 border-white/20 text-white hover:bg-white/5',
    ghost: 'bg-transparent text-white hover:bg-white/5',
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        px-6 py-3 rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && icon}
      {children}
    </motion.button>
  )
}