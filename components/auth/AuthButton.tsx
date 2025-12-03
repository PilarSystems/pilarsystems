'use client'

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  delay?: number;
}

export function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  delay = 0,
}: AuthButtonProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'border border-gray-300 hover:bg-gray-200 text-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
  }[variant];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variantStyles} ${fullWidth ? 'w-full' : ''} px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className='animate-spin h-5 w-5' /> : icon}
      {children}
    </motion.button>
  );
}