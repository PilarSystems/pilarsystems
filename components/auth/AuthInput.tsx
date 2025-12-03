'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface AuthInputProps {
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    icon?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    delay?: number;
}

const AuthInput: React.FC<AuthInputProps> = ({
    id,
    type,
    label,
    value,
    onChange,
    error,
    icon,
    required,
    placeholder,
    delay = 0,
}) => {
    const hasValue = !!value;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className={`relative w-full bg-white/5 backdrop-blur-lg rounded-md overflow-hidden transition-all duration-300 ${error ? 'border-red-500' : 'border-transparent'} p-3`}
        >
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`w-full h-12 border-b-2 bg-transparent outline-none transition-all duration-300 text-white ${error ? 'ring-red-500' : 'ring-blue-500'} focus:ring-2`} 
            />
            <label
                htmlFor={id}
                className={`absolute left-3 top-2 transform transition-all duration-300 text-white/50 pointer-events-none ${hasValue ? 'scale-75 -translate-y-4 text-xs' : ''}`}
            >
                {label} {required && '*'}
            </label>
            {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2">{icon}</span>}
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </motion.div>
    );
};

export default AuthInput;