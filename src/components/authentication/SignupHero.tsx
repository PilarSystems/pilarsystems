'use client';

import RevealAnimation from '@/components/animation/RevealAnimation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

type SignupHeroProps = {
  signupAction?: (formData: FormData) => void;
  status?: string;
  error?: string;
};

const SignupHero = ({ signupAction, status, error }: SignupHeroProps) => {
  const router = useRouter();

  const handleClientSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!signupAction) {
      e.preventDefault();
      router.push('/checkout');
    }
  };

  const gradientTextClass =
    'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7] bg-clip-text text-transparent';

  const renderAlert = () => {
    // ❌ Fehler-Messages
    if (error) {
      let message =
        'Beim Erstellen deines Kontos ist ein Fehler aufgetreten. Bitte versuche es erneut.';

      if (error === 'missing_fields') {
        message = 'Bitte fülle alle Pflichtfelder aus.';
      } else if (error === 'password_mismatch') {
        message = 'Die beiden Passwörter stimmen nicht überein.';
      } else if (error === 'signup_failed') {
        message =
          'Dein Konto konnte nicht erstellt werden. Prüfe deine E-Mail und versuche es erneut.';
      }

      return (
        <div className="mb-5 max-w-2xl mx-auto rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {message}
        </div>
      );
    }

    // ✅ Schritt 1: Signup erfolgreich, Mail wurde verschickt
    if (status === 'signup_success') {
      return (
        <div className="mb-5 max-w-2xl mx-auto rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          <p className="font-semibold mb-1">Bestätigungs-E-Mail wurde versendet</p>
          <p className="mb-1">
            Wir haben dir soeben eine E-Mail geschickt. Bitte bestätige deine Adresse,
            damit dein Zugang zu Pilar Systems vollständig aktiviert wird.
          </p>
          <p>
            Während du dein Postfach checkst, kannst du direkt{' '}
            <span className="font-semibold">mit der Zahlung fortfahren</span>.
          </p>
        </div>
      );
    }

    // ✅ Schritt 2: E-Mail aus Link bestätigt (optional für später)
    if (status === 'confirmed') {
      return (
        <div className="mb-5 max-w-2xl mx-auto rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Deine E-Mail wurde erfolgreich bestätigt. Du kannst dich jetzt einloggen und
          mit dem Setup fortfahren.
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-0 md:py-2 lg:py-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Headline */}
        <RevealAnimation delay={0.1}>
          <div className="mb-10 space-y-3 text-center">
            <span className="badge badge-cyan-v2">Schritt 1 von 3</span>
            <h1 className="text-heading-3 md:text-heading-2">
              Dein Pilar-Konto erstellen
            </h1>
            <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl mx-auto">
              Sag uns kurz, wer du bist und wie dein Studio aussieht.
              Danach leitest du dein Abo über Stripe ein und dein Dashboard
              wird automatisch für dich vorbereitet.
            </p>
          </div>
        </RevealAnimation>

        {renderAlert()}

        {/* Layout: links Benefits, rechts Formular */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* Left – Value / Benefits */}
          <RevealAnimation delay={0.2} direction="left">
            <div className="space-y-6 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/80 dark:bg-background-8/80 px-6 py-6 md:px-8 md:py-8 shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur">
              <p className="text-tagline-1 uppercase tracking-[0.18em] text-secondary/60 dark:text-accent/60">
                pilar systems · ki-rezeptionist
              </p>
              <h2 className="text-heading-5 md:text-heading-4">
                In wenigen Minuten von
                <span className={`ml-1 ${gradientTextClass}`}>Chaos zu Klarheit</span>.
              </h2>
              <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">
                Nach dem Setup läuft dein Empfang über WhatsApp, Telefon
                und E-Mail automatisch – Leads, Termine und Antworten
                landen sauber in deinem Dashboard.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Kein Personalstress mehr am Empfang',
                    text: '24/7 Erreichbarkeit für Interessenten und Mitglieder – ohne Überstunden, Ausfälle oder Schichtpläne.',
                  },
                  {
                    title: 'Mehr Leads & Termine aus denselben Anfragen',
                    text: 'Automatisierte Qualifizierung & Terminvergabe, damit aus Anfragen echte Mitgliedschaften werden.',
                  },
                  {
                    title: 'Saubere Datenbasis für dein Wachstum',
                    text: 'Alle Konversationen, Leads und Termine zentral im Dashboard – vorbereitet für deine nächsten Kampagnen.',
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

              {/* CTA Box links */}
              <div className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-tagline-3 text-secondary/80 dark:text-accent">
                <p className="font-semibold mb-1">Was du jetzt erledigst:</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Stammdaten für dich &amp; dein Studio</li>
                  <li>Basisinfos für die KI (Mitgliedergröße, Kontaktdaten)</li>
                  <li>Direkter Übergang zur Zahlung via Stripe</li>
                </ul>
              </div>

              {/* Falls Signup erfolgreich → extra Button zum Checkout */}
              {status === 'signup_success' && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/checkout')}
                    className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-sm w-full md:w-auto"
                  >
                    Weiter zur Zahlung
                  </button>
                </div>
              )}
            </div>
          </RevealAnimation>

          {/* Right – Formular */}
          <RevealAnimation delay={0.25} direction="up">
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_0_40px_rgba(15,23,42,0.5)] backdrop-blur">
              <form
                action={signupAction}
                onSubmit={handleClientSubmit}
                className="space-y-6"
              >
                {/* Vorname / Nachname */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Vorname
                    </label>
                    <input
                      required
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Nachname
                    </label>
                    <input
                      required
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      placeholder="Müller"
                    />
                  </div>
                </div>

                {/* E-Mail */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    Geschäftliche E-Mail
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                    placeholder="studio@dein-gym.de"
                  />
                </div>

                {/* Studio */}
                <div className="space-y-2">
                  <label
                    htmlFor="studioName"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    Studio-Name
                  </label>
                  <input
                    required
                    id="studioName"
                    name="studioName"
                    type="text"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                    placeholder="Pilar Gym Wolfsburg"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="studioWebsite"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Studio-Website (optional)
                    </label>
                    <input
                      id="studioWebsite"
                      name="studioWebsite"
                      type="url"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      placeholder="https://www.dein-gym.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="members"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Mitgliederanzahl (ca.)
                    </label>
                    <select
                      id="members"
                      name="members"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-[11px] text-sm md:text-base text-secondary dark:text-accent focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      defaultValue="100-300"
                    >
                      <option value="<100">Weniger als 100</option>
                      <option value="100-300">100 – 300</option>
                      <option value="300-600">300 – 600</option>
                      <option value="600-1000">600 – 1.000</option>
                      <option value=">1000">Über 1.000</option>
                    </select>
                  </div>
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    Telefonnummer für Rückfragen
                  </label>
                  <input
                    required
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                    placeholder="+49 151 23456789"
                  />
                </div>

                {/* Passwort */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Passwort
                    </label>
                    <input
                      required
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="passwordConfirm"
                      className="text-tagline-1 font-medium text-secondary dark:text-accent"
                    >
                      Passwort wiederholen
                    </label>
                    <input
                      required
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Bedingungen */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="mt-[3px] h-4 w-4 rounded border-stroke-3 dark:border-stroke-6 bg-background-1 text-accent focus:ring-accent/60"
                    />
                    <label
                      htmlFor="terms"
                      className="text-tagline-2 text-secondary/80 dark:text-accent/80"
                    >
                      Ich akzeptiere die{' '}
                      <Link
                        href="/terms-conditions"
                        className={`underline underline-offset-2 ${gradientTextClass}`}
                      >
                        AGB
                      </Link>{' '}
                      und die{' '}
                      <Link
                        href="/privacy"
                        className={`underline underline-offset-2 ${gradientTextClass}`}
                      >
                        Datenschutzerklärung
                      </Link>
                      .
                    </label>
                  </div>
                </div>

                {/* Button + Login-Link */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full"
                  >
                    Weiter zur Zahlung
                  </button>
                  <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 text-center">
                    Du hast bereits Zugang?{' '}
                    <Link
                      href="/login-01"
                      className="font-semibold underline underline-offset-2"
                    >
                      Hier einloggen
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

export default SignupHero;
