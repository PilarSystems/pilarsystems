'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DepthCardProps {
  children: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Hover depth intensity (1-10)
   */
  depth?: number
}

/**
 * DepthCard - Card with 3D depth effect on hover
 * Uses CSS 3D transforms for premium feel
 * Optimized for performance (transform only)
 */
export function DepthCard({ children, className = '', depth = 5 }: DepthCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      whileHover={{
        scale: 1.02,
        rotateX: depth * 0.5,
        rotateY: depth * 0.5,
        transition: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <motion.div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(${depth * 2}px)`,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
