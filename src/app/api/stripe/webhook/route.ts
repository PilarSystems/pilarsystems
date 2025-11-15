// src/app/api/stripe/webhook/route.ts
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Stripe-Env-Variablen (können auf Vercel noch fehlen → deshalb KEIN throw hier)
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // Wenn Stripe auf Vercel noch nicht konfiguriert ist → sauber 500 zurückgeben
  if (!stripeSecret || !webhookSecret) {
    console.error(
      'Stripe Env-Variablen fehlen (STRIPE_SECRET_KEY oder STRIPE_WEBHOOK_SECRET).'
    );
    return new Response('Stripe config missing', { status: 500 });
  }

  // Stripe-Client – API-Version passend zu deinen Typen
  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2025-10-29.clover',
  });

  // Stripe-Signatur aus Header holen
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    console.error('Stripe-Signatur fehlt');
    return new Response('Missing stripe-signature', { status: 400 });
  }

  // Roh-Body lesen (wichtig für Webhook-Validierung)
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Stripe Webhook Error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log(
          '✅ Checkout abgeschlossen – Session:',
          session.id,
          'Customer:',
          session.customer,
          'Subscription:',
          session.subscription
        );

        // TODO: später
        // - Workspace / User in Supabase anlegen/aktualisieren
        // - Subscription-Status speichern
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Invoice bezahlt – ID:', invoice.id);
        // TODO: später Rechnungsdaten in DB speichern
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `ℹ️ Subscription ${event.type} – ID:`,
          subscription.id,
          'Status:',
          subscription.status
        );
        // TODO: Subscription-Status in DB nachziehen
        break;
      }

      default: {
        console.log(`🔹 Unbehandelter Stripe-Event-Typ: ${event.type}`);
      }
    }
  } catch (err) {
    console.error('Fehler beim Verarbeiten des Stripe-Webhooks:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
