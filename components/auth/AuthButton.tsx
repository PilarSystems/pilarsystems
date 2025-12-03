import { Button } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  delay?: number;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  delay = 0,
}) => {
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay } },
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105',
    secondary: 'border border-gray-300 hover:bg-gray-200',
    ghost: 'bg-transparent',
  }[variant];

  return (
    <Button 
      className={`${variantStyles} ${fullWidth ? 'w-full' : ''}`} 
      onClick={onClick} 
      type={type} 
      disabled={disabled || loading}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? <Loader2 className='animate-spin' /> : icon} 
      {children}
    </Button>
  );
};

export default AuthButton;