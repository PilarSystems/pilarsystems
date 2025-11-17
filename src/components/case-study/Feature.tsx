import { CheckIcon } from '@/icons';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';

const featureList = [
  {
    id: 1,
    text: 'Alle Anfragen in einer KI-Inbox – statt 5 verschiedenen Tools',
  },
  {
    id: 2,
    text: 'Automatisierte Follow-ups für Probetrainings & Leads',
  },
  {
    id: 3,
    text: 'Telefon-KI für verpasste Anrufe & Rückrufe',
  },
  {
    id: 4,
    text: 'Kalender-Logik für Probetrainings, Verträge & PT-Sessions',
  },
  {
    id: 5,
    text: 'Growth-Analytics zu Leads, Auslastung & Kampagnen',
  },
];

const Feature = () => {
  return (
    <section className="pt-[80px] lg:pt-[100px] pb-24 md:pb-28 lg:pb-32 xl:pb-[200px]">
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="relative z-10 overflow-hidden rounded-[20px] border border-stroke-2/70 bg-gradient-to-br from-accent/14 via-background-1 to-background-3 px-6 py-14 shadow-sm dark:border-stroke-6/70 dark:from-accent/22 dark:via-background-8 dark:to-background-9 md:px-11">
            {/* Soft Glows */}
            <div className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-accent/24 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-10 h-56 w-56 rounded-full bg-secondary/18 dark:bg-background-5/60 blur-3xl" />

            <div className="relative grid max-sm:grid-cols-1 grid-cols-2 gap-5 max-sm:gap-10">
              <div className="max-w-[500px] space-y-6">
                <h2 className="mb-3 text-heading-5 text-accent dark:text-accent">
                  Typische Anwendungsfälle, die Studios mit PILAR SYSTEMS lösen.
                </h2>
                <p className="mb-6 text-tagline-1 text-secondary/85 dark:text-accent/85">
                  Von der ersten Anfrage bis zum unterschriebenen Vertrag: PILAR verbindet Kommunikation,
                  Terminplanung und Reporting in einer Infrastruktur – speziell für Fitnessstudios, Gyms &amp; Coaches
                  gebaut.
                </p>
                <div>
                  <Link
                    href="/process-01"
                    className="btn btn-md border-0 btn-white hover:btn-primary dark:btn-dark dark:hover:btn-white"
                  >
                    <span>Ablauf &amp; Setup ansehen</span>
                  </Link>
                </div>
              </div>

              <div>
                <ul className="space-y-4">
                  {featureList.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-3">
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent/17 dark:bg-accent/10">
                        <CheckIcon className="dark:fill-accent" />
                      </span>
                      <span className="text-secondary/90 dark:text-accent/70">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Feature;
