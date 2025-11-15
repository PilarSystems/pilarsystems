// src/app/checkout/success/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Checkout erfolgreich – Pilar Systems',
};

type CheckoutSuccessPageProps = {
  searchParams?: {
    session_id?: string;
    plan?: string;
  };
};

const CheckoutSuccessPage = ({ searchParams }: CheckoutSuccessPageProps) => {
  const planLabel = searchParams?.plan
    ? decodeURIComponent(searchParams.plan)
    : 'dein Pilar-Abo';

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[900px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-xl text-center space-y-6 rounded-3xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-6 py-8 md:px-10 md:py-10 shadow-[0_0_40px_rgba(15,23,42,0.55)] backdrop-blur">
            <span className="badge badge-cyan-v2">Checkout erfolgreich</span>

            <h1 className="text-heading-3 md:text-heading-2">
              Danke – {planLabel} ist jetzt aktiv.
            </h1>

            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">
              Deine Zahlung über Stripe wurde bestätigt. Dein Pilar-Account wird
              jetzt vorbereitet – im nächsten Schritt loggst du dich mit deinen
              Zugangsdaten ein und startest das Setup deiner KI-Rezeption.
            </p>

            <div className="h-px w-full bg-stroke-3/70 dark:bg-stroke-6/80 my-4" />

            <div className="space-y-3">
              <h2 className="text-heading-6">
                Nächste Schritte in weniger als 2 Minuten:
              </h2>
              <ol className="text-tagline-2 text-secondary/80 dark:text-accent/80 space-y-1 text-left max-w-md mx-auto list-decimal list-inside">
                <li>Mit deiner E-Mail & Passwort einloggen</li>
                <li>Im Dashboard den Setup-Assistenten starten</li>
                <li>Stimme, Tonalität & Kanäle für deine KI festlegen</li>
              </ol>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-4 md:flex-row md:gap-4 md:justify-center">
              <Link
                href="/login-01"
                className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full md:w-auto"
              >
                Weiter zum Login
              </Link>
              <Link
                href="/"
                className="btn btn-ghost btn-md w-full md:w-auto text-secondary/80 dark:text-accent/80"
              >
                Zurück zur Startseite
              </Link>
            </div>

            {searchParams?.session_id && (
              <p className="mt-4 text-tagline-3 text-secondary/55 dark:text-accent/60">
                Session-ID: <span className="font-mono">{searchParams.session_id}</span>
              </p>
            )}
          </div>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default CheckoutSuccessPage;
