'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Node {
  id: string
  label: string
  x: number
  y: number
  color?: string
}

interface Connection {
  from: string
  to: string
}

interface SystemGraphProps {
  nodes: Node[]
  connections: Connection[]
  className?: string
}

export function SystemGraph({ nodes, connections, className }: SystemGraphProps) {
  return (
    <div className={cn('relative w-full h-[400px] sm:h-[500px]', className)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
        {/* Connections */}
        <g>
          {connections.map((conn, i) => {
            const fromNode = nodes.find((n) => n.id === conn.from)
            const toNode = nodes.find((n) => n.id === conn.to)
            if (!fromNode || !toNode) return null

            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="currentColor"
                strokeWidth="2"
                className="text-brand-cyan/30"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            )
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node, i) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="40"
                fill="currentColor"
                className={cn('text-brand-cyan/20', node.color)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="30"
                fill="currentColor"
                className="text-background"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
              />
              <motion.text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-current text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
              >
                {node.label}
              </motion.text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
