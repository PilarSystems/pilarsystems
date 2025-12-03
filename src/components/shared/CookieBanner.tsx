'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RevealAnimation from '@/components/animation/RevealAnimation';

const STORAGE_KEY = 'pilar_cookie_consent_v1';

type ConsentValue = 'all' | 'necessary' | null;

const CookieBanner = () => {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored === 'all' || stored === 'necessary') {
        setConsent(stored);
      }
      setMounted(true);
    });
  }, []);

  const handleConsent = (value: ConsentValue) => {
    if (typeof window !== 'undefined' && value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setConsent(value);
  };

  if (!mounted || consent !== null) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <RevealAnimation delay={0.1} offset={20} start="bottom 100%">
        <div className="pointer-events-auto max-w-3xl w-full rounded-2xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/95 dark:bg-background-8/95 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 text-left">
              <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                Cookies & Datenschutz
              </p>
              <p className="text-tagline-1 text-secondary/85 dark:text-accent/90">
                Wir verwenden Cookies, um unsere Website stabil zu betreiben und unser Angebot zu verbessern. 
                Technisch notwendige Cookies setzen wir immer, optionale nur mit deiner Einwilligung.
              </p>
              <p className="text-[12px] text-secondary/60 dark:text-accent/60">
                Mehr Informationen findest du in unserer{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-secondary dark:hover:text-accent">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:shrink-0 sm:pl-6">
              <button
                type="button"
                onClick={() => handleConsent('necessary')}
                className="btn btn-sm sm:btn-md btn-outline border-stroke-2/80 dark:border-stroke-6/80 hover:btn-secondary w-full sm:w-auto"
              >
                Nur notwendige
              </button>
              <button
                type="button"
                onClick={() => handleConsent('all')}
                className="btn btn-sm sm:btn-md btn-primary hover:btn-secondary dark:hover:btn-accent w-full sm:w-auto"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </RevealAnimation>
    </div>
  );
};

export default CookieBanner;
