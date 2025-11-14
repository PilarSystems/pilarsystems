import { CheckIcon } from '@/icons';
import { cn } from '@/utils/cn';
import gradient4 from '@public/images/gradient/gradient-4.png';
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
      href: '/signup-01',
      features: [
        { label: 'KI-Rezeption für Telefon & WhatsApp', enabled: true },
        { label: 'Lead-Erfassung & Probetrainings-Buchung', enabled: true },
        { label: 'Basis-Dashboard für Leads & Termine', enabled: true },
        { label: 'E-Mail-Benachrichtigungen ans Team', enabled: true },
        { label: 'Standard-Support per E-Mail', enabled: true },
        { label: 'Ideal für Studios mit 1 Standort', enabled: true },
      ],
    },
    {
      id: 'featured',
      title: 'Growth Gym (empfohlen)',
      monthlyPrice: '199',
      setupFee: '999',
      buttonText: 'Jetzt starten',
      buttonClass:
        'btn btn-md btn-primary dark:hover:btn-white hover:btn-secondary w-full block text-center before:content-none first-letter:uppercase',
      planType: 'featured',
      href: '/signup-01',
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
      href: '/signup-01',
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
    <section className="relative pb-20 md:pb-[100px] lg:pb-[150px] xl:pb-[200px]">
      <div className="max-w-[1440px] w-full mx-auto rounded-2xl bg-background-1 dark:bg-black py-[100px] px-5 md:px-6 lg:px-10 xl:px-16 space-y-[60px]">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-cyan-v2">Preise</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2>Pläne für moderne Fitnessstudios.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="text-secondary/60 dark:text-accent/60">
              Monatliche Lizenz + einmalige Setup-Gebühr – klar kalkulierbar, ohne versteckte Kosten 
              und ohne lange Agenturprojekte.
            </p>
          </RevealAnimation>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <RevealAnimation key={plan.id} delay={0.4 + idx * 0.1}>
              <div
                className={cn(
                  'col-span-12 md:col-span-6 xl:col-span-4 flex h-full',
                )}
              >
                <div
                  className={cn(
                    'relative flex flex-col gap-6 rounded-[20px] max-w-[604px] w-full bg-white dark:bg-black p-8 xl:py-[60px] xl:px-10 overflow-hidden',
                    plan.planType === 'featured' && 'p-[2px] bg-transparent'
                  )}
                >
                  {/* Gradient für Featured-Plan */}
                  {plan.planType === 'featured' && (
                    <>
                      <Image
                        src={gradient4}
                        alt="gradient"
                        className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                        priority
                      />
                      <div className="relative z-10 flex flex-col gap-6 bg-white dark:bg-black rounded-[18px] p-8 xl:py-[60px] xl:px-10">
                        {renderPlanContent(plan)}
                      </div>
                    </>
                  )}

                  {plan.planType !== 'featured' && renderPlanContent(plan)}
                </div>
              </div>
            </RevealAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

// Hilfsfunktion für den Karteninhalt
const renderPlanContent = (plan: PricingPlan) => {
  return (
    <>
      <div>
        <h5 className="mb-2 font-normal text-heading-5">{plan.title}</h5>
        <div className="border-b border-stroke-2 dark:border-stroke-6 pb-6">
          <div className="price-month mb-3">
            {plan.isOnRequest ? (
              <h4 className="text-heading-6 sm:text-heading-4 font-normal">
                Preis auf Anfrage
              </h4>
            ) : (
              <h4 className="text-heading-6 sm:text-heading-4 font-normal">
                €<span>{plan.monthlyPrice}</span>
                <span className="text-tagline-2"> / Monat</span>
              </h4>
            )}
          </div>
          {!plan.isOnRequest && plan.setupFee && (
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-3">
              zzgl. einmalig <span className="font-medium">€{plan.setupFee}</span> Setup-Gebühr
            </p>
          )}
          {plan.isOnRequest && (
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-3">
              Individuelles Angebot inkl. Setup je nach Standortanzahl und Volumen.
            </p>
          )}
          <Link href={plan.href} className={plan.buttonClass}>
            {plan.buttonText}
          </Link>
        </div>
      </div>

      <ul className="list-none space-y-3">
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
                feature.enabled ? 'text-secondary dark:text-accent' : 'text-secondary/60 dark:text-accent/60',
              )}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pricing;
