'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { LucideIcon, TrendingUp, Target, Phone, Clock } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  description: string
  icon: string
  delay?: number
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Target,
  Phone,
  Clock,
}

export function KPICard({ label, value, description, icon, delay = 0 }: KPICardProps) {
  const Icon = iconMap[icon] || TrendingUp
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all duration-300">
            <Icon className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={isInView ? { scale: 1 } : { scale: 0.5 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            {value}
          </motion.div>
        </div>

        {/* Label */}
        <div className="text-xl font-semibold text-white mb-2">
          {label}
        </div>

        {/* Description */}
        <div className="text-sm text-gray-400">
          {description}
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

interface KPIGridProps {
  kpis: Array<{
    id: number
    label: string
    value: string
    description: string
    icon: string
  }>
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard
          key={kpi.id}
          {...kpi}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
