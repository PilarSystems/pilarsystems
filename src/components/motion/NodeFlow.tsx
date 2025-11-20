'use client'

import { motion } from 'framer-motion'

interface Node {
  id: string
  label: string
  x: number
  y: number
}

interface Edge {
  from: string
  to: string
}

interface NodeFlowProps {
  /**
   * Nodes in the flow
   */
  nodes: Node[]
  /**
   * Edges connecting nodes
   */
  edges: Edge[]
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NodeFlow - Animated node/edge visualization
 * Shows automation pipelines and workflows
 * Pure SVG-based, no images required
 */
export function NodeFlow({ nodes, edges, className = '' }: NodeFlowProps) {
  const getEdgePath = (from: Node, to: Node): string => {
    const midX = (from.x + to.x) / 2
    return `M ${from.x} ${from.y} Q ${midX} ${from.y}, ${midX} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]))

  return (
    <svg
      className={`w-full h-full ${className}`}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Edges */}
      <g>
        {edges.map((edge, index) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)
          if (!from || !to) return null

          return (
            <motion.path
              key={`edge-${index}`}
              d={getEdgePath(from, to)}
              stroke="oklch(0.75 0.15 200)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200,
            }}
          >
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill="oklch(0.75 0.15 200)"
              opacity="0.2"
              whileHover={{ scale: 1.2, opacity: 0.3 }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="oklch(0.75 0.15 200)"
              whileHover={{ scale: 1.1 }}
            />
            
            {/* Node label */}
            <text
              x={node.x}
              y={node.y + 50}
              textAnchor="middle"
              className="text-xs font-medium fill-current"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </g>
    </svg>
  )
}
