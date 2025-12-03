'use client'

import { useState } from 'react';
import { AuthLayout, AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Implement login with Supabase
    console.log('Login attempt with:', email);
    setLoading(false);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Willkommen zurück
        </h1>
        <div className="space-y-4">
          <AuthInput 
            id="email"
            type="email"
            label="E-Mail"
            icon={<Mail className="w-5 h-5 text-white/50" />} 
            placeholder="name@studio.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput 
            id="password"
            type="password"
            label="Passwort"
            icon={<Lock className="w-5 h-5 text-white/50" />} 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <AuthButton onClick={handleLogin} fullWidth loading={loading}>
            Anmelden
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;