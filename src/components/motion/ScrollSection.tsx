'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollSectionProps {
  children: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Delay before animation starts (in seconds)
   */
  delay?: number
  /**
   * Enable stagger for child elements
   */
  stagger?: boolean
  /**
   * Viewport threshold (0-1)
   */
  threshold?: number
}

/**
 * ScrollSection - Section with scroll-triggered animations
 * Reveals content with stagger effect when scrolled into view
 * Respects prefers-reduced-motion
 */
export function ScrollSection({
  children,
  className = '',
  delay = 0,
  stagger = false,
  threshold = 0.2,
}: ScrollSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger ? 0.1 : 0,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={containerVariants}
    >
      {stagger ? (
        Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants}>{children}</motion.div>
        )
      ) : (
        children
      )}
    </motion.div>
  )
}
