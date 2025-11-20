'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface MicroButtonProps {
  children: ReactNode
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'ghost'
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Click handler
   */
  onClick?: () => void
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * MicroButton - Button with micro-interactions
 * Spring-based hover and tap animations for premium feel
 * Optimized for performance (transform/opacity only)
 */
export function MicroButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: MicroButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-colors'
  
  const variantClasses = {
    primary: 'bg-[oklch(0.75_0.15_200)] text-white hover:bg-[oklch(0.70_0.15_200)]',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{
        scale: 1.05,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      }}
    >
      {children}
    </motion.button>
  )
}
