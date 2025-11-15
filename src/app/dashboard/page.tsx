// src/app/dashboard/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import OnboardingWizard from '@/components/dashboard/OnboardingWizard';
import DashboardGuard from '@/components/dashboard/DashboardGuard';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Dashboard – Pilar Systems',
};

const DashboardPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-background-1/90 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-10 md:py-14 lg:py-16 space-y-8">
          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-heading-3 md:text-heading-2">
              Willkommen im Pilar Dashboard
            </h1>
            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-2xl">
              In wenigen Schritten stellst du deine KI-Rezeption so ein, als würde
              deine beste Mitarbeiterin jeden Anruf, jede WhatsApp und jede E-Mail
              übernehmen – nur eben automatisch.
            </p>
          </div>

          {/* Access Guard + Onboarding Wizard */}
          <DashboardGuard>
            <OnboardingWizard />
          </DashboardGuard>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default DashboardPage;
