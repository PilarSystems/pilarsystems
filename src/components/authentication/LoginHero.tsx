'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type LoginHeroProps = {
  loginAction: (formData: FormData) => void;
};

const LoginHero: React.FC<LoginHeroProps> = ({ loginAction }) => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const renderMessage = () => {
    if (!error) return null;

    let text = 'Login fehlgeschlagen. Bitte versuch es erneut.';

    switch (error) {
      case 'missing_fields':
        text = 'Bitte E-Mail und Passwort ausfüllen.';
        break;
      case 'invalid_credentials':
        text = 'E-Mail oder Passwort sind falsch – oder dein Konto ist noch nicht bestätigt.';
        break;
    }

    return (
      <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {text}
      </div>
    );
  };

  return (
    <div className="grid gap-10 md:grid-cols-[1.05fr,1fr] items-start">
      {/* Textseite */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <span className="size-2 rounded-full bg-accent" />
          Login für bestehende Kunden
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
          Willkommen zurück bei{' '}
          <span className="text-accent">Pilar Systems</span>.
        </h1>
        <p className="text-sm md:text-base text-secondary/70 dark:text-accent/80 max-w-xl">
          Melde dich mit deiner Geschäfts-E-Mail an, um auf dein Dashboard,
          deine KI-Rezeption und alle Automatisierungen zuzugreifen.
        </p>

        <ul className="space-y-2 text-sm text-secondary/80 dark:text-accent/80">
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>Alle Kanäle (Telefon, WhatsApp, E-Mail) an einem Ort steuern.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>Aktive Verträge, Leads und Trainingspläne im Blick behalten.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>Kein Limit an Mitarbeitern – du kannst Zugänge teilen.</span>
          </li>
        </ul>
      </div>

      {/* Formularseite */}
      <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-6/90 p-6 md:p-7 shadow-lg shadow-black/5">
        {renderMessage()}

        <form action={loginAction} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
              Geschäfts-E-Mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
              placeholder="you@studio-name.de"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
              Passwort
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary hover:btn-secondary dark:hover:btn-accent w-full md:w-auto"
          >
            Einloggen
          </button>

          <div className="flex flex-col gap-2 text-xs text-secondary/70 dark:text-accent/70 mt-2">
            <span>
              Noch kein Kunde?{' '}
              <Link
                href="/signup-01"
                className="text-accent hover:underline underline-offset-2"
              >
                Jetzt Konto erstellen
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginHero;
