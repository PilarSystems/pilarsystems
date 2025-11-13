'use client';
import { CheckIcon } from '@/icons';
import { cn } from '@/utils/cn';
import gradient51 from '@public/images/gradient/gradient-51.png';
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
  monthlyPrice?: string;
  setupFee?: string;
  buttonText: string;
  buttonClass: string;
  planType: 'basic' | 'featured' | 'premium';
  features: Feature[];
  href: string;
  isOnRequest?: boolean;
}

const Pricing = () => {
  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      title: 'Starter Gym',
      monthlyPrice: '129',
      setupFee: '499',
      buttonText: 'Plan wählen',
      buttonClass:
        'btn btn-md hover:btn-primary dark:btn-white-dark btn-white w-full block text-center before:content-none first-letter:uppercase',
      planType: 'basic',
      href: '/pricing-03',
      features: [
        { label: 'KI-Rezeption für Telefon & WhatsApp', enabled: true },
        { label: 'Lead-Erfassung & Probetraining-Buchung', enabled: true },
        { label: 'Basis-Dashboard für Leads & Termine', enabled: true },
        { label: 'E-Mail-Benachrichtigungen ans Team', enabled: true },
        { label: 'Standard-Support per E-Mail', enabled: true },
        { label: 'Ideal für Studios mit 1 Standort', enabled: true },
      ],
    },
    {
      id: 'featured',
      title: 'Growth Gym (Empfohlen)',
      monthlyPrice: '199',
      setupFee: '999',
      buttonText: 'Jetzt starten',
      buttonClass:
        'btn btn-md btn-primary dark:hover:btn-white hover:btn-secondary w-full block text-center before:content-none first-letter:uppercase',
      planType: 'featured',
      href: '/pricing-03',
      features: [
        { label: 'Alle Funktionen aus Starter Gym', enabled: true },
        { label: 'Erweiterte Follow-ups & Workflows', enabled: true },
        { label: 'Trainingsplan-Modul & Mitglieder-Notizen', enabled: true },
        { label: 'Priorisierte Leads & Tags', enabled: true },
        { label: 'Onboarding-Support & Live-Check-in', enabled: true },
        { label: 'Ideal für Studios mit 1–3 Standorten', enabled: true },
      ],
    },
    {
      id: 'premium',
      title: 'Elite / Multi-Location',
      buttonText: 'Kontakt aufnehmen',
      buttonClass:
        'btn btn-md hover:btn-primary dark:btn-white-dark btn-white w-full block text-center before:content-none first-letter:uppercase',
      planType: 'premium',
      href: '/contact-us',
      isOnRequest: true,
      features: [
        { label: 'Alle Funktionen aus Growth Gym', enabled: true },
        { label: 'Mehrere Standorte in einem Account', enabled: true },
        { label: 'Reporting auf Standort- & Kettenebene', enabled: true },
        { label: 'Individuelle Regeln pro Standort', enabled: true },
        { label: 'Persönlicher Ansprechpartner', enabled: true },
        { label: 'Individuelles Angebot inkl. Setup', enabled: true },
      ],
    },
  ];

  return (
    <section className="relative pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px]">
      <div className="main-container flex flex-col gap-[70px]">
        <div className="flex flex-col items-center text-center">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green mb-5">Preise</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="mb-3">Monatliche Pläne + einmalige Setup-Gebühr.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="mb-5 md:mb-7">
              Klar strukturierte Preise: eine einmalige Setup-Gebühr für die Einrichtung deiner KI-Rezeption
              <br className="hidden lg:block" />
              und eine faire monatliche Gebühr – ohne versteckte Kosten und ohne lange Agenturprojekte.
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
                  )}>
                  {/* Featured plan gradient background */}
                  {plan.planType === 'featured' && (
                    <figure className="w-[810px] md:w-[950px] lg:w-[810px] left-[-30%] md:left-[-20%] lg:left-[-30%] top-[-20%] md:top-[-40%] lg:top-[-20%] absolute rotate-[30deg] select-none pointer-events-none">
                      <Image src={gradient51} alt="gradient-bg" className="w-full h-full object-cover" />
                    </figure>
                  )}

                  <div
                    className={cn(
                      'space-y-8',
                      plan.planType === 'featured' &&
                        'bg-white relative z-10 dark:bg-black p-8 xl:py-[60px] xl:px-14 rounded-[20px] flex flex-col h-full gap-6',
                    )}>
                    <div>
                      <h5 className="mb-2 font-normal text-heading-5">{plan.title}</h5>
                      <div className="border-b border-stroke-2 dark:border-stroke-6 pb-8">
                        <div className="price-month mb-4">
                          {plan.isOnRequest ? (
                            <h4 className="text-heading-6 sm:text-heading-4 font-normal">
                              Preis auf Anfrage
                            </h4>
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
                            Individuelles Angebot inkl. Setup je nach Standortanzahl und Volumen.
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
                            )}>
                            <CheckIcon className="fill-white dark:fill-black" />
                          </span>
                          <span
                            className={cn(
                              'font-normal text-tagline-1',
                              feature.enabled
                                ? 'text-secondary dark:text-accent'
                                : 'text-secondary dark:text-accent/60',
                            )}>
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
        </div>
      </div>
    </section>
  );
};

export default Pricing;
