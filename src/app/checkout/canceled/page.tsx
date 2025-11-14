// src/app/checkout/canceled/page.tsx

import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import RevealAnimation from '@/components/animation/RevealAnimation';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Zahlung abgebrochen – Pilar Systems',
};

const CheckoutCanceledPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="min-h-[70vh] bg-background-3 dark:bg-background-7 flex items-center">
        <section className="max-w-[700px] mx-auto px-6 py-20 text-center">
          <RevealAnimation delay={0.1}>
            <div className="space-y-4">
              <span className="badge badge-cyan-v2">Zahlung abgebrochen</span>

              <h1 className="text-heading-3 md:text-heading-2 font-semibold">
                Deine Zahlung wurde nicht abgeschlossen
              </h1>

              <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-xl mx-auto">
                Alles gut! Deine Bestellung ist noch nicht verloren.
                Du kannst den Checkout jederzeit erneut starten und dein Abo abschließen.
              </p>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.2} direction="up">
            <div className="mt-10 flex flex-col gap-4 items-center justify-center">
              <Link
                href="/checkout"
                className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md"
              >
                Zurück zum Checkout
              </Link>

              <Link
                href="/"
                className="text-tagline-2 underline underline-offset-2 text-secondary/70 dark:text-accent/70"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.35}>
            <div className="mt-12 rounded-xl bg-accent/10 px-5 py-4 text-tagline-3 text-secondary/80 dark:text-accent">
              <p className="font-semibold mb-1">Warum könnte das passiert sein?</p>
              <ul className="list-disc pl-5 space-y-1 text-left mx-auto inline-block">
                <li>Zahlungsmittel nicht verfügbar</li>
                <li>Bank hat die Transaktion geblockt</li>
                <li>Checkout-Fenster zu früh geschlossen</li>
              </ul>
            </div>
          </RevealAnimation>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default CheckoutCanceledPage;
