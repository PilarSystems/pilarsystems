'use client'

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const supabase = getSupabase();
      
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Ungültige E-Mail oder Passwort.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Bitte bestätige zuerst deine E-Mail-Adresse.');
        } else {
          setError('Login fehlgeschlagen. Bitte versuche es erneut.');
        }
        return;
      }
      
      if (data.user) {
        // Check if user has an active subscription
        const response = await fetch('/api/auth/check-subscription');
        const subscriptionData = await response.json();
        
        if (subscriptionData.hasActiveSubscription) {
          // User has subscription, redirect to dashboard
          router.push('/dashboard');
        } else {
          // User doesn't have subscription, redirect to checkout
          router.push('/checkout');
        }
      }
    } catch {
      setError('Login fehlgeschlagen. Bitte überprüfe deine Daten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
          <p className="text-gray-400">Melde dich an, um fortzufahren</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
            delay={0.1}
          />
          
          <AuthInput
            id="password"
            type="password"
            label="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            required
            delay={0.2}
          />
          
          <AuthButton
            type="submit"
            fullWidth
            loading={loading}
            delay={0.3}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Anmelden
          </AuthButton>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Noch kein Konto?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}