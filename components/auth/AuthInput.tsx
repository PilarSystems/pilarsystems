'use client'

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AuthInputProps {
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    icon?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    delay?: number;
    disabled?: boolean;
    autoComplete?: string;
}

export function AuthInput({
    id,
    type,
    label,
    value,
    onChange,
    onBlur,
    error,
    icon,
    required,
    placeholder,
    delay = 0,
    disabled = false,
    autoComplete,
}: AuthInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && value) {
            inputRef.current.classList.add('has-value');
        }
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className={`relative w-full bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden transition-all duration-300 border ${error ? 'border-red-500' : 'border-white/10'} p-3`}
        >
            <div className="flex items-center gap-3">
                {icon && <span className="text-gray-400">{icon}</span>}
                <div className="flex-1">
                    <label
                        htmlFor={id}
                        className="block text-xs text-gray-400 mb-1"
                    >
                        {label} {required && '*'}
                    </label>
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        required={required}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        ref={inputRef}
                        className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>
            {error && (
                <motion.span 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 block"
                >
                    {error}
                </motion.span>
            )}
        </motion.div>
    );
}