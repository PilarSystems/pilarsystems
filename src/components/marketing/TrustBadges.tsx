'use client'

import { motion } from 'framer-motion'
import { Shield, CreditCard, MapPin, Headphones, LucideIcon } from 'lucide-react'

interface TrustBadgeProps {
  title: string
  description: string
  icon: string
  delay?: number
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  CreditCard,
  MapPin,
  Headphones,
}

export function TrustBadge({ title, description, icon, delay = 0 }: TrustBadgeProps) {
  const Icon = iconMap[icon] || Shield

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
    >
      <div className="flex-shrink-0">
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
          <Icon className="h-6 w-6 text-cyan-400" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}

interface TrustBadgesProps {
  badges: Array<{
    id: number
    title: string
    description: string
    icon: string
  }>
}

export function TrustBadges({ badges }: TrustBadgesProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge, index) => (
        <TrustBadge
          key={badge.id}
          {...badge}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
