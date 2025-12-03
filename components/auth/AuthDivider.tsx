'use client'

import { motion } from 'framer-motion'
import React from 'react'

export interface AuthDividerProps {
    text: string
    delay?: number
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="flex items-center gap-4 my-6"
        >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-white/50 text-sm font-medium">{text}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
    )
}