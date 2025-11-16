'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabaseClient';

type DashboardGuardProps = {
  children: ReactNode;
};

const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // aktuelle URL merken, damit wir nach Login zurückleiten können
          const current =
            typeof window !== 'undefined'
              ? window.location.pathname + window.location.search
              : '/dashboard';

          const redirectTo = encodeURIComponent(current);

          router.replace(`/login-01?redirectTo=${redirectTo}`);
          return;
        }
      } catch (err) {
        console.error('DashboardGuard – Fehler beim Session-Check:', err);
        router.replace('/login-01');
        return;
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-secondary/70 dark:text-accent/70 text-tagline-1">
          Dashboard wird geladen …
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DashboardGuard;
