// src/app/onboarding/success/page.tsx

import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import RevealAnimation from '@/components/animation/RevealAnimation';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Erfolgreich gestartet – Pilar Systems',
};

const OnboardingSuccessPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="min-h-[70vh] bg-background-3 dark:bg-background-7 flex items-center">
        <section className="max-w-[720px] mx-auto px-6 py-20 text-center">
          {/* Headline */}
          <RevealAnimation delay={0.1}>
            <div className="space-y-4">
              <span className="badge badge-cyan-v2">Setup erfolgreich</span>

              <h1 className="text-heading-3 md:text-heading-2 font-semibold">
                Willkommen bei Pilar Systems 🚀
              </h1>

              <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-xl mx-auto">
                Deine Zahlung wurde erfolgreich abgeschlossen und dein Account
                wird jetzt vorbereitet. In wenigen Augenblicken kannst du deine
                KI-Rezeption, Leads und Termine im Dashboard steuern.
              </p>
            </div>
          </RevealAnimation>

          {/* CTAs */}
          <RevealAnimation delay={0.2} direction="up">
            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md"
              >
                Direkt ins Dashboard
              </Link>

              <Link
                href="/"
                className="text-tagline-2 underline underline-offset-2 text-secondary/70 dark:text-accent/70"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </RevealAnimation>

          {/* Info-Box */}
          <RevealAnimation delay={0.35}>
            <div className="mt-12 rounded-xl bg-accent/10 px-5 py-4 text-tagline-3 text-secondary/80 dark:text-accent text-left max-w-xl mx-auto">
              <p className="font-semibold mb-2">Was passiert jetzt genau?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Wir verknüpfen dein Abo mit deinem Pilar-Account.</li>
                <li>Dein Basis-Workspace und dein Dashboard werden angelegt.</li>
                <li>Du erhältst gleich eine Bestätigung per E-Mail.</li>
              </ul>

              <p className="mt-4">
                Wenn du Fragen hast oder etwas nicht passt,&nbsp;
                <Link
                  href="/contact-us"
                  className="underline underline-offset-2"
                >
                  melde dich jederzeit beim Support
                </Link>
                .
              </p>
            </div>
          </RevealAnimation>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default OnboardingSuccessPage;
