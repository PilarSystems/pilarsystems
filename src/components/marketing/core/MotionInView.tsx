'use client'

import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

interface MotionInViewProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}

export function MotionInView({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  className,
  ...props
}: MotionInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
