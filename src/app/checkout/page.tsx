// src/app/checkout/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Checkout – Pilar Systems',
};

// Server Action: Stripe-Checkout
async function handleCheckout(formData: FormData) {
  'use server';

  // 1. Supabase User ziehen – nur eingeloggte dürfen zahlen
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // nicht eingeloggt → zurück zum Login
    redirect('/login-01?redirect=checkout');
  }

  const plan = formData.get('plan') as string | null;
  const billingPeriod = (formData.get('billingPeriod') as string | null) ?? 'monthly';
  const vatId = (formData.get('vatId') as string | null) ?? '';
  const coupon = (formData.get('coupon') as string | null) ?? '';

  if (!plan) {
    redirect('/checkout?error=noplan');
  }

  // Pro / Enterprise → Kontaktformular statt Stripe
  if (plan === 'pro') {
    redirect('/contact-us?plan=enterprise');
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    console.error('STRIPE_SECRET_KEY fehlt in den Env-Variablen');
    redirect('/checkout?error=stripe_config');
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-06-20' as any,
  });

  let subscriptionPriceId: string | undefined;
  let setupPriceId: string | undefined;

  switch (plan) {
    case 'starter':
      subscriptionPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || undefined;
      setupPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_SETUP || undefined;
      break;
    case 'growth':
      subscriptionPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH || undefined;
      setupPriceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_SETUP || undefined;
      break;
    default:
      break;
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
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/canceled`,
    allow_promotion_codes: true,
    invoice_creation: { enabled: false }, // bei subscription nicht nötig
    metadata: {
      user_id: user.id,            // 🔥 wichtig für Webhook
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

const CheckoutPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24">
          <CheckoutForm checkoutAction={handleCheckout} />
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default CheckoutPage;
