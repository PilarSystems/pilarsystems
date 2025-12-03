import { AuthLayout, AuthCard, AuthInput, AuthButton, AuthBadge } from '@/components/auth';
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type UserData = {
  full_name: string;
  studio_name: string;
};

const SignupPage = () => {
  // Define the state and handlers for the form fields
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation logic here...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Complete the signUp logic with Supabase, keeping user metadata
    const userData: UserData = { full_name: fullName, studio_name: studioName };
    // Add signUp functionality with error handling and toast notifications
    // Redirect to /checkout on success
  };

  return (
    <AuthLayout>
      <AuthCard>
        <form onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <AuthInput placeholder="Full Name" icon={<User />} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <AuthInput placeholder="Studio Name" icon={<Building />} value={studioName} onChange={(e) => setStudioName(e.target.value)} required />
            <AuthInput placeholder="Email" icon={<Mail />} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <AuthInput placeholder="Password" type="password" icon={<Lock />} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <AuthInput placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </motion.div>
          <AuthButton type="submit"><AuthBadge icon={<Sparkles />}/> Sign Up</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignupPage;
