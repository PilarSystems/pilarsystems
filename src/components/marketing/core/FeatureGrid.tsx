import { cn } from '@/lib/utils'
import { GlassCard } from './GlassCard'
import { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export function FeatureGrid({ features, columns = 3, className }: FeatureGridProps) {
  return (
    <div className={cn('grid gap-6', columnClasses[columns], className)}>
      {features.map((feature, i) => {
        const Icon = feature.icon
        return (
          <GlassCard key={i}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10">
                <Icon className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
