import { cn } from '@/lib/utils'
import { Container } from './Container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  noPadding?: boolean
  background?: 'default' | 'muted' | 'gradient'
}

const backgroundClasses = {
  default: '',
  muted: 'bg-muted/30',
  gradient: 'bg-gradient-to-b from-background via-muted/20 to-background',
}

export function Section({
  children,
  className,
  containerSize = 'xl',
  noPadding = false,
  background = 'default',
}: SectionProps) {
  return (
    <section
      className={cn(
        !noPadding && 'py-16 sm:py-24 lg:py-32',
        backgroundClasses[background],
        className
      )}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
