import Features from '@/components/features-02/Features';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import RevealAnimation from '@/components/animation/RevealAnimation';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Funktionen – Pilar Systems',
  description:
    'Alle Module von Pilar Systems im Überblick: KI-Inbox, Telefonanlage, WhatsApp, E-Mail, Terminbuchung, Trainingspläne, Growth-Analytics, KI-Coach und mehr.',
};

const Features02 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Funktionen"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          heading="Was PILAR SYSTEMS in deinem Studio übernimmt."
          link="/features-02"
        />

        {/* Haupt-Feature-Grid: alle Kernmodule von PILAR */}
        <Features />

        {/* Flow-Section: So arbeitet PILAR im Alltag deines Studios */}
        <section className="border-t border-stroke-2/60 dark:border-stroke-6/60 bg-background-1/70 dark:bg-background-8/40 py-20">
          <div className="main-container space-y-10">
            <div className="text-center space-y-3 max-w-[720px] mx-auto">
              <RevealAnimation delay={0.2}>
                <h2 className="text-heading-3">
                  So läuft der Alltag mit PILAR – vom ersten Kontakt bis zum Vertrag.
                </h2>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="text-secondary/80 dark:text-accent/80">
                  Anfragen kommen rein, die KI übernimmt Qualifizierung, Follow-ups und Terminbuchung – du siehst im
                  Dashboard, was passiert. Kein Telefonchaos, keine vergessenen Leads, keine Zettelwirtschaft.
                </p>
              </RevealAnimation>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Anfrage kommt rein',
                  text: 'Telefon, WhatsApp, E-Mail, Website-Formular oder Instagram-DM: Alles landet automatisch in der KI-Inbox.',
                },
                {
                  step: '02',
                  title: 'KI antwortet & qualifiziert',
                  text: 'Standardfragen werden direkt beantwortet, Interessenten werden nach Ziel, Level und Studio-Standort qualifiziert.',
                },
                {
                  step: '03',
                  title: 'Termin & Vertragsabschluss',
                  text: 'Die KI bucht Probetrainings, PT-Sessions oder Beratungscalls in deinen Kalender – inkl. Bestätigung & Reminder.',
                },
                {
                  step: '04',
                  title: 'Reporting & Growth',
                  text: 'Du siehst, welche Kanäle und Kampagnen funktionieren – und bekommst Vorschläge, wie du freie Kapazitäten füllst.',
                },
              ].map((item, index) => (
                <RevealAnimation key={item.step} delay={0.35 + index * 0.05}>
                  <article className="h-full rounded-3xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-3/80 dark:bg-background-9/70 px-5 py-6 flex flex-col justify-between">
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center rounded-full border border-stroke-2/70 dark:border-stroke-6/70 bg-background-1/80 dark:bg-background-8/80 px-3 py-1 text-[11px] font-medium tracking-[0.16em] text-secondary/70 dark:text-accent/70">
                        Schritt {item.step}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-heading-6">{item.title}</h3>
                      <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{item.text}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-secondary/60 dark:text-accent/60">
                      <span>PILAR FLOW</span>
                      <span>Studio-Alltag auf Autopilot</span>
                    </div>
                  </article>
                </RevealAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Plan-Matching-Section: Welche Stufe passt zu welchem Studio? */}
        <section className="py-20 bg-background-3/80 dark:bg-background-7/80">
          <div className="main-container space-y-10">
            <div className="text-center space-y-3 max-w-[720px] mx-auto">
              <RevealAnimation delay={0.2}>
                <h2 className="text-heading-3">Welche Stufe passt zu eurem Studio?</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="text-secondary/80 dark:text-accent/80">
                  PILAR SYSTEMS wächst mit deinem Studio. Vom ersten Standort mit wenigen Mitarbeitern bis zur
                  Multi-Location-Kette mit eigenem KI-Coach & White-Label-App.
                </p>
              </RevealAnimation>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <RevealAnimation delay={0.35}>
                <article className="h-full rounded-3xl border border-stroke-2/60 dark:border-stroke-6/70 bg-background-1/80 dark:bg-background-8/80 px-6 py-7 flex flex-col gap-4">
                  <div className="space-y-1">
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                      Einstieg
                    </p>
                    <h3 className="text-heading-5">Basic – weniger Chaos, mehr Überblick.</h3>
                  </div>
                  <p className="text-secondary/80 dark:text-accent/80">
                    Ideal für Studios, die aktuell über Handy, private WhatsApp-Nummern und ein überfülltes E-Mail-Postfach
                    laufen – und endlich Struktur in Anfragen & Leads bringen wollen.
                  </p>
                  <ul className="space-y-1.5 text-tagline-1 text-secondary/75 dark:text-accent/75 list-disc list-inside">
                    <li>KI-Inbox für Telefon, WhatsApp, E-Mail & Formulare</li>
                    <li>Automatisches Lead-Tracking & einfache Follow-ups</li>
                    <li>Kalender-Basislogik für Probetrainings & Termine</li>
                  </ul>
                  <div className="mt-auto pt-3 text-[12px] text-secondary/60 dark:text-accent/60 border-t border-stroke-2/60 dark:border-stroke-6/60">
                    <span>Plan: Basic · ab 149 € / Monat zzgl. Setup</span>
                  </div>
                </article>
              </RevealAnimation>

              <RevealAnimation delay={0.4}>
                <article className="h-full rounded-3xl border border-accent/70 bg-gradient-to-b from-background-1 via-background-3/90 to-background-1 dark:from-background-8 dark:via-background-7 dark:to-background-8 px-6 py-7 flex flex-col gap-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                        Empfohlen
                      </p>
                      <h3 className="text-heading-5">Pro – Telefon & Automationen inklusive.</h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-secondary/80 dark:text-accent">
                      Meistgewählt
                    </span>
                  </div>
                  <p className="text-secondary/80 dark:text-accent/80">
                    Für Studios, die Telefonstress abgeben, verpasste Anrufe auffangen und systematisch Probetrainings &
                    Verträge füllen wollen – ohne zusätzliche Vollzeitkraft am Empfang.
                  </p>
                  <ul className="space-y-1.5 text-tagline-1 text-secondary/75 dark:text-accent/75 list-disc list-inside">
                    <li>Alle Basic-Funktionen plus vollständige Telefon-KI</li>
                    <li>Rückruf-Logik, No-Show-Handling & smarte Sequenzen</li>
                    <li>Engere Verzahnung von Kalender, Inbox & Kampagnen</li>
                  </ul>
                  <div className="mt-auto pt-3 text-[12px] text-secondary/60 dark:text-accent/60 border-t border-stroke-2/60 dark:border-stroke-6/60">
                    <span>Plan: Pro · ab 249 € / Monat zzgl. Setup</span>
                  </div>
                </article>
              </RevealAnimation>

              <RevealAnimation delay={0.45}>
                <article className="h-full rounded-3xl border border-stroke-2/60 dark:border-stroke-6/70 bg-background-3/60 dark:bg-background-9/80 px-6 py-7 flex flex-col gap-4">
                  <div className="space-y-1">
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                      Skalierung
                    </p>
                    <h3 className="text-heading-5">Elite – KI-Coach, Growth & Multi-Location.</h3>
                  </div>
                  <p className="text-secondary/80 dark:text-accent/80">
                    Für Premium-Studios, Ketten und Marken, die ihre Marke skalieren wollen – mit eigenem KI-Coach,
                    Growth-Analytics, Multi-Location-Steuerung und perspektivisch eigener App.
                  </p>
                  <ul className="space-y-1.5 text-tagline-1 text-secondary/75 dark:text-accent/75 list-disc list-inside">
                    <li>KI-Coach mit Trainingsplänen & Check-ins</li>
                    <li>Growth-Analytics & Kampagnen-Vorschläge auf Studio-Level</li>
                    <li>Multi-Location, White-Label-Optionen & erweiterbare API</li>
                  </ul>
                  <div className="mt-auto pt-3 text-[12px] text-secondary/60 dark:text-accent/60 border-t border-stroke-2/60 dark:border-stroke-6/60">
                    <span>Plan: Elite · Preis auf Anfrage</span>
                  </div>
                </article>
              </RevealAnimation>
            </div>
          </div>
        </section>

        <CTAV1
          className="dark:bg-background-6 bg-white"
          badgeClass="hidden"
          ctaHeading="Bereit, Telefonstress & Zettelwirtschaft zu ersetzen?"
          spanText="PILAR SYSTEMS"
          description="Starte mit Basic oder Pro und lass KI Telefon, WhatsApp, E-Mail, Follow-ups, Trainingspläne und Growth-Analysen für dein Studio übernehmen – ohne lange Onboarding-Calls."
          btnClass="hover:btn-secondary dark:hover:btn-accent"
          ctaBtnText="Jetzt Pilar testen"
        />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default Features02;
