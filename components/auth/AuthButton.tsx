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

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  delay = 0,
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90',
    secondary: 'border border-gray-600 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/5',
  }[variant];

  return (
    <motion.button 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variantStyles} ${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`} 
      onClick={onClick} 
      type={type} 
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : icon} 
      {children}
    </motion.button>
  );
};

export default AuthButton;