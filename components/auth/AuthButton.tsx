'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'border border-gray-600 hover:bg-gray-800 text-white',
    ghost: 'bg-transparent text-gray-400 hover:text-white',
  }[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Button
        className={`${variantStyles} ${fullWidth ? 'w-full' : ''} h-12 text-base font-semibold transition-all duration-300`}
        onClick={onClick}
        type={type}
        disabled={disabled || loading}
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : icon && <span className="mr-2">{icon}</span>}
        {children}
      </Button>
    </motion.div>
  )
}