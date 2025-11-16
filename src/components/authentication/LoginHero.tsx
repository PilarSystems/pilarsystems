'use client';

import RevealAnimation from '@/components/animation/RevealAnimation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

type LoginHeroProps = {
  loginAction?: (formData: FormData) => void;
  status?: string;
  error?: string;
};

const LoginHero = ({ loginAction, status, error }: LoginHeroProps) => {
  const router = useRouter();

  const handleClientSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!loginAction) {
      e.preventDefault();
      router.push('/dashboard');
    }
  };

  const gradientTextClass =
    'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7] bg-clip-text text-transparent';

  const renderAlert = () => {
    if (error) {
      let message = 'Beim Einloggen ist ein Fehler aufgetreten. Bitte prüfe deine Daten.';

      if (error === 'missing_fields') {
        message = 'Bitte fülle E-Mail und Passwort aus.';
      } else if (error === 'invalid_credentials') {
        message = 'E-Mail oder Passwort ist falsch. Bitte überprüfe deine Eingaben.';
      }

      return (
        <div className="mb-5 max-w-2xl mx-auto rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {message}
        </div>
      );
    }

    if (status === 'confirmed') {
      return (
        <div className="mb-5 max-w-2xl mx-auto rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Deine E-Mail wurde erfolgreich bestätigt. Du kannst dich jetzt einloggen.
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16">
        {/* Headline */}
        <RevealAnimation delay={0.1}>
          <div className="mb-10 space-y-3 text-center">
            <span className="badge badge-cyan-v2">Willkommen zurück</span>
            <h1 className="text-heading-3 md:text-heading-2">
              In dein Pilar Dashboard einloggen
            </h1>
            <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl mx-auto">
              Greife auf deine Leads, Termine und alle Konversationen deiner KI-Rezeption zu.
              Volle Kontrolle – in Echtzeit, von überall.
            </p>
          </div>
        </RevealAnimation>

        {renderAlert()}

        {/* Layout: links Info, rechts Formular */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* Left – Why / Info */}
          <RevealAnimation delay={0.2} direction="left">
            <div className="space-y-6 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/80 dark:bg-background-8/80 px-6 py-6 md:px-8 md:py-8 shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur">
              <p className="text-tagline-1 uppercase tracking-[0.18em] text-secondary/60 dark:text-accent/60">
                pilar systems · dashboard
              </p>
              <h2 className="text-heading-5 md:text-heading-4">
                Alles, was an deiner Studio-Tür passiert,{` `}
                <span className={gradientTextClass}>
                  landet hier – sortiert und auswertbar.
                </span>
              </h2>
              <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">
                Von der ersten WhatsApp-Anfrage bis zum abgeschlossenen Vertrag:
                deine KI-Rezeption sammelt alle Daten, du siehst die klare Übersicht.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Lead- & Terminübersicht',
                    text: 'Sieh genau, welche Anfragen gerade laufen, welche nachfassen brauchen und welche abgeschlossen sind.',
                  },
                  {
                    title: 'Konversationen im Überblick',
                    text: 'Filtere Chats nach Kanal, Status oder Mitarbeiter und steig bei Bedarf direkt live ein.',
                  },
                  {
                    title: 'Volle Kontrolle über deine KI',
                    text: 'Passe Antworten, Öffnungszeiten, Angebote und Kampagnen zentral an – ohne Technik-Frust.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-[3px] flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                    </div>
                    <div>
                      <p className="text-tagline-1 font-semibold">{item.title}</p>
                      <p className="text-tagline-2 text-secondary/65 dark:text-accent/70">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-tagline-3 text-secondary/80 dark:text-accent">
                <p className="font-semibold mb-1">Noch kein Zugang?</p>
                <p>
                  Dann starte mit deinem Setup:{' '}
                  <Link
                    href="/signup-01"
                    className={`font-semibold underline underline-offset-2 ${gradientTextClass}`}
                  >
                    Konto erstellen
                  </Link>
                  .
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Right – Login-Form */}
          <RevealAnimation delay={0.25} direction="up">
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_0_40px_rgba(15,23,42,0.5)] backdrop-blur">
              <form
                action={loginAction}
                onSubmit={handleClientSubmit}
                className="space-y-6"
              >
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    E-Mail
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                    placeholder="dein@email.de"
                  />
                </div>

                {/* Passwort */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Passwort
                    </label>
                    <Link
                      href="/forgot-password"
                      className={`text-tagline-2 underline underline-offset-2 ${gradientTextClass}`}
                    >
                      Passwort vergessen?
                    </Link>
                  </div>
                  <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                    placeholder="••••••••"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-tagline-2 text-secondary/75 dark:text-accent/80 cursor-pointer">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-stroke-3 dark:border-stroke-6 bg-background-1 text-accent focus:ring-accent/60"
                    />
                    Angemeldet bleiben
                  </label>
                </div>

                {/* Button + Link */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full"
                  >
                    Einloggen
                  </button>
                  <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 text-center">
                    Noch kein Konto?{' '}
                    <Link
                      href="/signup-01"
                      className={`font-semibold underline underline-offset-2 ${gradientTextClass}`}
                    >
                      Jetzt starten
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default LoginHero;
