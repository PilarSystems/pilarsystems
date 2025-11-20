'use client'

import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * PageTransition - Smooth page transitions for App Router
 * Wraps children in AnimatePresence keyed by pathname
 * Respects prefers-reduced-motion
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}
