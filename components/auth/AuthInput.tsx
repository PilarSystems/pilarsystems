'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AuthInputProps {
  id?: string
  type?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: React.ReactNode
  required?: boolean
  placeholder?: string
  delay?: number
  minLength?: number
}

export function AuthInput({
  id,
  type = 'text',
  label,
  value = '',
  onChange,
  error,
  icon,
  required,
  placeholder,
  delay = 0,
  minLength,
}: AuthInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && value) {
      inputRef.current.classList.add('has-value')
    }
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`relative w-full bg-white/5 backdrop-blur-lg rounded-md overflow-hidden transition-all duration-300 ${error ? 'border-red-500' : 'border-transparent'} p-3 mb-4`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          ref={inputRef}
          className={`w-full h-12 bg-transparent outline-none transition-all duration-300 text-white placeholder-gray-400 ${error ? 'ring-red-500' : ''} focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`absolute left-3 top-2 transform transition-all duration-300 text-gray-400 ${value ? 'scale-75 -translate-y-4' : ''}`}
        >
          {label} {required && '*'}
        </label>
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </motion.div>
  )
}