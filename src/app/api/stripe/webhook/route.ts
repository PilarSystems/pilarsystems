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

// Stripe-Client – API-Version passend zu deinem Projekt
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-10-29.clover',
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
      webhookSecret as string   // ⬅️ hier der Cast
    );
  } catch (err: any) {
    console.error('Stripe Webhook Error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Falls Supabase Admin nicht korrekt konfiguriert ist
  if (!supabaseAdmin) {
    console.error('Supabase Admin Client ist null – Env-Variablen prüfen');
    return new Response('Supabase not configured', { status: 500 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === 'string' ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : null;
        const email =
          session.customer_details?.email ||
          (typeof session.customer_email === 'string'
            ? session.customer_email
            : null);

        // Wichtig für Paid-Check im Dashboard
        if (email) {
          // Subscription-Details laden (wegen price_id / plan)
          let priceId: string | null = null;
          let plan: string | null = null;

          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            const firstItem = subscription.items.data[0];
            if (firstItem?.price?.id) {
              priceId = firstItem.price.id;
            }
            if (firstItem?.price?.nickname) {
              plan = firstItem.price.nickname ?? null;
            }
          }

          const { error } = await supabaseAdmin
            .from('paid_customers')
            .upsert(
              {
                email,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                stripe_price_id: priceId,
                plan,
                status: 'active',
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'email',
              }
            );

          if (error) {
            console.error('Fehler beim Upsert paid_customers:', error);
          } else {
            console.log('✅ paid_customers upsert ok für', email);
          }
        } else {
          console.warn(
            'checkout.session.completed ohne E-Mail – paid_customers nicht aktualisiert'
          );
        }

        console.log(
          '✅ Checkout abgeschlossen – Session:',
          session.id,
          'Customer:',
          session.customer,
          'Subscription:',
          session.subscription
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Invoice bezahlt – ID:', invoice.id);
        // Optional: Rechnungsdaten in DB speichern
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

        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : null;

        if (customerId) {
          // Status in paid_customers nachziehen
          const status =
            subscription.status === 'active' ? 'active' : subscription.status;

          const { error } = await supabaseAdmin
            .from('paid_customers')
            .update({
              status,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            console.error(
              'Fehler beim Update paid_customers (subscription change):',
              error
            );
          }
        }

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
