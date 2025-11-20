'use client'

import { motion } from 'framer-motion'
import { CSSProperties } from 'react'

interface AnimatedGradientProps {
  /**
   * Gradient type
   */
  type?: 'conic' | 'radial' | 'linear'
  /**
   * Colors for the gradient (uses PILAR brand colors by default)
   */
  colors?: string[]
  /**
   * Animation duration in seconds
   */
  duration?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * AnimatedGradient - Animated gradient background
 * Uses CSS gradients with subtle motion for premium feel
 * No images required - pure code-based visual
 */
export function AnimatedGradient({
  type = 'conic',
  colors = [
    'oklch(0.75 0.15 200)', // PILAR Cyan
    'oklch(0.65 0.12 220)',
    'oklch(0.55 0.10 240)',
  ],
  duration = 8,
  className = '',
}: AnimatedGradientProps) {
  const getGradient = (rotation: number): CSSProperties => {
    switch (type) {
      case 'conic':
        return {
          background: `conic-gradient(from ${rotation}deg at 50% 50%, ${colors.join(', ')})`,
        }
      case 'radial':
        return {
          background: `radial-gradient(circle at 50% 50%, ${colors.join(', ')})`,
        }
      case 'linear':
        return {
          background: `linear-gradient(${rotation}deg, ${colors.join(', ')})`,
        }
    }
  }

  return (
    <motion.div
      className={`absolute inset-0 opacity-20 blur-3xl ${className}`}
      animate={{
        rotate: type === 'radial' ? 0 : [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={getGradient(0)}
    />
  )
}
