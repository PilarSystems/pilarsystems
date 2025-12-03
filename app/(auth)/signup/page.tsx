'use client'

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { User, Building, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Implement actual signup with Supabase
      console.log('Signup attempt:', { fullName, studioName, email });
      // Redirect to checkout on success
      router.push('/checkout');
    } catch (err) {
      setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-6">
          <AuthBadge icon={<Sparkles className="h-4 w-4 text-cyan-400" />} delay={0}>
            <span className="text-sm text-cyan-300">Starte deine AI-Rezeption</span>
          </AuthBadge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Konto erstellen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            Registriere dein Studio in wenigen Minuten
          </motion.p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <AuthInput
            id="fullName"
            type="text"
            label="Vollständiger Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-5 w-5" />}
            required
            delay={0.1}
          />
          
          <AuthInput
            id="studioName"
            type="text"
            label="Studio Name"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            icon={<Building className="h-5 w-5" />}
            required
            delay={0.15}
          />
          
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
            delay={0.2}
          />
          
          <AuthInput
            id="password"
            type="password"
            label="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            required
            delay={0.25}
          />
          
          <AuthInput
            id="confirmPassword"
            type="password"
            label="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            required
            delay={0.3}
          />
          
          <AuthButton
            type="submit"
            fullWidth
            loading={loading}
            delay={0.35}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Konto erstellen
          </AuthButton>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Bereits registriert?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
