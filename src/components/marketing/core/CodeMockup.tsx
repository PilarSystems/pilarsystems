'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CodeMockupProps {
  code: string
  language?: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeMockup({
  code,
  language = 'typescript',
  className,
  showLineNumbers = true,
}: CodeMockupProps) {
  const lines = code.trim().split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-2">{language}</span>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          <code>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex"
              >
                {showLineNumbers && (
                  <span className="text-muted-foreground/50 select-none mr-4 w-8 text-right">
                    {i + 1}
                  </span>
                )}
                <span className="text-foreground">{line}</span>
              </motion.div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  )
}
