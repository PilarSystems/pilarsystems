'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DeviceFrameProps {
  children: React.ReactNode
  type?: 'phone' | 'tablet' | 'desktop'
  className?: string
}

export function DeviceFrame({ children, type = 'phone', className }: DeviceFrameProps) {
  const frameClasses = {
    phone: 'w-[280px] h-[580px] rounded-[3rem] p-3',
    tablet: 'w-[600px] h-[800px] rounded-[2rem] p-4',
    desktop: 'w-full max-w-5xl h-[600px] rounded-xl p-2',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative border-4 border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl',
        frameClasses[type],
        className
      )}
    >
      {/* Notch for phone */}
      {type === 'phone' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl" />
      )}

      {/* Content */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-background">
        {children}
      </div>
    </motion.div>
  )
}
