import { cn } from '@/lib/utils'

interface HeadingProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  gradient?: boolean
}

const sizeClasses = {
  xs: 'text-xl sm:text-2xl',
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-5xl sm:text-6xl',
  '2xl': 'text-6xl sm:text-7xl',
  '3xl': 'text-7xl sm:text-8xl',
}

export function Heading({
  children,
  as: Component = 'h2',
  size = 'lg',
  className,
  gradient = false,
}: HeadingProps) {
  return (
    <Component
      className={cn(
        'font-bold tracking-tight',
        sizeClasses[size],
        gradient && 'bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent',
        !gradient && 'text-foreground',
        className
      )}
    >
      {children}
    </Component>
  )
}
