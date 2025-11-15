// src/app/checkout/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import PageHero from '@/components/shared/PageHero';
import CTAV1 from '@/components/shared/cta/CTAV1';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Paket wählen – Pilar Systems',
};

type CheckoutPageProps = {
  searchParams?: {
    email?: string;
    error?: string;
  };
};

// Stripe-Client (Server only)
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY ist nicht gesetzt');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-06-20',
});

// Server Action: Stripe Checkout Session erstellen und redirecten
async function createCheckoutSession(formData: FormData) {
  'use server';

  const email = (formData.get('email') as string | null)?.trim() || '';
  const priceId = (formData.get('priceId') as string | null)?.trim() || '';
  const planName = (formData.get('planName') as string | null)?.trim() || '';

  if (!email || !priceId) {
    redirect('/checkout?error=missing_data');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/canceled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        planName: planName || 'unknown',
      },
    });

    if (!session.url) {
      redirect('/checkout?error=session_failed');
    }

    redirect(session.url);
  } catch (err) {
    console.error('Stripe Checkout Session Error:', err);
    redirect('/checkout?error=stripe_error');
  }
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
  const email = searchParams?.email || '';
  const error = searchParams?.error;

  const basicPriceId = process.env.STRIPE_PRICE_BASIC_MONTHLY;
  const growthPriceId = process.env.STRIPE_PRICE_GROWTH_MONTHLY;

  const hasPrices = !!basicPriceId && !!growthPriceId;

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <PageHero
          title="Paket wählen"
          heading="Wähle dein Pilar Systems Paket"
          link="/pricing-02"
        />

        <section className="max-w-[1100px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 pb-16 md:pb-20 lg:pb-24">
          {/* Hinweis / Zustand */}
          {!email && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Wir konnten deine E-Mail nicht finden. Bitte starte den Prozess noch
              einmal über die Konto-Erstellung.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              Bei der Weiterleitung zu Stripe ist ein Fehler aufgetreten. Bitte versuche
              es erneut oder kontaktiere den Support.
            </div>
          )}

          {!hasPrices && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Die Stripe-Preis-IDs sind noch nicht vollständig konfiguriert. Bitte
              hinterlege STRIPE_PRICE_BASIC_MONTHLY und STRIPE_PRICE_GROWTH_MONTHLY in
              den Umgebungsvariablen.
            </div>
          )}

          {/* Pricing-Karten */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* BASIC */}
            <form action={createCheckoutSession} className="h-full">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="priceId" value={basicPriceId || ''} />
              <input type="hidden" name="planName" value="Basic" />

              <div className="flex h-full flex-col rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-6 py-6 shadow-[0_0_40px_rgba(15,23,42,0.4)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-tagline-1 font-semibold text-secondary dark:text-accent">
                      Basic
                    </p>
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      Ideal für Studios, die schlank starten wollen.
                    </p>
                  </div>
                  <span className="badge badge-cyan-v2">Monatlich</span>
                </div>

                <div className="mb-5 flex items-baseline gap-1">
                  <span className="text-heading-3 font-semibold">149€</span>
                  <span className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    / Monat
                  </span>
                </div>

                <ul className="mb-6 space-y-2 text-tagline-2 text-secondary/80 dark:text-accent/80">
                  <li>✔ KI-Rezeption für WhatsApp & E-Mail</li>
                  <li>✔ Basis-Dashboard für Leads & Termine</li>
                  <li>✔ 1 Standort inkludiert</li>
                  <li>✔ Setup einmalig 500€</li>
                </ul>

                <button
                  type="submit"
                  disabled={!email || !basicPriceId}
                  className="mt-auto btn btn-primary hover:btn-secondary dark:hover:btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Basic wählen & zu Stripe
                </button>
              </div>
            </form>

            {/* GROWTH */}
            <form action={createCheckoutSession} className="h-full">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="priceId" value={growthPriceId || ''} />
              <input type="hidden" name="planName" value="Growth" />

              <div className="flex h-full flex-col rounded-2xl border border-accent/70 bg-accent/[0.15] px-6 py-6 shadow-[0_0_50px_rgba(56,189,248,0.35)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-tagline-1 font-semibold text-accent">
                      Growth
                    </p>
                    <p className="text-tagline-2 text-accent/80">
                      Für Studios, die aktiv skalieren wollen.
                    </p>
                  </div>
                  <span className="badge badge-cyan-v2">Empfohlen</span>
                </div>

                <div className="mb-5 flex items-baseline gap-1">
                  <span className="text-heading-3 font-semibold">249€</span>
                  <span className="text-tagline-2 text-accent/75">
                    / Monat
                  </span>
                </div>

                <ul className="mb-6 space-y-2 text-tagline-2 text-accent/90">
                  <li>✔ Alles aus Basic</li>
                  <li>✔ Erweiterte Automationen & Kampagnen</li>
                  <li>✔ Priorisierter Support</li>
                  <li>✔ Optional mehrere Standorte</li>
                </ul>

                <button
                  type="submit"
                  disabled={!email || !growthPriceId}
                  className="mt-auto btn btn-secondary hover:btn-primary dark:hover:btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Growth wählen & zu Stripe
                </button>
              </div>
            </form>
          </div>
        </section>

        <CTAV1
          className="dark:bg-background-7 bg-accent/10"
          badgeText="Noch Fragen?"
          badgeClass="!badge-cyan"
          ctaHeading="Unsicher, welches Paket für dein Studio passt?"
          description="Schreib uns kurz, wie dein Studio aufgestellt ist, und wir empfehlen dir das passende Setup."
          ctaBtnText="Kostenloses Beratungsgespräch anfragen"
          btnClass="btn-primary hover:btn-secondary dark:hover:btn-accent"
        />
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default CheckoutPage;
