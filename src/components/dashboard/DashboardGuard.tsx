// src/components/dashboard/DashboardGuard.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

type DashboardGuardProps = {
  children: ReactNode;
};

type GuardState =
  | 'checking'
  | 'no_user'
  | 'no_payment'
  | 'allowed';

const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const router = useRouter();
  const [state, setState] = useState<GuardState>('checking');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // 1. User checken
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) {
          setState('no_user');
          router.replace('/login-01');
          return;
        }

        const email = user.email;
        if (!email) {
          setState('no_user');
          router.replace('/login-01');
          return;
        }

        // 2. Paid-Status checken
        const { data, error } = await supabaseClient
          .from('paid_customers')
          .select('status')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          console.error('Fehler beim Laden paid_customers:', error);
        }

        if (!data || data.status !== 'active') {
          setState('no_payment');
          router.replace('/signup-01');
          return;
        }

        setState('allowed');
      } catch (err) {
        console.error('DashboardGuard Fehler:', err);
        setState('no_user');
        router.replace('/login-01');
      }
    };

    void checkAccess();
  }, [router]);

  // Loading / Check-UI
  if (state === 'checking') {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
        <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
          Wir prüfen kurz deinen Zugang & dein Abo…
        </p>
      </div>
    );
  }

  if (state === 'no_user' || state === 'no_payment') {
    // Während redirect einfach nichts Spezielles anzeigen
    return null;
  }

  // allowed
  return <>{children}</>;
};

export default DashboardGuard;
