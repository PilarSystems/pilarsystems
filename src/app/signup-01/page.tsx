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
    error?: string;
    email?: string;
  };
};

const SignupPage = async ({ searchParams }: SignupPageProps) => {
  const supabase = await createSupabaseServerClient();

  // Wenn schon eingeloggt → direkt zum Checkout
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && searchParams?.status !== 'confirmed') {
    redirect('/checkout');
  }

  // 🔁 Wenn aus der Mail bestätigt → direkt weiter zum Checkout
  if (searchParams?.status === 'confirmed') {
    redirect('/checkout');
  }

  // 🧠 Server Action: Signup + Bestätigungs-Mail
  async function handleSignup(formData: FormData) {
    'use server';

    const supabase = await createSupabaseServerClient();

    const firstName = (formData.get('firstName') as string | null)?.trim() || '';
    const lastName = (formData.get('lastName') as string | null)?.trim() || '';
    const email = (formData.get('email') as string | null)?.trim() || '';
    const studioName = (formData.get('studioName') as string | null)?.trim() || '';
    const studioWebsite = (formData.get('studioWebsite') as string | null)?.trim() || '';
    const members = (formData.get('members') as string | null) || '';
    const phone = (formData.get('phone') as string | null)?.trim() || '';
    const password = (formData.get('password') as string | null) || '';
    const passwordConfirm = (formData.get('passwordConfirm') as string | null) || '';

    // ❌ Pflichtfelder check
    if (!email || !password || !firstName || !lastName || !studioName || !phone) {
      redirect('/signup-01?error=missing_fields');
    }

    // ❌ Passwort-Mismatch → KEIN Account
    if (password !== passwordConfirm) {
      redirect('/signup-01?error=password_mismatch');
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 📨 Supabase SignUp + Bestätigungslink → zurück auf signup-01 mit status=confirmed
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/signup-01?status=confirmed`,
        data: {
          firstName,
          lastName,
          studioName,
          studioWebsite,
          members,
          phone,
        },
      },
    });

    if (error) {
      console.error('Supabase signUp error:', error.message);
      redirect('/signup-01?error=signup_failed');
    }

    // ✅ Account angelegt + Mail verschickt
    // → zurück zur Signup-Seite mit Status + Email im Query
    redirect(
      `/signup-01?status=signup_success&email=${encodeURIComponent(email)}`
    );
  }

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          <SignupHero
            signupAction={handleSignup}
            status={searchParams?.status}
            error={searchParams?.error}
            email={searchParams?.email}
          />
        </section>
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default SignupPage;
