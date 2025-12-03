'use client'

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Name ist erforderlich';
    }
    if (!studioName.trim()) {
      newErrors.studioName = 'Studio Name ist erforderlich';
    }
    if (!email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    if (!password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    // TODO: Implement actual signup with Supabase
    // Note: Actual implementation should use Supabase auth with user metadata
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to checkout on success
      // router.push('/checkout');
    }, 1000);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <AuthBadge icon={<Sparkles className="h-4 w-4 text-cyan-400" />} delay={0.1}>
            <span className="text-sm text-cyan-300">Starte in wenigen Minuten</span>
          </AuthBadge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
          >
            Studio registrieren
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400"
          >
            Erstelle dein AI-Studio in wenigen Schritten
          </motion.p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="fullName"
            type="text"
            label="Dein Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Max Mustermann"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.fullName}
            required
            delay={0.1}
          />
          <AuthInput
            id="studioName"
            type="text"
            label="Studio Name"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            placeholder="FitZone Berlin"
            icon={<Building className="h-5 w-5 text-gray-400" />}
            error={errors.studioName}
            required
            delay={0.15}
          />
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@studio.de"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email}
            required
            delay={0.2}
          />
          <AuthInput
            id="password"
            type="password"
            label="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.password}
            required
            delay={0.25}
          />
          <AuthInput
            id="confirmPassword"
            type="password"
            label="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.confirmPassword}
            required
            delay={0.3}
          />
          
          <AuthButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<Sparkles className="h-5 w-5" />}
            delay={0.35}
          >
            Jetzt registrieren
          </AuthButton>
        </form>
        
        <AuthDivider text="oder" delay={0.4} />
        
        <p className="text-center text-gray-400 text-sm">
          Bereits registriert?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Jetzt anmelden
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
