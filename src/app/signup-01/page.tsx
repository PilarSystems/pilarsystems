// src/app/signup-01/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Registrieren – Pilar Systems',
};

type SignupPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
  };
};

// Server Action: Signup
async function signupAction(formData: FormData) {
  'use server';

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const studioName = String(formData.get('studioName') || '').trim();

  if (!email || !password) {
    redirect('/signup-01?error=missing_fields');
  }

  // ⬇️ HIER: Supabase-Client AWAITEN
  const supabase = await createSupabaseServerClient();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        studio_name: studioName,
      },
    },
  });

  if (error) {
    console.error('Signup error:', error);

    if (error.message.toLowerCase().includes('already registered')) {
      redirect('/signup-01?error=already_registered');
    }

    redirect('/signup-01?error=unknown');
  }

  if (!data.user) {
    redirect('/signup-01?error=unknown');
  }

  // Erfolgreich: Hinweis zum Bestätigen der E-Mail anzeigen
  redirect('/signup-01?message=check_email');
}

const getErrorMessage = (code?: string) => {
  switch (code) {
    case 'missing_fields':
      return 'Bitte fülle mindestens E-Mail und Passwort aus.';
    case 'already_registered':
      return 'Für diese E-Mail existiert bereits ein Account. Nutze bitte den Login.';
    case 'unknown':
      return 'Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuche es erneut.';
    default:
      return null;
  }
};

const getInfoMessage = (code?: string) => {
  switch (code) {
    case 'check_email':
      return 'Wir haben dir eine Bestätigungs-E-Mail geschickt. Bitte klicke auf den Link in der Mail, um deinen Account zu aktivieren. Danach kannst du dich einloggen und mit dem Setup & der Zahlung fortfahren.';
    default:
      return null;
  }
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  const errorMessage = getErrorMessage(searchParams?.error);
  const infoMessage = getInfoMessage(searchParams?.message);

  const showGoToCheckout = searchParams?.message === 'check_email';

  return (
    <>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[720px] mx-auto px-5 md:px-6 lg:px-0 py-16 md:py-20">
          <div className="mb-8 text-center space-y-2">
            <span className="badge badge-cyan-v2">Schritt 1 von 3</span>
            <h1 className="text-heading-3 md:text-heading-2">
              Dein Pilar Account für dein Studio
            </h1>
            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 max-w-2xl mx-auto">
              Erstelle deinen Account mit der E-Mail-Adresse, die du auch für
              Rechnungen und Login nutzen möchtest. Danach geht es weiter zum Checkout
              und in deinen Onboarding-Assistenten.
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
            action={signupAction}
            className="space-y-6 rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-6 px-5 py-6 md:px-7 md:py-7 shadow-1/40"
          >
            <div className="space-y-2">
              <label
                htmlFor="studioName"
                className="text-tagline-1 font-medium text-secondary dark:text-accent"
              >
                Name deines Studios (optional)
              </label>
              <input
                id="studioName"
                name="studioName"
                type="text"
                placeholder="z. B. EasyFitness Wolfenbüttel"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
              />
            </div>

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
                minLength={8}
                placeholder="Mindestens 8 Zeichen"
                className="w-full rounded-xl border border-stroke-3 dark:border-stroke-6 bg-background-3 dark:bg-background-7 px-4 py-3 text-sm md:text-base text-secondary dark:text-accent placeholder:text-secondary/50 dark:placeholder:text-accent/40 focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/60"
              />
              <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">
                Empfehlung: Mindestens 8 Zeichen, mit Zahlen & Sonderzeichen.
              </p>
            </div>

            <div className="flex items-center justify-between text-tagline-3 text-secondary/70 dark:text-accent/70">
              <span>
                Bereits einen Account?{' '}
                <a
                  href="/login-01"
                  className="font-medium text-accent hover:underline underline-offset-2"
                >
                  Zum Login
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full"
            >
              Account erstellen
            </button>
          </form>

          {showGoToCheckout && (
            <div className="mt-6 space-y-3 rounded-2xl border border-accent/40 bg-accent/5 px-5 py-4 text-center">
              <p className="text-tagline-2 text-secondary/80 dark:text-accent">
                Deine Bestätigungs-Mail ist unterwegs. Sobald du sie bestätigt hast,
                kannst du mit der Zahlung und dem Setup weitermachen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/checkout"
                  className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md"
                >
                  Weiter zur Zahlung
                </a>
                <a
                  href="/login-01"
                  className="btn btn-white-dark dark:btn-white btn-md"
                >
                  Zum Login
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      <FooterThree />
    </>
  );
}
