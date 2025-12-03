'use client'

import { useState } from 'react';
import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthBadge } from '@/components/auth';
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type UserData = {
  full_name: string;
  studio_name: string;
};

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Complete the signUp logic with Supabase
    const userData: UserData = { full_name: fullName, studio_name: studioName };
    console.log('Signup attempt with:', userData, email);
    // TODO: Add signUp functionality with error handling and toast notifications
    // TODO: Redirect to /checkout on success
    setLoading(false);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-6">
          <AuthBadge icon={<Sparkles className="w-4 h-4 text-blue-400" />}>
            <span className="text-sm text-white/80">Starte jetzt kostenlos</span>
          </AuthBadge>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Studio registrieren
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <AuthInput 
              id="fullName"
              type="text"
              label="Vollständiger Name"
              placeholder="Max Mustermann" 
              icon={<User className="w-5 h-5 text-white/50" />} 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
            <AuthInput 
              id="studioName"
              type="text"
              label="Studio Name"
              placeholder="Fitness Studio XYZ" 
              icon={<Building className="w-5 h-5 text-white/50" />} 
              value={studioName} 
              onChange={(e) => setStudioName(e.target.value)} 
              required 
            />
            <AuthInput 
              id="email"
              type="email"
              label="E-Mail"
              placeholder="name@studio.de" 
              icon={<Mail className="w-5 h-5 text-white/50" />} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <AuthInput 
              id="password"
              type="password"
              label="Passwort"
              placeholder="••••••••" 
              icon={<Lock className="w-5 h-5 text-white/50" />} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <AuthInput 
              id="confirmPassword"
              type="password"
              label="Passwort bestätigen"
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </motion.div>
          <AuthButton type="submit" fullWidth loading={loading}>
            Registrieren
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignupPage;
