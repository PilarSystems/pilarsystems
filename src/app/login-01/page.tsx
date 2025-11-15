// src/app/login-01/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Login – Pilar Systems',
};

type LoginPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
  };
};

// Server Action: Login
async function loginAction(formData: FormData) {
  'use server';

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    redirect('/login-01?error=missing_fields');
  }

  // ⬇️ HIER: Supabase-Client AWAITEN
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    redirect('/login-01?error=invalid_credentials');
  }

  if (!user) {
    redirect('/login-01?error=no_user');
  }

  // Login erfolgreich → zum Dashboard
  redirect('/dashboard');
}

const getErrorMessage = (code?: string) => {
  switch (code) {
    case 'missing_fields':
      return 'Bitte E-Mail und Passwort ausfüllen.';
    case 'invalid_credentials':
      return 'E-Mail oder Passwort sind nicht korrekt.';
    case 'no_user':
      return 'Für diese E-Mail existiert kein Account.';
    default:
      return null;
  }
};

const getInfoMessage = (code?: string) => {
  switch (code) {
    case 'check_email':
      return 'Bitte bestätige deine E-Mail-Adresse. Wir haben dir gerade eine Bestätigungs-Mail geschickt.';
    case 'password_reset':
      return 'Dein Passwort wurde zurückgesetzt. Du kannst dich jetzt mit dem neuen Passwort einloggen.';
    default:
      return null;
  }
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(searchParams?.error);
  const infoMessage = getInfoMessage(searchParams?.message);

  return (
    <>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[480px] mx-auto px-5 md:px-6 lg:px-0 py-16 md:py-20">
          <div className="mb-8 text-center space-y-2">
            <span className="badge badge-cyan-v2">Willkommen zurück</span>
            <h1 className="text-heading-3 md:text-heading-2">
              In dein Pilar Dashboard einloggen
            </h1>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
              Nutze die E-Mail-Adresse, mit der du dich registriert hast.
            </p>
          </div>

          {infoMessage && (
            <div className="mb-4 rounded-xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {infoMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <form
            action={loginAction}
            className="space-y-6 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-6 px-5 py-6 md:px-7 md:py-7 shadow-1/40"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-tagline-1 font-medium text-secondary dark:text-accent"
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="studio@dein-gym.de"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-tagline-1 font-medium text-secondary dark:text-accent"
              >
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
              />
            </div>

            <div className="flex items-center justify-between text-tagline-3 text-secondary/70 dark:text-accent/70">
              <span>
                Noch kein Account?{' '}
                <a
                  href="/signup-01"
                  className="font-medium text-accent hover:underline underline-offset-2"
                >
                  Jetzt registrieren
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full"
            >
              Einloggen
            </button>
          </form>
        </section>
      </main>

      <FooterThree />
    </>
  );
}
