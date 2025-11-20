'use client'

import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { RefObject } from 'react'

interface UseParallaxOptions {
  /**
   * Scroll distance multiplier
   * Default: 0.5 (element moves at half the scroll speed)
   */
  speed?: number
  /**
   * Reference to the container element
   * If not provided, uses window scroll
   */
  ref?: RefObject<HTMLElement | null>
}

/**
 * useParallax - Create parallax scroll effects
 * Returns a MotionValue that can be used with motion components
 * 
 * @example
 * const y = useParallax({ speed: 0.5 })
 * <motion.div style={{ y }}>Parallax content</motion.div>
 */
export function useParallax({ speed = 0.5, ref }: UseParallaxOptions = {}): MotionValue<number> {
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed])

  return y
}

/**
 * useScrollProgress - Get scroll progress as a value between 0 and 1
 * Useful for scroll-based animations
 */
export function useScrollProgress(ref?: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return scrollYProgress
}
