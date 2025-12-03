'use client'

import React, { useState } from 'react';
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
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;
    const isLabelFloated = isFocused || hasValue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className={`relative w-full bg-white/5 backdrop-blur-lg rounded-md overflow-hidden transition-all duration-300 ${error ? 'border border-red-500' : 'border border-transparent'} p-3`}
        >
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                placeholder={placeholder}
                className={`w-full h-12 border-b-2 bg-transparent outline-none transition-all duration-300 text-white ${error ? 'border-red-500' : 'border-gray-600 focus:border-cyan-500'}`} 
            />
            <label
                htmlFor={id}
                className={`absolute left-3 transform transition-all duration-300 pointer-events-none text-gray-400 ${isLabelFloated ? 'top-1 scale-75 -translate-y-1 text-cyan-400' : 'top-6'}`}
            >
                {label} {required && '*'}
            </label>
            {icon && <span className="absolute right-3 top-6 text-gray-400">{icon}</span>}
            {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
        </motion.div>
    );
};

export { AuthInput };