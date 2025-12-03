'use client'

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { User, Building, Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { signupSchema, type SignupFormData, getLocalizedErrors } from '@/lib/validation';
import { z } from 'zod';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  // Calculate password strength
  const calculatePasswordStrength = useCallback((pwd: string) => {
    if (pwd.length < 8) return 'weak';
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 3 && pwd.length >= 12) return 'strong';
    if (score >= 2 && pwd.length >= 8) return 'medium';
    return 'weak';
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const validateField = useCallback((name: keyof SignupFormData, value: string) => {
    const formData = { fullName, studioName, email, password, confirmPassword, [name]: value };
    try {
      signupSchema.parse(formData);
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const localizedErrors = getLocalizedErrors(err, 'de');
        if (localizedErrors[name]) {
          setFieldErrors(prev => ({ ...prev, [name]: localizedErrors[name] }));
        }
      }
    }
  }, [fullName, studioName, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate all fields
    const formData = { fullName, studioName, email, password, confirmPassword };
    const result = signupSchema.safeParse(formData);
    
    if (!result.success) {
      const localizedErrors = getLocalizedErrors(result.error, 'de');
      setFieldErrors(localizedErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const supabase = getSupabase();
      
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            studio_name: studioName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      
      if (signUpError) {
        // Handle specific Supabase errors
        if (signUpError.message.includes('already registered')) {
          setError('Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.');
        } else if (signUpError.message.includes('rate limit')) {
          setError('Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.');
        } else {
          setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        }
        return;
      }
      
      if (data.user) {
        // Store user data temporarily for onboarding
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signup_data', JSON.stringify({
            userId: data.user.id,
            fullName: fullName.trim(),
            studioName: studioName.trim(),
            email: email.trim().toLowerCase(),
          }));
        }
        
        // Redirect to checkout
        router.push('/checkout');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
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
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <AuthInput
            id="fullName"
            type="text"
            label="Vollständiger Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => validateField('fullName', fullName)}
            icon={<User className="h-5 w-5" />}
            required
            delay={0.1}
            error={fieldErrors.fullName}
          />
          
          <AuthInput
            id="studioName"
            type="text"
            label="Studio Name"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            onBlur={() => validateField('studioName', studioName)}
            icon={<Building className="h-5 w-5" />}
            required
            delay={0.15}
            error={fieldErrors.studioName}
          />
          
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField('email', email)}
            icon={<Mail className="h-5 w-5" />}
            required
            delay={0.2}
            error={fieldErrors.email}
          />
          
          <div className="space-y-1">
            <AuthInput
              id="password"
              type="password"
              label="Passwort"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validateField('password', password)}
              icon={<Lock className="h-5 w-5" />}
              required
              delay={0.25}
              error={fieldErrors.password}
            />
            {password && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-1"
              >
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                      passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span className={`text-xs ${
                  passwordStrength === 'weak' ? 'text-red-400' :
                  passwordStrength === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {passwordStrength === 'weak' ? 'Schwach' :
                   passwordStrength === 'medium' ? 'Mittel' : 'Stark'}
                </span>
              </motion.div>
            )}
          </div>
          
          <AuthInput
            id="confirmPassword"
            type="password"
            label="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => validateField('confirmPassword', confirmPassword)}
            icon={<Lock className="h-5 w-5" />}
            required
            delay={0.3}
            error={fieldErrors.confirmPassword}
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
