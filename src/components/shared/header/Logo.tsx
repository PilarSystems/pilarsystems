'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

import logoDark from '@public/images/shared/logo-dark.svg';
import logo from '@public/images/shared/logo.svg';

import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Initial Session
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        setHasSession(!!data.session);
      })
      .catch(() => setHasSession(false));

    // Auth-Listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setHasSession(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Während Session lädt → kein Fehler, kein Flackern
  const finalHref = hasSession ? '/dashboard' : '/homepage-18';

  return (
    <div>
      <Link href={finalHref} className="flex items-center gap-2">
        <span className="sr-only">Pilar Systems – Home</span>

        {/* Desktop: Icon + Text */}
        <figure className="hidden lg:block max-w-[32px]">
          <Image src={logo} alt="Pilar Systems Logo" className="block w-full dark:hidden" />
          <Image src={logoDark} alt="Pilar Systems Logo" className="hidden w-full dark:block" />
        </figure>

        <span
          className="hidden lg:inline-block text-base font-semibold tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: 'var(--color-gradient-pilar)' }}
        >
          Pilar Systems
        </span>

        {/* Mobile: Icon only */}
        <figure className="block max-w-[44px] lg:hidden">
          <Image src={logo} alt="Pilar Systems Logo" className="block w-full dark:hidden" />
          <Image src={logoDark} alt="Pilar Systems Logo" className="hidden w-full dark:block" />
        </figure>
      </Link>
    </div>
  );
};

export default Logo;
