import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { handleLogin, handleMagicLink } from 'supabase';

const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-gradient">Willkommen zurück</h1>
        <AuthInput icon={<Mail />} placeholder="E-Mail" />
        <AuthInput icon={<Lock />} placeholder="Passwort" />
        <AuthButton onClick={handleLogin}>Anmelden</AuthButton>
        <div className="stagger-animation"> {/* Implement stagger animations */} </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;