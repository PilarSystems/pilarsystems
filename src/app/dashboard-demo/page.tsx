// src/app/dashboard-demo/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import CTAV1 from '@/components/shared/cta/CTAV1';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Demo-Dashboard – Pilar Systems',
};

const DemoDashboardPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24 space-y-12">
          {/* Headline */}
          <header className="text-center space-y-4">
            <span className="badge badge-cyan-v2">Demo-Ansicht</span>
            <h1 className="text-heading-3 md:text-heading-2">
              So sieht dein Pilar Dashboard in echt aus
            </h1>
            <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl mx-auto">
              Ein zentraler Ort für alle Leads, Termine und Konversationen deiner
              KI-Rezeption – in Echtzeit, klar strukturiert und bereit für Wachstum.
            </p>
          </header>

          {/* Preview-Grid */}
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] items-start">
            {/* Große Overview-Preview */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-heading-5">Übersicht & Performance</h2>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent border border-accent/30">
                  Live-Übersicht deines Studios
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 shadow-[0_0_45px_rgba(15,23,42,0.6)]">
                {/* Bild – später echte PNGs in /public ablegen */}
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-background-2 via-background-3 to-background-4 dark:from-background-7 dark:via-background-8 dark:to-background-9 flex items-center justify-center">
                  <img
                    src="/images/demo/dashboard-overview.png"
                    alt="Pilar Systems Dashboard – Übersicht"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="px-5 py-4 border-t border-stroke-2 dark:border-stroke-6 flex items-center justify-between gap-4">
                  <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                    Tagesübersicht von Leads, gebuchten Terminen und offenen
                    Konversationen, inklusive Conversion-Rate und Peak-Zeiten.
                  </p>
                  <span className="hidden md:inline-flex text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    Beispielansicht · Demo
                  </span>
                </div>
              </div>
            </div>

            {/* Zwei kleinere Previews rechts */}
            <div className="space-y-6">
              {/* Leads & Konversationen */}
              <div className="space-y-3">
                <h3 className="text-heading-6">Leads & Konversationen</h3>
                <div className="relative overflow-hidden rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90">
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-background-2 via-background-3 to-background-4 dark:from-background-7 dark:via-background-8 dark:to-background-9 flex items-center justify-center">
                    <img
                      src="/images/demo/dashboard-conversations.png"
                      alt="Pilar Systems Dashboard – Konversationen"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-stroke-2 dark:border-stroke-6">
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      Alle Chats aus WhatsApp, Telefon-Transkripten und E-Mail –
                      filterbar nach Status, Kanal und Mitarbeiter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Termine & Auslastung */}
              <div className="space-y-3">
                <h3 className="text-heading-6">Termine & Studio-Auslastung</h3>
                <div className="relative overflow-hidden rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90">
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-background-2 via-background-3 to-background-4 dark:from-background-7 dark:via-background-8 dark:to-background-9 flex items-center justify-center">
                    <img
                      src="/images/demo/dashboard-schedule.png"
                      alt="Pilar Systems Dashboard – Termine"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-stroke-2 dark:border-stroke-6">
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      Live-Kalender mit Probetrainings, Beratungsterminen und
                      Vertragsabschlüssen – perfekt für Teamplanung und Peak-Hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vergleich Demo vs. Vollzugang */}
          <section className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/80 dark:bg-background-8/80 px-6 py-5 space-y-3">
              <p className="text-tagline-1 uppercase tracking-[0.18em] text-secondary/60 dark:text-accent/60">
                Demo-Modus
              </p>
              <h3 className="text-heading-5">Was du hier siehst</h3>
              <ul className="space-y-2 text-tagline-2 text-secondary/75 dark:text-accent/75">
                <li>• Statische Beispiel-Ansichten deines zukünftigen Dashboards</li>
                <li>• Gefühl für Aufbau, Struktur und Look & Feel</li>
                <li>• Ideal zum Vorzeigen im Team oder bei Partnern</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-accent/40 bg-accent/5 px-6 py-5 space-y-3">
              <p className="text-tagline-1 uppercase tracking-[0.18em] text-accent/80">
                Voller Zugriff
              </p>
              <h3 className="text-heading-5">Was nach der Freischaltung dazukommt</h3>
              <ul className="space-y-2 text-tagline-2 text-secondary/90 dark:text-accent/90">
                <li>• Live-Leads, echte Konversationen & Termine</li>
                <li>• KI-Konfiguration, Voice-Auswahl & Trainingspläne</li>
                <li>• Performance-Kennzahlen, Funnels & Kampagnen-Auswertung</li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <CTAV1
            className="dark:bg-background-7 bg-accent mt-6"
            badgeText="Nächster Schritt"
            badgeClass="!badge-cyan"
            ctaHeading="Bereit, vom Demo-Modus auf echtes Wachstum zu schalten?"
            description="Erstelle dein Konto, bestätige deine Mail und wähle deinen Plan. Deine KI-Rezeption und dein Dashboard sind in wenigen Minuten einsatzbereit."
            ctaBtnText="Konto erstellen & Zugang freischalten"
            btnClass="btn-primary hover:btn-secondary dark:hover:btn-accent"
          />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default DemoDashboardPage;
