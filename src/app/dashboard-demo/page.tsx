import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
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
        className="border border-stroke-2 bg-background-1/80 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-2 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-12 md:py-16 lg:py-20 space-y-10">
          {/* Intro */}
          <div className="space-y-4">
            <span className="badge badge-cyan-v2">Demo-Modus</span>
            <h1 className="text-heading-3 md:text-heading-2">
              Pilar Systems im Demo-Modus erleben
            </h1>
            <p className="text-tagline-1 text-secondary/75 dark:text-accent/75 max-w-2xl">
              Du bist eingeloggt, aber dein Abo ist noch nicht aktiv. Hier siehst du,
              wie sich dein zukünftiges Dashboard anfühlt – ohne echte Kundendaten.
            </p>
          </div>

          {/* Demo Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-8 p-5 md:p-6 space-y-3">
              <p className="text-tagline-2 font-semibold text-secondary dark:text-accent">
                Eingehende Anfragen
              </p>
              <p className="text-heading-4">32</p>
              <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                Simulierter Überblick über WhatsApp-, Telefon- & E-Mail-Anfragen.
              </p>
            </div>

            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-8 p-5 md:p-6 space-y-3">
              <p className="text-tagline-2 font-semibold text-secondary dark:text-accent">
                Qualifizierte Leads
              </p>
              <p className="text-heading-4">14</p>
              <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                Leads, die deine KI-Rezeption bereits vorqualifiziert hätte.
              </p>
            </div>

            <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-8 p-5 md:p-6 space-y-3">
              <p className="text-tagline-2 font-semibold text-secondary dark:text-accent">
                Vereinbarte Probetrainings
              </p>
              <p className="text-heading-4">8</p>
              <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                Termine, die automatisch in deinen Kalender eingetragen würden.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="text-tagline-2 font-semibold text-secondary dark:text-accent">
                Nächster Schritt: Abo aktivieren
              </p>
              <p className="text-tagline-1 text-secondary/75 dark:text-accent/75">
                Sobald du dein Abo abgeschlossen hast, schaltet sich dein echtes Dashboard frei:
                echte Leads, echte Konversationen, echte Termine – alles 24/7.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <a
                href="/checkout"
                className="btn btn-primary hover:btn-secondary dark:hover:btn-accent w-full md:w-auto"
              >
                Abo jetzt starten
              </a>
              <a
                href="/"
                className="btn btn-white-dark dark:btn-white w-full md:w-auto"
              >
                Zurück zur Website
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default DemoDashboardPage;
