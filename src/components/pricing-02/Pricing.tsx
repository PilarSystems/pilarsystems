'use client';

import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';

type Plan = {
  id: 'basic' | 'pro' | 'elite';
  name: string;
  label: string;
  monthlyPrice?: string;
  setupFee?: string;
  isPopular?: boolean;
  isOnRequest?: boolean;
  features: string[];
  href: string;
};

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    label: 'KI-Inbox & Messaging',
    monthlyPrice: '149',
    setupFee: '500',
    href: '/signup-01?plan=basic',
    features: [
      'KI-Inbox für WhatsApp, E-Mail & Website-Formulare',
      'Automatisches Follow-up bis zum Probetraining',
      'Lead- & Kontaktverwaltung im Basis-Dashboard',
      'Antwort-Vorlagen für wiederkehrende Anfragen',
      'Standard-Support per E-Mail',
      'Ideal für Studios mit einem Standort',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    label: 'Telefon, Kalender & Automationen',
    monthlyPrice: '249',
    setupFee: '899',
    isPopular: true,
    href: '/signup-01?plan=pro',
    features: [
      'Alles aus Basic inklusive',
      'KI-Telefonanlage für eingehende & verpasste Anrufe',
      'Synchroner Kalender für Probetrainings & Verträge',
      'Erweiterte Workflows & Follow-up-Strecken',
      'Priorisierte Leads, Tags & Status-Pipelines',
      'Onboarding-Support & gemeinsamer Live-Check-in',
      'KI-Coach über WhatsApp als zubuchbares Modul',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    label: 'KI-Coach, Growth & Multi-Location',
    isOnRequest: true,
    href: '/signup-01?plan=elite',
    features: [
      'Alles aus Pro inklusive',
      'KI-Coach für Trainingspläne & Mitglieder-Check-ins (WhatsApp & spätere App)',
      'Growth-Analytics & Kampagnen-Vorschläge der KI',
      'Mehrere Standorte & Marken in einem Account',
      'Optionale White-Label- und Multi-Studio-Add-ons',
      'Individuelles Setup & persönlicher Ansprechpartner',
    ],
  },
];

const Pricing = () => {
  return (
    <section className="relative pb-20 md:pb-[100px] lg:pb-[150px] xl:pb-[200px] pt-[100px]">
      <div className="main-container flex flex-col gap-[70px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green mb-5">Preise & Tarife</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="max-w-[650px] mx-auto mb-4">
              Wähle den Pilar Systems Plan, der zu deinem Studio passt.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="max-w-[720px] mx-auto text-secondary/70 dark:text-accent/70">
              Alle Pläne bestehen aus einer einmaligen Setup-Gebühr für die Einrichtung deiner KI-Infrastruktur
              und einer monatlichen Lizenz. Du startest mit Basic oder Pro – Elite erhältst du als individuelles
              Angebot für Ketten, Multi-Standorte und Studios mit KI-Coach & Growth-Fokus.
            </p>
          </RevealAnimation>
        </div>

        {/* Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-8">
            {plans.map((plan, index) => (
              <RevealAnimation key={plan.id} delay={0.3 + index * 0.1} instant>
                <div
                  className={[
                    'flex flex-col justify-between rounded-[20px] p-8 max-lg:w-full',
                    plan.isPopular
                      ? 'bg-background-2 dark:bg-background-7 border border-primary-200 dark:border-primary-500 shadow-lg shadow-primary-200/40 dark:shadow-primary-900/30 relative'
                      : 'bg-background-3 dark:bg-background-5',
                  ].join(' ')}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-primary-500 text-white text-[11px] font-semibold tracking-[0.14em] px-3 py-1 uppercase">
                      Meist gewählt
                    </span>
                  )}

                  {/* Header */}
                  <div>
                    <h3 className="mb-1 font-normal text-heading-5">{plan.name}</h3>
                    <p className="mb-6 text-secondary/60 dark:text-accent/60 text-tagline-1">{plan.label}</p>

                    {/* Pricing */}
                    <div className="mb-6">
                      {plan.isOnRequest ? (
                        <div className="price-request">
                          <h4 className="text-heading-4 font-normal mb-1">Preis auf Anfrage</h4>
                          <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">
                            Individuelles Angebot inkl. Setup – ideal für Ketten & Multi-Standorte.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="price-month mb-2">
                            <h4 className="text-heading-4 font-normal">
                              €<span>{plan.monthlyPrice}</span>
                              <span className="text-tagline-2"> / Monat</span>
                            </h4>
                          </div>
                          {plan.setupFee && (
                            <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">
                              zzgl. einmalig <span className="font-medium">€{plan.setupFee}</span> Setup-Gebühr.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href={plan.href}
                      className={[
                        'btn btn-md w-full block mb-6 text-center before:content-none first-letter:uppercase',
                        plan.isPopular
                          ? 'btn-primary dark:btn-accent hover:btn-secondary dark:hover:btn-white'
                          : 'btn-white dark:btn-white-dark hover:btn-primary dark:hover:btn-accent',
                      ].join(' ')}
                    >
                      {plan.isOnRequest ? 'Beratung & Angebot anfragen' : `${plan.name} wählen`}
                    </Link>
                  </div>

                  {/* Feature-Liste */}
                  <ul className="relative list-none space-y-2.5 mt-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="shrink-0 mt-0.5"
                        >
                          <rect
                            width={20}
                            height={20}
                            rx={10}
                            className={plan.isPopular ? 'fill-primary-500' : 'fill-secondary dark:fill-accent'}
                          />
                          <path
                            d="M9.31661 13.7561L14.7491 8.42144C15.0836 8.0959 15.0836 7.5697 14.7491 7.24416C14.4145 6.91861 13.8736 6.91861 13.539 7.24416L8.7116 11.9901L6.46096 9.78807C6.12636 9.46253 5.58554 9.46253 5.25095 9.78807C4.91635 10.1136 4.91635 10.6398 5.25095 10.9654L8.1066 13.7561C8.27347 13.9184 8.49253 14 8.7116 14C8.93067 14 9.14974 13.9184 9.31661 13.7561Z"
                            className="fill-white dark:fill-black"
                          />
                        </svg>
                        <span className="text-secondary dark:text-accent font-normal text-tagline-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
