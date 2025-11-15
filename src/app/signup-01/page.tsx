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

const SignupPage = async () => {
  const supabase = await createSupabaseServerClient();

  // Wenn User schon eingeloggt ist → direkt ins Dashboard
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  // Server Action: Supabase-Signup + weiter zum Checkout
  async function signupAction(formData: FormData) {
    'use server';

    const email = (formData.get('email') ?? '').toString().trim();
    const password = (formData.get('password') ?? '').toString();
    const passwordConfirm = (formData.get('passwordConfirm') ?? '').toString();

    const firstName = (formData.get('firstName') ?? '').toString().trim();
    const lastName = (formData.get('lastName') ?? '').toString().trim();
    const studioName = (formData.get('studioName') ?? '').toString().trim();
    const phone = (formData.get('phone') ?? '').toString().trim();
    const studioWebsite = (formData.get('studioWebsite') ?? '').toString().trim();
    const members = (formData.get('members') ?? '').toString();

    if (!email || !password) {
      // primitive Absicherung – später mit echter Fehlerausgabe
      redirect('/signup-01?error=missing_fields');
    }

    if (password !== passwordConfirm) {
      redirect('/signup-01?error=password_mismatch');
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          studioName,
          phone,
          studioWebsite,
          members,
          // später: plan, source, etc.
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login-01`,
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      redirect('/signup-01?error=signup_failed');
    }

    // Erstmal: direkt zum Checkout
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
          {/* SignupHero bekommt unsere Server Action */}
          <SignupHero signupAction={signupAction} />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default SignupPage;
