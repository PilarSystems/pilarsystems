// src/app/checkout/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment, type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Stripe from 'stripe';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Checkout – Pilar Systems',
};

// Stripe einmal global initialisieren
const stripeSecret = process.env.STRIPE_SECRET_KEY ?? '';

const stripe =
  stripeSecret && typeof stripeSecret === 'string'
    ? new Stripe(stripeSecret, {
        apiVersion: '2025-10-29.clover',
      })
    : null;

// Server Action: Stripe-Checkout
async function handleCheckout(formData: FormData) {
  'use server';

  const plan = (formData.get('plan') as string | null) ?? '';
  const billingPeriod = (formData.get('billingPeriod') as string | null) ?? 'monthly';
  const vatId = (formData.get('vatId') as string | null) ?? '';
  const coupon = (formData.get('coupon') as string | null) ?? '';

  if (!plan) {
    redirect('/checkout?error=noplan');
  }

  // Pro / Enterprise → Kontakt aufnehmen statt Stripe
  if (plan === 'pro') {
    redirect('/contact-us?plan=enterprise');
  }

  if (!stripe) {
    console.error('Stripe ist nicht konfiguriert (STRIPE_SECRET_KEY fehlt)');
    redirect('/checkout?error=stripe_config');
  }

  const isYearly = billingPeriod === 'yearly';

  let subscriptionPriceId: string | undefined;
  let setupPriceId: string | undefined;

  switch (plan) {
    case 'starter':
      subscriptionPriceId = isYearly
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY || undefined
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || undefined;
      setupPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_SETUP || undefined;
      break;
    case 'growth':
      subscriptionPriceId = isYearly
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_YEARLY || undefined
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH || undefined;
      setupPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_SETUP || undefined;
      break;
    default:
      redirect('/checkout?error=invalid_plan');
  }

  if (!subscriptionPriceId) {
    console.error('Kein Stripe-Preis für Plan', plan, 'gefunden');
    redirect('/checkout?error=noprice');
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: subscriptionPriceId,
      quantity: 1,
    },
  ];

  if (setupPriceId) {
    lineItems.push({
      price: setupPriceId,
      quantity: 1,
    });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://www.pilarsystems.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/canceled`,
    allow_promotion_codes: true,
    metadata: {
      plan,
      billingPeriod,
      vatId,
      coupon,
    },
  });

  if (!session.url) {
    console.error('Keine Session-URL von Stripe bekommen');
    redirect('/checkout?error=nosession');
  }

  redirect(session.url);
}

type CheckoutPageProps = {
  searchParams?: {
    plan?: string;
    status?: string;
    error?: string;
  };
};

const CheckoutPage = ({ searchParams }: CheckoutPageProps) => {
  const status = searchParams?.status;
  const error = searchParams?.error;

  let banner: ReactNode = null;

  if (status === 'signup_success') {
    banner = (
      <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        <p className="font-semibold mb-1">E-Mail-Bestätigung versendet</p>
        <p>
          Wir haben dir eine Bestätigungs-E-Mail für dein Konto geschickt. Bitte
          bestätige deine Adresse, während du hier dein Abo abschließt.
        </p>
      </div>
    );
  } else if (error) {
    let message =
      'Beim Start deines Abos ist ein Fehler aufgetreten. Bitte versuche es erneut.';

    if (error === 'noplan') {
      message = 'Bitte wähle zuerst einen Plan aus.';
    } else if (error === 'noprice') {
      message =
        'Für den gewählten Plan ist aktuell kein Stripe-Preis hinterlegt. Bitte kontaktiere den Support.';
    } else if (error === 'stripe_config') {
      message = 'Stripe ist noch nicht korrekt konfiguriert.';
    } else if (error === 'nosession') {
      message = 'Die Zahlungsseite konnte nicht gestartet werden.';
    } else if (error === 'invalid_plan') {
      message = 'Ungültiger Plan ausgewählt.';
    }

    banner = (
      <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        {message}
      </div>
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
          {banner}
          <CheckoutForm checkoutAction={handleCheckout} />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default CheckoutPage;
