// src/app/api/stripe/webhook/route.ts
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Stripe-Keys aus Env
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY ist nicht gesetzt');
}
if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET ist nicht gesetzt');
}

// Stripe-Client – API-Version: 2024-06-20
// TypeScript meckert wegen Literal-Typ, deshalb casten wir explizit:
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-06-20' as Stripe.StripeConfig['apiVersion'],
});

export async function POST(req: NextRequest) {
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
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret as string // wir haben oben bereits geprüft, also safe
    );
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

        // === Supabase-Teil aktuell optional / soft ===
        if (!supabaseAdmin) {
          console.warn(
            'Supabase Admin nicht initialisiert – überspringe Workspace-Setup im Webhook.'
          );
          break;
        }

        // 🔜 HIER später:
        // - Workspace / Studio in Supabase anlegen oder updaten
        // - Subscription-Infos speichern
        //
        // Beispiel-Skizze:
        // const customerId = session.customer as string | null;
        // const subscriptionId = session.subscription as string | null;
        // await supabaseAdmin.from('workspaces').insert({...});

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Invoice bezahlt – ID:', invoice.id);
        // Später: Rechnungsdaten in DB speichern
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
        // Später: Subscription-Status in DB nachziehen
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
