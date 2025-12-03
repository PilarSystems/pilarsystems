import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-24 ${className}`}>
      {children}
    </section>
  )
}
