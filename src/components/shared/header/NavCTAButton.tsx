'use client';

import LinkButton from '@/components/ui/button/LinkButton';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface NavCTAButtonProps {
  btnClassName?: string;
  className?: string;
  href?: string;   // bleibt optional für Abwärtskompatibilität, wird aber intern überschrieben
  label?: string;  // dto.
}

const NavCTAButton = ({ btnClassName, className }: NavCTAButtonProps) => {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        setHasSession(!!data.session);
      })
      .catch(() => {
        setHasSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setHasSession(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initial-Ladezustand → Skeleton, um Flackern zu vermeiden
  if (hasSession === null) {
    return (
      <div className={cn('hidden items-center justify-center xl:flex', className)}>
        <div className="w-[130px] h-[38px] rounded-md bg-white/10 dark:bg-white/5 animate-pulse" />
      </div>
    );
  }

  // eingeloggt → Dashboard, nicht eingeloggt → Signup
  const finalHref = hasSession ? '/dashboard' : '/signup-01';
  const finalLabel = hasSession ? 'Dashboard' : 'Jetzt starten';

  return (
    <div className={cn('hidden items-center justify-center xl:flex', className)}>
      <LinkButton
        href={finalHref}
        className={cn('btn btn-md bg-primary-500 text-white hover:opacity-80', btnClassName)}
      >
        {finalLabel}
      </LinkButton>
    </div>
  );
};

export default NavCTAButton;
