'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
}

interface AnchorTabsProps {
  tabs: Tab[]
  className?: string
}

/**
 * AnchorTabs - Smooth-scrolling navigation tabs
 * Highlights active section based on scroll position
 * Uses IntersectionObserver for active state
 */
export function AnchorTabs({ tabs, className = '' }: AnchorTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveTab(tab.id)
            }
          })
        },
        {
          rootMargin: '-50% 0px -50% 0px',
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [tabs])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => scrollToSection(tab.id)}
          className="relative px-4 py-2 text-sm font-medium transition-colors"
        >
          <span
            className={`relative z-10 ${
              activeTab === tab.id
                ? 'text-brand-cyan'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-brand-cyan/10 rounded-lg"
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
