// src/app/signup-01/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import SignupHero from '@/components/authentication/SignupHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Konto erstellen – Pilar Systems',
};

type SignupPageProps = {
  searchParams?: {
    status?: string;
    email?: string;
  };
};

const SignupPage = async ({ searchParams }: SignupPageProps) => {
  const supabase = await createSupabaseServerClient();

  // Wenn User schon eingeloggt ist → direkt zum Checkout
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/checkout');
  }

  // Wenn Link aus Bestätigungs-Mail geklickt wurde → direkt zum Checkout
  if (searchParams?.status === 'confirmed') {
    redirect('/checkout');
  }

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          {/* Status / Email aus URL können wir optional ins UI geben */}
          <SignupHero
            initialStatus={searchParams?.status}
            initialEmail={searchParams?.email}
          />
        </section>
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default SignupPage;
