'use client'

import { PageTransition } from './PageTransition'
import { ReactNode } from 'react'

interface TransitionRootProps {
  children: ReactNode
}

/**
 * TransitionRoot - Client wrapper for page transitions
 * Used inside server layout to enable page transitions
 */
export function TransitionRoot({ children }: TransitionRootProps) {
  return <PageTransition>{children}</PageTransition>
}
