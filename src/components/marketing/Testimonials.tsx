'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Marcus Weber',
    role: 'Inhaber, FitZone München',
    quote: 'PILAR hat unser Studio revolutioniert. Wir verpassen keinen einzigen Lead mehr und sparen 15 Stunden pro Woche.',
    rating: 5,
    metric: '+47% Leads konvertiert'
  },
  {
    name: 'Sarah Klein',
    role: 'Geschäftsführerin, PowerGym Berlin',
    quote: 'Das Onboarding war so einfach – in 20 Minuten waren wir live. Die AI antwortet besser als unser vorheriger Empfang.',
    rating: 5,
    metric: '20 Min. Setup-Zeit'
  },
  {
    name: 'Tom Schmidt',
    role: 'Owner, CrossFit Hamburg',
    quote: 'Endlich kann ich mich aufs Coaching fokussieren statt am Telefon zu hängen. ROI war nach 3 Wochen erreicht.',
    rating: 5,
    metric: '3 Wochen ROI'
  }
]

export function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
        >
          <Quote className="absolute top-4 right-4 h-8 w-8 text-cyan-500/20" />
          
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, j) => (
              <span key={j} className="text-yellow-400">⭐</span>
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-300 mb-6 italic">&quot;{testimonial.quote}&quot;</p>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-white">{testimonial.name}</div>
              <div className="text-sm text-gray-400">{testimonial.role}</div>
            </div>
          </div>

          {/* Metric */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-cyan-400 font-semibold">{testimonial.metric}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
