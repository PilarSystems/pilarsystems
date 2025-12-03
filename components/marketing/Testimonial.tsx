'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

interface TestimonialProps {
  name: string
  role: string
  studio: string
  image: string
  rating: number
  quote: string
  delay?: number
}

/**
 * Validates if a string is a valid image source
 * Supports: relative paths, absolute URLs, and data URIs
 */
function isValidImageSrc(src: string): boolean {
  if (!src || typeof src !== 'string') return false
  
  // Check for relative paths (starting with /)
  if (src.startsWith('/')) return true
  
  // Check for absolute URLs (http/https)
  if (src.startsWith('http://') || src.startsWith('https://')) return true
  
  // Check for data URIs (base64 images)
  if (src.startsWith('data:image/')) return true
  
  return false
}

export function Testimonial({ name, role, studio, image, rating, quote, delay = 0 }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="h-16 w-16 text-cyan-400" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-300 text-lg leading-relaxed mb-6 relative z-10">
        &quot;{quote}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          {isValidImageSrc(image) ? (
            <Image
              src={image}
              alt={name}
              width={56}
              height={56}
              className="object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-400">
            {role}, {studio}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface TestimonialCarouselProps {
  testimonials: Array<{
    id: number
    name: string
    role: string
    studio: string
    image: string
    rating: number
    quote: string
  }>
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
      {testimonials.map((testimonial, index) => (
        <Testimonial
          key={testimonial.id}
          {...testimonial}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
