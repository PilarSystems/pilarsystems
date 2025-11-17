import { CheckIcon } from '@/icons';
import Image from 'next/image';
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
          <div className="relative z-10">
            <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 rounded-[20px] overflow-hidden">
              <Image
                src="/images/home-page-2/about-bg.png"
                alt="Dekorativer Hintergrund"
                width={1200}
                height={600}
                quality={90}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="py-14 px-6 md:px-11 grid max-sm:grid-cols-1 grid-cols-2 max-sm:gap-10 gap-5">
              <div className="max-w-[500px]">
                <h2 className="text-accent text-heading-5 mb-8">
                  Typische Anwendungsfälle, die Studios mit PILAR SYSTEMS lösen.
                </h2>
                <p className="text-tagline-1 text-accent/80 mb-6">
                  Von der ersten Anfrage bis zum unterschriebenen Vertrag: PILAR verbindet Kommunikation, Terminplanung
                  und Reporting in einer Infrastruktur – speziell für Fitnessstudios, Gyms &amp; Coaches gebaut.
                </p>
                <div>
                  <Link
                    href="/process-01"
                    className="btn btn-md dark:btn-dark dark:hover:btn-white hover:btn-primary border-0 btn-white"
                  >
                    <span>Ablauf &amp; Setup ansehen</span>
                  </Link>
                </div>
              </div>
              <div>
                <ul className="space-y-4">
                  {featureList.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-3">
                      <span className="size-5 rounded-full bg-accent/17 dark:bg-accent/10">
                        <CheckIcon className="dark:fill-accent" />
                      </span>
                      <span className="text-accent dark:text-accent/60">{feature.text}</span>
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
