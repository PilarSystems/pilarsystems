'use client'

import React, { useId } from 'react'
import { motion } from 'framer-motion'

interface AuthInputProps {
  id?: string
  type?: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: React.ReactNode
  required?: boolean
  placeholder?: string
  delay?: number
  name?: string
  autoComplete?: string
}

export function AuthInput({
  id,
  type = 'text',
  label,
  value,
  onChange,
  error,
  icon,
  required = false,
  placeholder,
  delay = 0,
  name,
  autoComplete,
}: AuthInputProps) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="w-full"
    >
      <div className={`relative group ${error ? 'animate-shake' : ''}`}>
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          id={inputId}
          name={name || inputId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder || label}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-12' : ''} 
            bg-white/5 backdrop-blur-sm
            border ${error ? 'border-red-500/50' : 'border-white/10'} 
            rounded-xl text-white placeholder-white/30
            focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
            transition-all duration-300
          `}
        />
        
        {/* Label for screen readers */}
        <label htmlFor={inputId} className="sr-only">
          {label} {required && '(erforderlich)'}
        </label>
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}