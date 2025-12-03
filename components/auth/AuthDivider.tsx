// 'use client' directive
'use client';

import { motion } from 'framer-motion';
import React from 'react';

export interface AuthDividerProps {
    text: string;
    delay?: number;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
            className="auth-divider"
        >
            <span>{text}</span>
        </motion.div>
    );
};