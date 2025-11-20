'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
}

export function GlassCard({ children, className, hover = true, animate = true }: GlassCardProps) {
  if (!animate) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border/50 p-6',
          'bg-card/50 backdrop-blur-sm',
          hover && 'transition-all duration-300 hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-cyan/10',
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'rounded-2xl border border-border/50 p-6',
        'bg-card/50 backdrop-blur-sm',
        hover && 'transition-all duration-300 hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-cyan/10',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
