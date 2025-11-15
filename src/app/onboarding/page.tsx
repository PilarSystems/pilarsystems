// src/app/onboarding/page.tsx
import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Onboarding – Pilar Systems',
};

const OnboardingPage = async () => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Wenn kein User → zurück zum Login
  if (!user) {
    redirect('/login-01');
  }

  // Optional: später hier noch Subscription-Status checken
  // und ggf. auf /pricing-02 weiterleiten, wenn nicht aktiv.

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          <OnboardingWizard />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default OnboardingPage;
