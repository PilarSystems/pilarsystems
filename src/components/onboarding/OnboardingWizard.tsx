// src/components/onboarding/OnboardingWizard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RevealAnimation from '@/components/animation/RevealAnimation';

type StepId = 1 | 2 | 3 | 4;

type ChannelState = {
  phone: string;
  whatsapp: string;
  email: string;
};

type GymState = {
  studioName: string;
  city: string;
  members: string;
  openingHours: string;
};

type VoiceId = 'calm_female' | 'dynamic_male' | 'neutral_ai';

type VoiceState = {
  voiceId: VoiceId;
  style: string;
  greeting: string;
};

const voices: {
  id: VoiceId;
  name: string;
  subtitle: string;
  previewUrl: string;
  defaultGreeting: string;
}[] = [
  {
    id: 'calm_female',
    name: 'Ruhige Stimme – weiblich',
    subtitle: 'Professionell, ruhig, vertrauensvoll',
    previewUrl: '/audio/voice-calm-female.mp3',
    defaultGreeting:
      'Hallo, ich bin die digitale Rezeption von Pilar Systems. Wie kann ich dir heute helfen?',
  },
  {
    id: 'dynamic_male',
    name: 'Dynamische Stimme – männlich',
    subtitle: 'Energisch, motivierend, modern',
    previewUrl: '/audio/voice-dynamic-male.mp3',
    defaultGreeting:
      'Hey, ich bin dein virtueller Ansprechpartner von Pilar Systems. Was kann ich für dich tun?',
  },
  {
    id: 'neutral_ai',
    name: 'Neutrale KI-Stimme',
    subtitle: 'Sachlich, klar, universell einsetzbar',
    previewUrl: '/audio/voice-neutral.mp3',
    defaultGreeting:
      'Willkommen bei deinem Studio! Ich bin die KI-Rezeption von Pilar Systems. Wobei kann ich unterstützen?',
  },
];

const steps: { id: StepId; label: string; description: string }[] = [
  {
    id: 1,
    label: 'Studio-Basisdaten',
    description: 'Name, Standort, Größe & Öffnungszeiten deines Studios.',
  },
  {
    id: 2,
    label: 'Kanäle verbinden',
    description: 'Telefon, WhatsApp und E-Mail, über die deine KI erreichbar ist.',
  },
  {
    id: 3,
    label: 'Stimme & Stil',
    description: 'Wähle die Stimme, Beispiele und den Stil deiner KI-Rezeption.',
  },
  {
    id: 4,
    label: 'Zusammenfassung',
    description: 'Alles prüfen & Setup starten.',
  },
];

const OnboardingWizard = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<StepId>(1);

  const [gym, setGym] = useState<GymState>({
    studioName: '',
    city: '',
    members: '100-300',
    openingHours: '',
  });

  const [channels, setChannels] = useState<ChannelState>({
    phone: '',
    whatsapp: '',
    email: '',
  });

  const [voice, setVoice] = useState<VoiceState>({
    voiceId: 'calm_female',
    style: 'freundlich, professionell, klar',
    greeting: voices[0].defaultGreeting,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const progressPercent = (currentStep / steps.length) * 100;

  const handlePlayPreview = (previewUrl: string, _label: string) => {
    try {
      const audio = new Audio(previewUrl);
      audio.play();
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  };

  const goNext = () => {
    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as StepId) : prev));
  };

  const goBack = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        gym,
        channels,
        voice,
      };

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Onboarding konnte nicht gespeichert werden.');
      }

      // Wenn alles ok → ins Dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err?.message ?? 'Es ist ein Fehler beim Speichern aufgetreten.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Headline */}
      <RevealAnimation delay={0.1}>
        <div className="space-y-3 text-center">
          <span className="badge badge-cyan-v2">
            Setup {currentStep} von {steps.length}
          </span>
          <h1 className="text-heading-3 md:text-heading-2">
            Dein Pilar Setup abschließen
          </h1>
          <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl mx-auto">
            Wir richten jetzt deine KI-Rezeption ein – von den Studio-Basisdaten
            über deine Kontaktkanäle bis hin zur Stimme, die deine Mitglieder
            begrüßt.
          </p>
        </div>
      </RevealAnimation>

      {/* Progress-Bar */}
      <RevealAnimation delay={0.15}>
        <div className="space-y-3">
          <div className="flex justify-between text-tagline-3 text-secondary/70 dark:text-accent/70">
            <span>{steps.find((s) => s.id === currentStep)?.label}</span>
            <span>{Math.round(progressPercent)} % abgeschlossen</span>
          </div>
          <div className="h-2 w-full rounded-full bg-background-1 dark:bg-background-8 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </RevealAnimation>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Left: aktueller Step */}
        <RevealAnimation delay={0.2} direction="up">
          <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-8 px-5 py-6 md:px-7 md:py-7 shadow-[0_0_40px_rgba(15,23,42,0.35)]">
            {currentStep === 1 && (
              <Step1Gym gym={gym} setGym={setGym} />
            )}
            {currentStep === 2 && (
              <Step2Channels channels={channels} setChannels={setChannels} />
            )}
            {currentStep === 3 && (
              <Step3Voice
                voice={voice}
                setVoice={setVoice}
                onPlayPreview={handlePlayPreview}
              />
            )}
            {currentStep === 4 && (
              <Step4Summary
                gym={gym}
                channels={channels}
                voice={voice}
              />
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 1 || isSubmitting}
                className="btn btn-outline btn-md w-full md:w-auto disabled:opacity-40"
              >
                Zurück
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full md:w-auto"
                >
                  Weiter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full md:w-auto disabled:opacity-60"
                >
                  {isSubmitting ? 'Setup wird abgeschlossen…' : 'Setup abschließen & ins Dashboard'}
                </button>
              )}
            </div>

            {submitError && (
              <p className="mt-3 text-tagline-3 text-red-500">
                {submitError}
              </p>
            )}
          </div>
        </RevealAnimation>

        {/* Right: Step-Liste / Erklärungen */}
        <RevealAnimation delay={0.25} direction="up">
          <aside className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/80 dark:bg-background-8/80 px-5 py-6 md:px-6 md:py-7 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur">
            <h2 className="text-heading-6 mb-3">Dein Setup-Fahrplan</h2>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-4">
              Wir speichern deine Eingaben automatisch nach Abschluss. Du kannst
              alles später im Dashboard anpassen.
            </p>

            <div className="space-y-3">
              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isDone = step.id < currentStep;

                return (
                  <div
                    key={step.id}
                    className={[
                      'flex gap-3 rounded-xl border px-3 py-3 text-left transition-all',
                      isActive
                        ? 'border-accent/80 bg-accent/10'
                        : isDone
                        ? 'border-emerald-400/70 bg-emerald-400/5'
                        : 'border-stroke-3 dark:border-stroke-6 bg-background-2/60 dark:bg-background-9/40',
                    ].join(' ')}
                  >
                    <div className="mt-[2px]">
                      <div
                        className={[
                          'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold',
                          isDone
                            ? 'bg-emerald-400 text-black'
                            : isActive
                            ? 'bg-accent text-black'
                            : 'bg-background-3 dark:bg-background-7 text-secondary/70 dark:text-accent/70',
                        ].join(' ')}
                      >
                        {isDone ? '✓' : step.id}
                      </div>
                    </div>
                    <div>
                      <p className="text-tagline-1 font-semibold">
                        {step.label}
                      </p>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </RevealAnimation>
      </div>
    </div>
  );
};

export default OnboardingWizard;

// ================== Einzelne Step-Komponenten ==================

type Step1Props = {
  gym: GymState;
  setGym: (val: GymState) => void;
};

const Step1Gym = ({ gym, setGym }: Step1Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-heading-5">Studio-Basisdaten</h2>
      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
        Diese Infos nutzt deine KI für Begrüßungen, Antworten und
        Standort-bezogene Fragen.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            Studio-Name
          </label>
          <input
            type="text"
            value={gym.studioName}
            onChange={(e) => setGym({ ...gym, studioName: e.target.value })}
            placeholder="Pilar Gym Wolfsburg"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            Stadt / Standort
          </label>
          <input
            type="text"
            value={gym.city}
            onChange={(e) => setGym({ ...gym, city: e.target.value })}
            placeholder="Wolfsburg"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            Mitgliederanzahl (ca.)
          </label>
          <select
            value={gym.members}
            onChange={(e) => setGym({ ...gym, members: e.target.value })}
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-[11px] text-sm md:text-base text-secondary dark:text-accent focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          >
            <option value="<100">Weniger als 100</option>
            <option value="100-300">100 – 300</option>
            <option value="300-600">300 – 600</option>
            <option value="600-1000">600 – 1.000</option>
            <option value=">1000">Über 1.000</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            Öffnungszeiten (Kurzbeschreibung)
          </label>
          <textarea
            value={gym.openingHours}
            onChange={(e) => setGym({ ...gym, openingHours: e.target.value })}
            rows={3}
            placeholder="z.B. Mo–Fr 6–23 Uhr, Sa–So 8–22 Uhr"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
        </div>
      </div>
    </div>
  );
};

type Step2Props = {
  channels: ChannelState;
  setChannels: (val: ChannelState) => void;
};

const Step2Channels = ({ channels, setChannels }: Step2Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-heading-5">Kanäle verbinden</h2>
      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
        Gib die Kontaktdaten an, über die deine KI erreichbar sein soll.
        Technische Verknüpfung (Telefonanlage, WhatsApp-API etc.) richten wir
        im Hintergrund ein.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            Telefonnummer Studio / Rezeption
          </label>
          <input
            type="tel"
            value={channels.phone}
            onChange={(e) => setChannels({ ...channels, phone: e.target.value })}
            placeholder="+49 531 1234567"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            WhatsApp-Nummer (Business)
          </label>
          <input
            type="tel"
            value={channels.whatsapp}
            onChange={(e) =>
              setChannels({ ...channels, whatsapp: e.target.value })
            }
            placeholder="+49 151 23456789"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
          <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">
            Wir unterstützen dich später bei der Verknüpfung mit der offiziellen
            WhatsApp Business API.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
            E-Mail-Adresse für Anfragen
          </label>
          <input
            type="email"
            value={channels.email}
            onChange={(e) =>
              setChannels({ ...channels, email: e.target.value })
            }
            placeholder="empfang@dein-gym.de"
            className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
          />
        </div>
      </div>
    </div>
  );
};

type Step3Props = {
  voice: VoiceState;
  setVoice: (val: VoiceState) => void;
  onPlayPreview: (url: string, label: string) => void;
};

const Step3Voice = ({ voice, setVoice, onPlayPreview }: Step3Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-heading-5">Stimme & Stil deiner KI</h2>
      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
        Wähle eine Stimme aus und höre dir ein Beispiel an. Jede Stimme sagt
        eine kurze Begrüßung im Stil von:{' '}
        <span className="font-semibold">
          „Hallo, ich bin … von Pilar Systems.“
        </span>
      </p>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          {voices.map((v) => {
            const isActive = v.id === voice.voiceId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() =>
                  setVoice({
                    ...voice,
                    voiceId: v.id,
                    greeting: v.defaultGreeting,
                  })
                }
                className={[
                  'flex flex-col items-start gap-2 rounded-2xl border px-4 py-4 text-left transition-all',
                  isActive
                    ? 'border-accent/90 bg-accent/10 shadow-[0_0_25px_rgba(129,140,248,0.3)] scale-[1.02]'
                    : 'border-stroke-3 dark:border-stroke-6 bg-background-2/70 dark:bg-background-9/60 hover:scale-[1.01]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div>
                    <p className="text-tagline-1 font-semibold">{v.name}</p>
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      {v.subtitle}
                    </p>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-accent px-3 py-[2px] text-[11px] font-semibold text-black">
                      Ausgewählt
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayPreview(v.previewUrl, v.name);
                  }}
                  className="mt-1 inline-flex items-center gap-2 text-tagline-3 underline underline-offset-2 text-secondary dark:text-accent"
                >
                  ▶ Beispiel anhören
                </button>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
              Beschreibe den Stil deiner KI
            </label>
            <input
              type="text"
              value={voice.style}
              onChange={(e) => setVoice({ ...voice, style: e.target.value })}
              placeholder="z.B. freundlich, professionell, klar, nicht zu aufdringlich"
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-tagline-1 font-medium text-secondary dark:text-accent">
              Individuelle Begrüßung
            </label>
            <textarea
              rows={3}
              value={voice.greeting}
              onChange={(e) =>
                setVoice({
                  ...voice,
                  greeting: e.target.value,
                })
              }
              className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
            />
            <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">
              Diese Begrüßung wird als Vorlage für deine ElevenLabs-Stimme
              verwendet. Beispiel:{' '}
              <span className="italic">
                „Hallo, ich bin Mia, deine digitale Rezeption von Pilar Systems
                im Pilar Gym Wolfsburg. Wie kann ich dir helfen?“
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type Step4Props = {
  gym: GymState;
  channels: ChannelState;
  voice: VoiceState;
};

const Step4Summary = ({ gym, channels, voice }: Step4Props) => {
  const selectedVoice = voices.find((v) => v.id === voice.voiceId)!;

  return (
    <div className="space-y-6">
      <h2 className="text-heading-5">Zusammenfassung & Bestätigung</h2>
      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
        Prüfe deine Angaben. Mit „Setup abschließen“ starten wir im Hintergrund
        die Konfiguration deiner KI-Rezeption. Du kannst später im Dashboard
        alles nachjustieren.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-2/80 dark:bg-background-8/80 px-4 py-4">
          <h3 className="text-tagline-1 font-semibold">Studio</h3>
          <p className="text-tagline-2">
            <span className="font-medium">Name:</span>{' '}
            {gym.studioName || '–'}
          </p>
          <p className="text-tagline-2">
            <span className="font-medium">Stadt:</span> {gym.city || '–'}
          </p>
          <p className="text-tagline-2">
            <span className="font-medium">Mitglieder:</span>{' '}
            {gym.members || '–'}
          </p>
          <p className="text-tagline-2">
            <span className="font-medium">Öffnungszeiten:</span>{' '}
            {gym.openingHours || '–'}
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-2/80 dark:bg-background-8/80 px-4 py-4">
          <h3 className="text-tagline-1 font-semibold">Kanäle</h3>
          <p className="text-tagline-2">
            <span className="font-medium">Telefon:</span>{' '}
            {channels.phone || '–'}
          </p>
          <p className="text-tagline-2">
            <span className="font-medium">WhatsApp:</span>{' '}
            {channels.whatsapp || '–'}
          </p>
          <p className="text-tagline-2">
            <span className="font-medium">E-Mail:</span>{' '}
            {channels.email || '–'}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-2/80 dark:bg-background-8/80 px-4 py-4">
        <h3 className="text-tagline-1 font-semibold">Stimme & Stil</h3>
        <p className="text-tagline-2">
          <span className="font-medium">Stimme:</span> {selectedVoice.name}
        </p>
        <p className="text-tagline-2">
          <span className="font-medium">Stil:</span>{' '}
          {voice.style || '–'}
        </p>
        <p className="text-tagline-2">
          <span className="font-medium">Begrüßung:</span>
        </p>
        <p className="text-tagline-3 text-secondary/80 dark:text-accent/80 bg-background-1 dark:bg-background-9 rounded-xl px-3 py-2">
          {voice.greeting}
        </p>
      </div>
    </div>
  );
};
