// src/app/login-01/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import LoginHero from '@/components/authentication/LoginHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Login – Pilar Systems',
};

const LoginPage = async () => {
  const supabase = createSupabaseServerClient();

  // Wenn schon eingeloggt → direkt ins Dashboard
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  // Server Action: Supabase-Login
  async function loginAction(formData: FormData) {
    'use server';

    const email = (formData.get('email') ?? '').toString().trim();
    const password = (formData.get('password') ?? '').toString();

    if (!email || !password) {
      redirect('/login-01?error=missing_fields');
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      redirect('/login-01?error=invalid_credentials');
    }

    // später: optional redirectTo-Param beachten
    redirect('/dashboard');
  }

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          {/* LoginHero bekommt unsere Server Action */}
          <LoginHero loginAction={loginAction} />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default LoginPage;
