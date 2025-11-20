import { cn } from '@/lib/utils'

interface CopyProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  muted?: boolean
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

export function Copy({ children, size = 'lg', className, muted = false }: CopyProps) {
  return (
    <p
      className={cn(
        'leading-relaxed',
        sizeClasses[size],
        muted ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
    >
      {children}
    </p>
  )
}
