// src/components/dashboard/OnboardingWizard.tsx
'use client';

import { useState, useMemo } from 'react';
import RevealAnimation from '@/components/animation/RevealAnimation';

type StepId = 1 | 2 | 3 | 4 | 5;

const steps: { id: StepId; label: string; description: string }[] = [
  {
    id: 1,
    label: 'Studio & Basisdaten',
    description: 'Name, Standort & Positionierung deines Studios.',
  },
  {
    id: 2,
    label: 'Stimme & Tonalität',
    description: 'ElevenLabs-Stimme und Sprachstil deiner KI.',
  },
  {
    id: 3,
    label: 'Kanäle verknüpfen',
    description: 'Telefon, WhatsApp & E-Mail für deine KI.',
  },
  {
    id: 4,
    label: 'Öffnungszeiten & Regeln',
    description: 'Wann & wie deine KI antwortet.',
  },
  {
    id: 5,
    label: 'Angebote & Leads',
    description: 'Was die KI aktiv anbietet & wie sie Leads qualifiziert.',
  },
];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [isFinished, setIsFinished] = useState(false);

  const progressPercent = useMemo(() => {
    const idx = steps.findIndex((s) => s.id === currentStep);
    return Math.round(((idx + 1) / steps.length) * 100);
  }, [currentStep]);

  const goNext = () => {
    if (currentStep === 5) {
      setIsFinished(true);
      return;
    }
    setCurrentStep((prev) => (prev + 1) as StepId);
  };

  const goPrev = () => {
    if (currentStep === 1) return;
    setCurrentStep((prev) => (prev - 1) as StepId);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-heading-6">Studio & Basisdaten</h3>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              Wir geben deiner KI Kontext, damit sie wie deine beste Studioleitung
              wirkt – nur 24/7 erreichbar.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Studio-Name
                </label>
                <input
                  name="studioName"
                  type="text"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="z. B. Iron Club Wolfsburg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Standort / Stadt
                </label>
                <input
                  name="city"
                  type="text"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="z. B. Wolfsburg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                Positionierung / Zielgruppe
              </label>
              <textarea
                name="positioning"
                rows={3}
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                placeholder="Premium-Studio, Fokus auf Personal Training & Langhanteltraining, eher 25–45 Jahre, hohe Zahlungsbereitschaft…"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-heading-6">Stimme & Tonalität</h3>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              So klingt deine KI – ElevenLabs verbinden wir im Hintergrund mit diesen
              Einstellungen.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  ElevenLabs-Stimme (Placeholder-Auswahl)
                </label>
                <select
                  name="voice"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-[11px] text-sm text-secondary dark:text-accent focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  defaultValue="male_calm"
                >
                  <option value="male_calm">Männlich – ruhig & kompetent</option>
                  <option value="female_friendly">
                    Weiblich – freundlich & motivierend
                  </option>
                  <option value="neutral_modern">Neutral – modern & klar</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Sprache / Dialekt
                </label>
                <select
                  name="language"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-[11px] text-sm text-secondary dark:text-accent focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  defaultValue="de_de"
                >
                  <option value="de_de">Deutsch – Standard</option>
                  <option value="de_at">Deutsch – Österreich</option>
                  <option value="de_ch">Deutsch – Schweiz</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                Tonalität
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    value: 'loyal',
                    label: 'Bodenständig & hilfsbereit',
                  },
                  {
                    value: 'high_energy',
                    label: 'Motivierend & high energy',
                  },
                  {
                    value: 'premium',
                    label: 'Premium & sehr professionell',
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-3 py-2 text-tagline-3 text-secondary/80 dark:text-accent/85 hover:border-accent/90 hover:shadow-[0_0_18px_rgba(129,140,248,0.45)] transition"
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      className="h-4 w-4 accent-accent"
                      defaultChecked={option.value === 'loyal'}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-heading-6">Kanäle verknüpfen</h3>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              Wir fragen alle Nummern & E-Mails ab, die deine KI später benutzt.
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Telefon-Nummer des Studios
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="+49 531 1234567"
                />
              </div>

              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  WhatsApp-Nummer (Business)
                </label>
                <input
                  name="whatsapp"
                  type="tel"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="+49 151 23456789"
                />
              </div>

              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  E-Mail für Anfragen
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="studio@dein-gym.de"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-heading-6">Öffnungszeiten & Regeln</h3>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              Hier definierst du, wann deine KI Termine vergeben darf und welche
              Themen tabu sind.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Öffnungszeiten (Kurzbeschreibung)
                </label>
                <textarea
                  name="openingHours"
                  rows={3}
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="Mo–Fr 06:00–23:00 Uhr, Sa–So 08:00–22:00 Uhr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                  Wichtige Regeln / No-Gos
                </label>
                <textarea
                  name="rules"
                  rows={3}
                  className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                  placeholder="Keine medizinische Beratung, keine Preisverhandlungen per WhatsApp, keine Stornierung am selben Tag…"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-heading-6">Angebote & Lead-Qualifizierung</h3>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              Was deine KI aktiv anbietet – und wann sie einen Lead als „heiß“
              markiert.
            </p>

            <div className="space-y-2">
              <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                Haupt-Angebote / Mitgliedschaften
              </label>
              <textarea
                name="offers"
                rows={3}
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                placeholder="12-Monatsvertrag, 24-Monatsvertrag, Probetraining, Studententarif, Day Pass…"
              />
            </div>

            <div className="space-y-2">
              <label className="text-tagline-2 font-medium text-secondary dark:text-accent">
                Wann ein Lead „heiß“ ist
              </label>
              <textarea
                name="hotLeadRules"
                rows={3}
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3/80 dark:bg-background-7/80 px-4 py-3 text-sm text-secondary dark:text-accent placeholder:text-secondary/40 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/70"
                placeholder="z. B. will direkt Termin buchen, fragt konkret nach Preisen, will direkt Mitglied werden…"
              />
            </div>
          </div>
        );
    }
  };

  if (isFinished) {
    return (
      <RevealAnimation delay={0.1}>
        <div className="space-y-4 rounded-2xl border border-accent/40 bg-gradient-to-br from-background-1/90 via-background-2/90 to-accent/10 dark:from-background-8/95 dark:via-background-9/95 dark:to-accent/15 px-6 py-6 md:px-8 md:py-8 shadow-[0_0_40px_rgba(129,140,248,0.35)]">
          <span className="badge badge-cyan-v2">Setup abgeschlossen</span>
          <h2 className="text-heading-4 md:text-heading-3">
            Deine KI-Rezeption wird jetzt vorbereitet.
          </h2>
          <p className="text-tagline-1 text-secondary/75 dark:text-accent/85 max-w-2xl">
            Wir übernehmen deine Einstellungen für Stimme, Kanäle und Angebote.
            In Kürze laufen die ersten Anrufe, WhatsApp-Nachrichten und E-Mails
            durch dein neues System. Du kannst alle Angaben jederzeit im
            Dashboard anpassen.
          </p>
        </div>
      </RevealAnimation>
    );
  }

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Progress-Card */}
      <RevealAnimation delay={0.05}>
        <div className="rounded-2xl border border-stroke-2/80 dark:border-stroke-6/80 bg-background-1/90 dark:bg-background-8/90 px-4 py-4 md:px-6 md:py-5 shadow-[0_0_30px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-tagline-3 uppercase tracking-[0.18em] text-secondary/60 dark:text-accent/60">
                Setup-Assistent
              </p>
              <p className="text-tagline-1 font-medium text-secondary dark:text-accent">
                Schritt {currentIndex + 1} von {steps.length}:{' '}
                {steps[currentIndex].label}
              </p>
              <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                {steps[currentIndex].description}
              </p>
            </div>

            <div className="flex items-center justify-start md:justify-end gap-3">
              <div className="relative h-10 w-10 rounded-full bg-background-3/80 dark:bg-background-9/80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-accent/30" />
                <span className="text-tagline-2 font-semibold text-secondary dark:text-accent">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress-Bar */}
          <div className="mt-4 h-1.5 w-full rounded-full bg-stroke-3/80 dark:bg-stroke-6/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </RevealAnimation>

      {/* Step-Content */}
      <RevealAnimation delay={0.1} direction="up">
        <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/95 px-5 py-6 md:px-7 md:py-8 space-y-6">
          {renderStep()}

          <div className="flex items-center justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 1}
              className="btn btn-ghost btn-sm md:btn-md disabled:opacity-40"
            >
              Zurück
            </button>
            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-sm md:btn-md"
            >
              {currentStep === 5 ? 'Setup abschließen' : 'Weiter'}
            </button>
          </div>
        </div>
      </RevealAnimation>
    </div>
  );
};

export default OnboardingWizard;
