'use client'

import { motion } from 'framer-motion'
import { ReactNode, InputHTMLAttributes } from 'react'

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id?: string
  type?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  delay?: number
}

export function AuthInput({
  id,
  type = 'text',
  label,
  value,
  onChange,
  error,
  icon,
  required,
  placeholder,
  delay = 0,
  className = '',
  ...props
}: AuthInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="w-full mb-4"
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
            w-full h-12 px-4 ${icon ? 'pl-12' : ''}
            bg-white/5 backdrop-blur-lg
            border ${error ? 'border-red-500' : 'border-white/10'} 
            rounded-xl
            text-white placeholder-gray-500
            outline-none
            transition-all duration-300
            focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </motion.div>
  )
}