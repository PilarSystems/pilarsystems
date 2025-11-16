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

type LoginPageProps = {
  searchParams?: {
    error?: string;
    status?: string;
    redirectTo?: string;
  };
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const supabase = await createSupabaseServerClient();
  const redirectTo = searchParams?.redirectTo;

  // Wenn schon eingeloggt → direkt weiterleiten
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    if (redirectTo && redirectTo.startsWith('/')) {
      redirect(redirectTo);
    }
    redirect('/dashboard');
  }

  // Server Action: Supabase-Login
  async function loginAction(formData: FormData) {
    'use server';

    const email = (formData.get('email') ?? '').toString().trim();
    const password = (formData.get('password') ?? '').toString();
    const redirectToFromForm =
      ((formData.get('redirectTo') as string | null) || undefined)?.toString();

    if (!email || !password) {
      const qp = redirectToFromForm
        ? `?error=missing_fields&redirectTo=${encodeURIComponent(redirectToFromForm)}`
        : '?error=missing_fields';
      redirect('/login-01' + qp);
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      const qp = redirectToFromForm
        ? `?error=invalid_credentials&redirectTo=${encodeURIComponent(
            redirectToFromForm,
          )}`
        : '?error=invalid_credentials';
      redirect('/login-01' + qp);
    }

    // Erfolg → dorthin, woher er kam (z. B. /checkout), sonst Dashboard
    if (redirectToFromForm && redirectToFromForm.startsWith('/')) {
      redirect(redirectToFromForm);
    }

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
          <LoginHero
            loginAction={loginAction}
            error={searchParams?.error}
            status={searchParams?.status}
            redirectTo={redirectTo}
          />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default LoginPage;
