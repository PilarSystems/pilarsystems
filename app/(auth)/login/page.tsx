'use client'

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement actual login with Supabase
    console.log('Login:', { email, password });
    setLoading(false);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Willkommen zurück
          </h1>
          <p className="text-gray-400">
            Melde dich an, um dein AI Studio zu verwalten
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@studio.de"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            required
          />
          <AuthInput
            id="password"
            type="password"
            label="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-cyan-400 hover:underline">
              Passwort vergessen?
            </Link>
          </div>
          
          <AuthButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<Sparkles className="h-5 w-5" />}
          >
            Anmelden
          </AuthButton>
        </form>
        
        <AuthDivider text="oder" delay={0.5} />
        
        <p className="text-center text-gray-400 text-sm">
          Noch kein Konto?{' '}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}