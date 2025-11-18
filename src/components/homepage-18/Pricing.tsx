'use client';

import { CheckIcon } from '@/icons';
import { cn } from '@/utils/cn';
import gradient30 from '@public/images/gradient/gradient-30.png';
import gradient39 from '@public/images/gradient/gradient-39.png';
import gradient42 from '@public/images/gradient/gradient-42.png';
import Image from 'next/image';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';

interface Feature {
  label: string;
  enabled: boolean;
}

interface PricingPlan {
  id: string;
  title: string;
  subtitle?: string;
  monthlyPrice?: string;
  setupFee?: string;
  buttonText: string;
  buttonClass: string;
  planType: 'basic' | 'featured' | 'premium';
  features: Feature[];
  href: string;
  isOnRequest?: boolean;
  highlight?: string;
}

const Pricing = () => {
  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      title: 'Basic',
      subtitle: 'KI-Inbox & Messaging',
      monthlyPrice: '149',
      setupFee: '500',
      buttonText: 'Basic wählen',
      buttonClass:
        'btn btn-md hover:btn-primary dark:btn-white-dark btn-white w-full block text-center before:content-none first-letter:uppercase',
      planType: 'basic',
      href: '/signup-01',
      features: [
        { label: 'KI-Inbox für WhatsApp, E-Mail & Website-Formulare', enabled: true },
        { label: 'Lead-Erfassung & automatisches Follow-up bis zum Probetraining', enabled: true },
        { label: 'Basis-Dashboard für Leads, Kontakte & Notizen', enabled: true },
        { label: 'Standard-Workflows für Anfragen & Rückmeldungen', enabled: true },
        { label: 'Standard-Support per E-Mail', enabled: true },
        { label: 'Ideal für Studios mit einem Standort', enabled: true },
      ],
    },
    {
      id: 'featured',
      title: 'Pro',
      subtitle: 'Telefon, Kalender & Automationen',
      monthlyPrice: '249',
      setupFee: '899',
      buttonText: 'Pro aktivieren',
      buttonClass:
        'btn btn-md btn-primary dark:hover:btn-white hover:btn-secondary w-full block text-center before:content-none first-letter:uppercase',
      planType: 'featured',
      href: '/signup-01',
      highlight: 'Meist gewählt',
      features: [
        { label: 'Alles aus Basic inklusive', enabled: true },
        { label: 'KI-Telefonanlage (eingehende & verpasste Anrufe)', enabled: true },
        { label: 'Synchroner Kalender für Probetrainings, Verträge & Kurse', enabled: true },
        { label: 'Erweiterte Workflows & Follow-up-Strecken (Voice, SMS, E-Mail)', enabled: true },
        { label: 'Priorisierte Leads, Tags & Status-Pipelines', enabled: true },
        { label: 'Onboarding-Support & gemeinsamer Live-Check-in', enabled: true },
      ],
    },
    {
      id: 'premium',
      title: 'Elite',
      subtitle: 'Coach, Growth & Multi-Location',
      buttonText: 'Elite anfragen',
      buttonClass:
        'btn btn-md hover:btn-primary dark:btn-white-dark btn-white w-full block text-center before:content-none first-letter:uppercase',
      planType: 'premium',
      href: '/contact-us?topic=elite',
      isOnRequest: true,
      features: [
        { label: 'Alles aus Pro inklusive', enabled: true },
        { label: 'KI-Coach für Trainingspläne & Mitglieder-Check-ins (zuerst WhatsApp, später App)', enabled: true },
        { label: 'Growth-Analytics & Kampagnen-Vorschläge der KI', enabled: true },
        { label: 'Mehrere Standorte & Marken in einem Account', enabled: true },
        { label: 'Optionale White-Label-, Multi-Studio- & Creator-Add-ons', enabled: true },
        { label: 'Persönlicher Ansprechpartner & individuelles Setup', enabled: true },
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px]"
    >
      {/* Hintergrund-Gradients für den gesamten Bereich */}
      <div className="pointer-events-none select-none absolute -top-32 -left-20 w-[260px] opacity-60 md:w-[320px]">
        <Image src={gradient30} alt="" className="w-full h-auto object-contain" />
      </div>
      <div className="pointer-events-none select-none absolute -bottom-40 -right-24 w-[320px] opacity-60 md:w-[380px]">
        <Image src={gradient39} alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="main-container flex flex-col gap-[70px] relative z-[1]">
        <div className="flex flex-col items-center text-center">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green mb-5">Preise & Pläne</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="mb-3">Wähle deinen PILAR Plan – Basic, Pro oder Elite.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="mb-5 md:mb-7 max-w-[720px]">
              Alle Pläne beinhalten eine einmalige Setup-Gebühr und eine monatliche Lizenz.{` `}
              <span className="font-medium">
                Basic ab 149&nbsp;€ / Monat, Pro ab 249&nbsp;€ / Monat
              </span>{' '}
              – Elite auf Anfrage. Du startest mit dem Plan, der zu deinem Studio passt, und kannst später Module wie
              Voice, KI-Coach, Creator oder White-Label ergänzen.
            </p>
          </RevealAnimation>
        </div>

        <div className="relative">
          <div className="grid grid-cols-12 items-center justify-items-center gap-y-10 lg:gap-x-8">
            {pricingPlans.map((plan, idx) => (
              <RevealAnimation key={plan.id} delay={0.2 + idx * 0.1}>
                <div
                  className={cn(
                    'flex flex-col h-full gap-6 rounded-[20px] max-w-[604px] w-full col-span-12 lg:col-span-4',
                    plan.planType === 'featured'
                      ? 'p-2.5 relative overflow-hidden'
                      : 'bg-white dark:bg-black p-8 xl:py-[60px] xl:px-14',
                  )}
                >
                  {/* Featured plan gradient background – neuer harmonischer Gradient */}
                  {plan.planType === 'featured' && (
                    <figure className="w-[810px] md:w-[950px] lg:w-[810px] left-[-30%] md:left-[-20%] lg:left-[-30%] top-[-20%] md:top-[-40%] lg:top-[-20%] absolute rotate-[30deg] select-none pointer-events-none opacity-80">
                      <Image src={gradient42} alt="gradient-bg" className="w-full h-full object-cover" />
                    </figure>
                  )}

                  <div
                    className={cn(
                      'space-y-8',
                      plan.planType === 'featured' &&
                        'bg-white relative z-10 dark:bg-black p-8 xl:py-[60px] xl:px-14 rounded-[20px] flex flex-col h-full gap-6',
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-normal text-heading-5">{plan.title}</h5>
                        {plan.highlight && (
                          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary dark:bg-accent/10 dark:text-accent">
                            {plan.highlight}
                          </span>
                        )}
                      </div>
                      {plan.subtitle && (
                        <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-4">{plan.subtitle}</p>
                      )}
                      <div className="border-b border-stroke-2 dark:border-stroke-6 pb-8">
                        <div className="price-month mb-4">
                          {plan.isOnRequest ? (
                            <h4 className="text-heading-6 sm:text-heading-4 font-normal">Preis auf Anfrage</h4>
                          ) : (
                            <h4 className="text-heading-6 sm:text-heading-4 font-normal">
                              €<span>{plan.monthlyPrice}</span>
                              <span className="text-tagline-2">/ Monat</span>
                            </h4>
                          )}
                        </div>
                        {!plan.isOnRequest && plan.setupFee && (
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-4">
                            zzgl. einmalig <span className="font-medium">€{plan.setupFee}</span> Setup-Gebühr
                          </p>
                        )}
                        {plan.isOnRequest && (
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-4">
                            Individuelles Angebot inklusive Setup – ideal für Ketten, Multi-Standorte &amp; White-Label.
                          </p>
                        )}
                        <Link href={plan.href} className={plan.buttonClass}>
                          {plan.buttonText}
                        </Link>
                      </div>
                    </div>

                    <ul className="relative list-none space-y-4">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              'flex size-5 items-center justify-center rounded-full shrink-0',
                              feature.enabled ? 'bg-secondary dark:bg-accent' : 'bg-secondary/40 dark:bg-accent/40',
                            )}
                          >
                            <CheckIcon className="fill-white dark:fill-black" />
                          </span>
                          <span
                            className={cn(
                              'font-normal text-tagline-1',
                              feature.enabled
                                ? 'text-secondary dark:text-accent'
                                : 'text-secondary dark:text-accent/60',
                            )}
                          >
                            {feature.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealAnimation>
            ))}
          </div>

          <RevealAnimation delay={0.8}>
            <div className="mt-10 text-center text-tagline-2 text-secondary/70 dark:text-accent/70 max-w-[720px] mx-auto">
              Add-ons wie <span className="font-medium">Voice Add-on</span>,{' '}
              <span className="font-medium">Coach Add-on</span>,{' '}
              <span className="font-medium">Creator Add-on</span>,{' '}
              <span className="font-medium">White-Label</span> und{' '}
              <span className="font-medium">Multi-Studio</span> kannst du nach der Registrierung in deinem PILAR
              Dashboard dazubuchen.
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
