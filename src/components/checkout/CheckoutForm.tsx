'use client';

import { useState, useMemo } from 'react';
import RevealAnimation from '@/components/animation/RevealAnimation';

type CheckoutFormProps = {
  checkoutAction: (formData: FormData) => void | Promise<void>;
};


type PlanId = 'starter' | 'growth' | 'pro';
type BillingPeriod = 'monthly' | 'yearly';

const planConfig: Record<
  PlanId,
  {
    label: string;
    subtitle: string;
    priceLabel: string;
    setupLabel: string;
    setupValue?: number;
    priceValue?: number;
  }
> = {
  starter: {
    label: 'Growth Gym',
    subtitle: 'Ideal für kleine Studios',
    priceLabel: '149 € / Monat',
    setupLabel: 'Setup-Gebühr: 500 € einmalig',
    priceValue: 149,
    setupValue: 500,
  },
  growth: {
    label: 'Growth Gym',
    subtitle: 'Für ambitionierte Studios',
    priceLabel: '199 € / Monat',
    setupLabel: 'Setup-Gebühr: 1.000 € einmalig',
    priceValue: 199,
    setupValue: 1000,
  },
  pro: {
    label: 'Elite / Multi-Location',
    subtitle: 'Für Ketten & High-Volume-Gyms',
    priceLabel: 'Preis auf Anfrage',
    setupLabel: 'Setup-Gebühr: auf Anfrage',
  },
};

const CheckoutForm = ({ checkoutAction }: CheckoutFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('growth');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const summary = useMemo(() => {
    const plan = planConfig[selectedPlan];

    if (!plan.priceValue || !plan.setupValue) {
      return {
        title: `${plan.label} – individuelle Konditionen`,
        lines: [
          'Preis und Setup-Gebühr werden individuell mit dir abgestimmt.',
          'Perfekt für Ketten, mehrere Standorte oder sehr hohes Volumen.',
        ],
        totalLabel: 'Auf Anfrage',
      };
    }

    const base = plan.priceValue;
    const setup = plan.setupValue;

    if (billingPeriod === 'yearly') {
      // 2 Monate geschenkt bei yearly
      const yearly = base * 10; // 12 Monate zahlen, 2 geschenkt = 10x
      const totalToday = yearly + setup;
      return {
        title: `${plan.label} (jährlich)`,
        lines: [
          `Monatlich: ${base.toString()} €`,
          'Jährlich: 10 statt 12 Monate – 2 Monate geschenkt.',
          `Setup-Gebühr: ${setup.toLocaleString('de-DE')} € einmalig`,
        ],
        totalLabel: `${totalToday.toLocaleString('de-DE')} €`,
      };
    }

    // monatlich
    const totalToday = base + setup;
    return {
      title: `${plan.label} (monatlich)`,
      lines: [
        `Monatlich: ${base.toString()} €`,
        `Setup-Gebühr: ${setup.toLocaleString('de-DE')} € einmalig`,
      ],
      totalLabel: `${totalToday.toLocaleString('de-DE')} €`,
    };
  }, [selectedPlan, billingPeriod]);

  const getPlanCardClasses = (plan: PlanId) => {
    const isSelected = selectedPlan === plan;
    return [
      'flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ease-out bg-background-2 dark:bg-background-7',
      isSelected
        ? 'border-accent/90 shadow-[0_0_30px_rgba(129,140,248,0.35)] scale-[1.02] hover:scale-[1.03]'
        : 'border-stroke-3/80 dark:border-stroke-6/80 opacity-70 md:scale-[0.97] hover:opacity-90 hover:scale-[0.99]',
    ].join(' ');
  };

  const getBillingCardClasses = (value: BillingPeriod) => {
    const isSelected = billingPeriod === value;
    return [
      'flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ease-out bg-background-2 dark:bg-background-7',
      isSelected
        ? 'border-accent/80 shadow-[0_0_24px_rgba(129,140,248,0.3)] scale-[1.01]'
        : 'border-stroke-3/80 dark:border-stroke-6/80 opacity-75 hover:opacity-100 hover:scale-[1.01]',
    ].join(' ');
  };

  return (
    <div className="space-y-12">
      {/* Headline */}
      <RevealAnimation delay={0.1}>
        <div className="mb-4 space-y-3 text-center">
          <span className="badge badge-cyan-v2">Schritt 2 von 3</span>
          <h1 className="text-heading-3 md:text-heading-2">
            Checkout & Abo abschließen
          </h1>
          <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl mx-auto">
            Wähle dein Paket, bestätige dein Abo und schließe die Zahlung über Stripe ab.
            Direkt danach startet dein Onboarding-Assistent und dein Dashboard wird eingerichtet.
          </p>
        </div>
      </RevealAnimation>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Formular */}
        <div className="lg:col-span-2">
          <RevealAnimation delay={0.2} direction="up">
            <form
              action={checkoutAction}
              className="space-y-8 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-6 px-5 py-6 md:px-8 md:py-8 shadow-1/40"
            >
              {/* Tarifwahl */}
              <div className="space-y-4">
                <h2 className="text-heading-6">Tarif auswählen</h2>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Du kannst deinen Tarif jederzeit upgraden. Für die meisten Studios passt
                  der <span className="font-semibold">Wachstum</span>-Plan perfekt.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Starter */}
                  <label className={getPlanCardClasses('starter')}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-tagline-1 font-semibold">
                          {planConfig.starter.label}
                        </p>
                        <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                          {planConfig.starter.subtitle}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="plan"
                        value="starter"
                        checked={selectedPlan === 'starter'}
                        onChange={() => setSelectedPlan('starter')}
                        className="h-4 w-4 accent-accent"
                        required
                      />
                    </div>
                    <p className="text-heading-6">{planConfig.starter.priceLabel}</p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      {planConfig.starter.setupLabel}
                    </p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      KI-Rezeption, Basis-Automatisierungen, Standard-Support.
                    </p>
                  </label>

                  {/* Wachstum (Empfohlen) */}
                  <label className={getPlanCardClasses('growth')}>
                    <div className="relative">
                      <span className="absolute -top-4 left-0 rounded-full bg-accent/90 px-3 py-[2px] text-[11px] font-medium text-black">
                        Empfohlen
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="space-y-1">
                        <p className="text-tagline-1 font-semibold">
                          {planConfig.growth.label}
                        </p>
                        <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                          {planConfig.growth.subtitle}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="plan"
                        value="growth"
                        checked={selectedPlan === 'growth'}
                        onChange={() => setSelectedPlan('growth')}
                        className="h-4 w-4 accent-accent"
                      />
                    </div>
                    <p className="text-heading-6">{planConfig.growth.priceLabel}</p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      {planConfig.growth.setupLabel}
                    </p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      Mehr Kanäle, Lead-Funnel, erweiterte Automatisierungen & Prioritäts-Support.
                    </p>
                  </label>

                  {/* Pro */}
                  <label className={getPlanCardClasses('pro')}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-tagline-1 font-semibold">
                          {planConfig.pro.label}
                        </p>
                        <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                          {planConfig.pro.subtitle}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="plan"
                        value="pro"
                        checked={selectedPlan === 'pro'}
                        onChange={() => setSelectedPlan('pro')}
                        className="h-4 w-4 accent-accent"
                      />
                    </div>
                    <p className="text-heading-6">{planConfig.pro.priceLabel}</p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      {planConfig.pro.setupLabel}
                    </p>
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                      Individuelle Volumenpreise, mehrere Standorte, individuelle SLAs.
                    </p>
                  </label>
                </div>
              </div>

              {/* Abrechnungszeitraum */}
              <div className="space-y-4">
                <h2 className="text-heading-6">Abrechnungszeitraum</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className={getBillingCardClasses('monthly')}>
                    <div>
                      <p className="text-tagline-1 font-semibold">Monatlich</p>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        Maximale Flexibilität, monatlich kündbar.
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="billingPeriod"
                      value="monthly"
                      checked={billingPeriod === 'monthly'}
                      onChange={() => setBillingPeriod('monthly')}
                      className="h-4 w-4 accent-accent"
                      required
                    />
                  </label>

                  <label className={getBillingCardClasses('yearly')}>
                    <div>
                      <p className="text-tagline-1 font-semibold">Jährlich</p>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        2 Monate geschenkt, beste Konditionen.
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="billingPeriod"
                      value="yearly"
                      checked={billingPeriod === 'yearly'}
                      onChange={() => setBillingPeriod('yearly')}
                      className="h-4 w-4 accent-accent"
                    />
                  </label>
                </div>
              </div>

              {/* Steuer & Rabatt */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="vatId"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    USt-IdNr. (optional)
                  </label>
                  <input
                    id="vatId"
                    name="vatId"
                    type="text"
                    placeholder="DE123456789"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
                  />
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    Wird auf den Rechnungen mit ausgewiesen.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="coupon"
                    className="text-tagline-1 font-medium text-secondary dark:text-accent"
                  >
                    Rabattcode (optional)
                  </label>
                  <input
                    id="coupon"
                    name="coupon"
                    type="text"
                    placeholder="Code eingeben"
                    className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60 uppercase"
                  />
                </div>
              </div>

              {/* Bedingungen */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    id="billingTerms"
                    name="billingTerms"
                    type="checkbox"
                    required
                    className="mt-[3px] h-4 w-4 rounded border-stroke-3 dark:border-stroke-6 bg-background-1 text-accent focus:ring-accent/60"
                  />
                  <label
                    htmlFor="billingTerms"
                    className="text-tagline-2 text-secondary/80 dark:text-accent/80"
                  >
                    Ich bestätige, dass das Abo nach der Testphase automatisch
                    weiterläuft, solange es nicht fristgerecht gekündigt wird.
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="stripeTerms"
                    name="stripeTerms"
                    type="checkbox"
                    required
                    className="mt-[3px] h-4 w-4 rounded border-stroke-3 dark:border-stroke-6 bg-background-1 text-accent focus:ring-accent/60"
                  />
                  <label
                    htmlFor="stripeTerms"
                    className="text-tagline-2 text-secondary/80 dark:text-accent/80"
                  >
                    Ich akzeptiere die Zahlungsabwicklung über Stripe und
                    die damit verbundenen{' '}
                    <span className="underline underline-offset-2">
                      Stripe-Nutzungsbedingungen
                    </span>
                    .
                  </label>
                </div>
              </div>

              {/* Button */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full md:w-auto"
                >
                  Zahlung mit Stripe abschließen
                </button>
                <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                  Im nächsten Schritt wirst du zu Stripe weitergeleitet. Sobald die Zahlung
                  durch ist, legen wir automatisch dein Abo an und bringen dich ins Dashboard.
                </p>
              </div>
            </form>
          </RevealAnimation>
        </div>

        {/* Zusammenfassung rechts */}
        <div className="lg:col-span-1">
          <RevealAnimation delay={0.3} direction="up">
            <aside className="sticky top-24 rounded-2xl border border-accent/30 bg-background-1/80 px-5 py-6 shadow-1/40 backdrop-blur md:px-6 dark:bg-background-6/80">
              <h2 className="mb-2 text-heading-6">Zusammenfassung</h2>
              <p className="text-tagline-2 text-secondary/70 dark:text-accent/80 mb-4">
                {summary.title}
              </p>
              <div className="space-y-2 text-tagline-2 text-secondary/80 dark:text-accent/80">
                {summary.lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              <div className="h-px my-4 bg-stroke-3 dark:bg-stroke-6" />
              <div className="flex items-center justify-between">
                <span className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                  Gesamt heute (netto)
                </span>
                <span className="text-heading-6">{summary.totalLabel}</span>
              </div>
              <p className="mt-3 text-tagline-3 text-secondary/60 dark:text-accent/60">
                Preise netto zzgl. USt. Die genaue Summe hängt von deinem gewählten Tarif
                und Abrechnungszeitraum ab.
              </p>
              <div className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-tagline-3 text-secondary/80 dark:text-accent">
                <p className="font-semibold mb-1">Was passiert nach der Zahlung?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Automatische Aktivierung deines Pilar-Accounts</li>
                  <li>Direkter Zugang zum Onboarding-Assistenten</li>
                  <li>Einrichtung des Dashboards und der KI-Kanäle</li>
                </ul>
              </div>
            </aside>
          </RevealAnimation>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
