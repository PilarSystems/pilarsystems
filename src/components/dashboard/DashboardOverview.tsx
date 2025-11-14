'use client';

import RevealAnimation from '@/components/animation/RevealAnimation';

const gradientTextClass =
  'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7] bg-clip-text text-transparent';

const DashboardOverview = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16">
      {/* Header */}
      <RevealAnimation delay={0.1}>
        <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-tagline-2 uppercase tracking-[0.18em] text-secondary/60 dark:text-accent/60">
              pilar systems · dashboard
            </p>
            <h1 className="text-heading-3 md:text-heading-2 mt-2">
              Willkommen im{' '}
              <span className={gradientTextClass}>Pilar Dashboard</span>
            </h1>
            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 mt-3 max-w-xl">
              Hier laufen alle Leads, Termine und Konversationen deiner KI-Rezeption
              zusammen. Klar sortiert, auswertbar und bereit für Wachstum.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <button className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-sm md:btn-md">
              Neue Kampagne starten
            </button>
            <button className="btn btn-outline btn-sm md:btn-md border-stroke-3 dark:border-stroke-6">
              Einstellungen / Setup
            </button>
          </div>
        </div>
      </RevealAnimation>

      {/* KPI Cards */}
      <RevealAnimation delay={0.18} direction="up">
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-10 md:mb-12">
          {[
            {
              label: 'Neue Leads (heute)',
              value: '18',
              sub: '+6 vs. gestern',
            },
            {
              label: 'Gebuchte Termine (diese Woche)',
              value: '47',
              sub: '78 % Show-Up-Rate',
            },
            {
              label: 'Aktive Konversationen',
              value: '32',
              sub: 'WhatsApp, Telefon & E-Mail',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/80 dark:bg-background-8/80 px-5 py-4 md:px-6 md:py-5 shadow-[0_0_40px_rgba(15,23,42,0.35)]"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7]" />
              <p className="text-tagline-2 text-secondary/65 dark:text-accent/70">
                {item.label}
              </p>
              <p className="mt-2 text-heading-4 md:text-heading-3">
                {item.value}
              </p>
              <p className="mt-1 text-tagline-2 text-secondary/60 dark:text-accent/65">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </RevealAnimation>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Konversationen & Termine */}
        <RevealAnimation delay={0.22} direction="left">
          <div className="space-y-6">
            {/* Konversationen */}
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-5 md:px-6 md:py-6 shadow-[0_0_40px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/65">
                    Live-Überblick
                  </p>
                  <h2 className="text-heading-5">
                    Aktive Konversationen
                  </h2>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-tagline-3 text-accent">
                  18 offen
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['Alle Kanäle', 'WhatsApp', 'Telefon', 'E-Mail'].map((chip, i) => (
                  <button
                    key={chip}
                    className={`rounded-full border px-3 py-1 text-tagline-3 ${
                      i === 0
                        ? 'border-transparent bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7] text-white'
                        : 'border-stroke-3 dark:border-stroke-6 text-secondary/75 dark:text-accent/80'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Lisa · Interessentin',
                    channel: 'WhatsApp',
                    preview: 'Hey, habt ihr auch 10er-Karten? Und wie sind die Öffnungszeiten am Wochenende?',
                    status: 'Antwort ausstehend',
                  },
                  {
                    name: 'Marco · Mitglied',
                    channel: 'Telefon',
                    preview: 'Ich würde meinen Vertrag upgraden – könnt ihr mir die Unterschiede schicken?',
                    status: 'Wartet auf Follow-up',
                  },
                  {
                    name: 'Neuer Lead · Website-Formular',
                    channel: 'E-Mail',
                    preview: 'Ich will ein Probetraining am Abend, am liebsten Montag oder Mittwoch.',
                    status: 'Termin vorgeschlagen',
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="rounded-xl border border-stroke-2 dark:border-stroke-6 bg-background-3/70 dark:bg-background-7/80 px-4 py-3 hover:border-accent/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-tagline-1 font-semibold">{c.name}</p>
                      <span className="text-tagline-3 text-secondary/60 dark:text-accent/70">
                        {c.channel}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-tagline-2 text-secondary/70 dark:text-accent/75">
                      {c.preview}
                    </p>
                    <p className="mt-2 text-tagline-3 text-accent">
                      {c.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Termine */}
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-5 md:px-6 md:py-6 shadow-[0_0_40px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/65">
                    Heute im Studio
                  </p>
                  <h2 className="text-heading-5">Probetrainings & Termine</h2>
                </div>
                <button className="text-tagline-3 text-accent underline underline-offset-2">
                  Kalender öffnen
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    time: '09:30',
                    name: 'Probetraining – Jonas',
                    type: 'Lead · WhatsApp',
                  },
                  {
                    time: '14:00',
                    name: 'Vertragsgespräch – Anna',
                    type: 'Lead · Telefon',
                  },
                  {
                    time: '18:15',
                    name: 'Probetraining – Team-Workout',
                    type: 'Unternehmen · E-Mail',
                  },
                ].map((t) => (
                  <div
                    key={t.time + t.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-stroke-2 dark:border-stroke-6 bg-background-3/70 dark:bg-background-7/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-tagline-1 font-semibold">{t.name}</p>
                      <p className="text-tagline-3 text-secondary/65 dark:text-accent/70">
                        {t.type}
                      </p>
                    </div>
                    <span className="rounded-full bg-background-1 dark:bg-background-8 px-3 py-1 text-tagline-3 text-secondary/80 dark:text-accent/80">
                      {t.time} Uhr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealAnimation>

        {/* Setup-Status */}
        <RevealAnimation delay={0.26} direction="right">
          <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-5 md:px-6 md:py-6 shadow-[0_0_40px_rgba(15,23,42,0.4)]">
            <div className="mb-4">
              <p className="text-tagline-2 text-secondary/60 dark:text-accent/65">
                Onboarding-Status
              </p>
              <h2 className="text-heading-5">KI-Rezeption Setup</h2>
              <p className="mt-2 text-tagline-2 text-secondary/70 dark:text-accent/70">
                Schließe die letzten Schritte ab, damit WhatsApp, Telefon und E-Mail
                vollautomatisch laufen.
              </p>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-tagline-3 mb-1">
                <span className="text-secondary/70 dark:text-accent/75">
                  Gesamtfortschritt
                </span>
                <span className="text-accent">65 %</span>
              </div>
              <div className="h-2 rounded-full bg-background-3 dark:bg-background-7 overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7]" />
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {[
                {
                  label: 'WhatsApp Business verbinden',
                  status: 'Fertig',
                  percent: 100,
                },
                {
                  label: 'Telefonnummer & Weiterleitung',
                  status: 'In Arbeit',
                  percent: 60,
                },
                {
                  label: 'E-Mail-Postfach anbinden',
                  status: 'Offen',
                  percent: 20,
                },
                {
                  label: 'Antwort-Vorlagen & Angebote',
                  status: 'Offen',
                  percent: 0,
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className="rounded-xl border border-stroke-2 dark:border-stroke-6 bg-background-3/70 dark:bg-background-7/80 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-tagline-1 font-medium">{step.label}</p>
                    <span
                      className={`text-tagline-3 ${
                        step.percent === 100
                          ? 'text-emerald-500'
                          : step.percent > 0
                          ? 'text-accent'
                          : 'text-secondary/60 dark:text-accent/65'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-background-1/80 dark:bg-background-8/70 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#A855F7]"
                      style={{ width: `${step.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full">
              Setup fortsetzen
            </button>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default DashboardOverview;
