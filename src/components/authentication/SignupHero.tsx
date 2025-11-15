'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

type SignupHeroProps = {
  signupAction: (formData: FormData) => void;
};

const SignupHero: React.FC<SignupHeroProps> = ({ signupAction }) => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const status = searchParams.get('status');

  const renderMessage = () => {
    if (status === 'signup_success') {
      return (
        <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          ✅ Konto angelegt. Bitte bestätige deine E-Mail (Posteingang & Spam prüfen).
        </div>
      );
    }

    if (!error) return null;

    let text = 'Etwas ist schiefgelaufen. Bitte versuch es erneut.';
    switch (error) {
      case 'missing_fields':
        text = 'Bitte fülle alle Pflichtfelder aus.';
        break;
      case 'password_mismatch':
        text = 'Die beiden Passwörter stimmen nicht überein.';
        break;
      case 'signup_failed':
        text = 'Registrierung fehlgeschlagen. Bitte E-Mail-Adresse prüfen oder später erneut versuchen.';
        break;
    }

    return (
      <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {text}
      </div>
    );
  };

  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr,1fr] items-start">
      {/* Linke Seite – Text / USP */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <span className="size-2 rounded-full bg-accent" />
          Schritt 1 von 3 · Konto erstellen
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
          Erstelle dein Pilar-Konto in&nbsp;
          <span className="text-accent">unter 2 Minuten</span>.
        </h1>
        <p className="text-sm md:text-base text-secondary/70 dark:text-accent/80 max-w-xl">
          Sichere dir deinen Zugang zu deinem KI-Rezeptionisten, automatisierten Leads
          und einem komplett vorgebauten Gym-OS. Keine Kreditkarte im ersten Schritt
          nötig – du schließt dein Abo im nächsten Schritt über Stripe ab.
        </p>

        <ul className="space-y-2 text-sm text-secondary/80 dark:text-accent/80">
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>1 Login für Dashboard, KI-Kanäle und Trainingsplan-Generator.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>DSGVO-konforme Datenhaltung & Hosting in der EU.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[3px] size-[14px] rounded-full bg-accent/15 text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>Später jederzeit Plan upgraden – komplett ohne Setup-Chaos.</span>
          </li>
        </ul>

        <div className="rounded-2xl border border-stroke-2/70 dark:border-stroke-6/70 bg-background-1/80 dark:bg-background-6/80 p-4 text-xs md:text-sm text-secondary/70 dark:text-accent/80">
          <p className="font-medium mb-1">Was passiert nach diesem Schritt?</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Konto erstellen & E-Mail bestätigen.</li>
            <li>Preise & Plan wählen, Stripe-Checkout abschließen.</li>
            <li>Onboarding-Assistent starten & deine KI konfigurieren.</li>
          </ol>
        </div>
      </div>

      {/* Rechte Seite – Formular */}
      <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-6/90 p-6 md:p-7 shadow-lg shadow-black/5">
        {renderMessage()}

        <form action={signupAction} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Vorname*
              </label>
              <input
                name="firstName"
                required
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Nachname*
              </label>
              <input
                name="lastName"
                required
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                placeholder="Mustermann"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
              Geschäfts-E-Mail*
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
              Studio-Name*
            </label>
            <input
              name="studioName"
              required
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
              placeholder="Beispiel: Strong Gym Wolfsburg"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Studio-Website (optional)
              </label>
              <input
                name="studioWebsite"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                placeholder="https://dein-studio.de"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Mitgliederanzahl (ca.)*
              </label>
              <select
                name="members"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                <option value="<200">Unter 200</option>
                <option value="200-500">200 – 500</option>
                <option value="500-1000">500 – 1.000</option>
                <option value=">1000">Über 1.000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
              Handynummer (für Rückfragen / WhatsApp)* 
            </label>
            <input
              name="phone"
              required
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
              placeholder="+49 170 1234567"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Passwort*
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                placeholder="Mind. 8 Zeichen"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary/80 dark:text-accent/80 mb-1">
                Passwort wiederholen*
              </label>
              <input
                name="passwordConfirm"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-3 py-2.5 text-sm focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
                placeholder="Nochmal eingeben"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary hover:btn-secondary dark:hover:btn-accent w-full md:w-auto"
          >
            Weiter zur Zahlungsseite
          </button>

          <p className="text-xs text-secondary/60 dark:text-accent/60">
            Mit dem Fortfahren akzeptierst du unsere Nutzungsbedingungen und die Datenschutzerklärung.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupHero;
