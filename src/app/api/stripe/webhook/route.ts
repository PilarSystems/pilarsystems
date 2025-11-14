// src/app/api/stripe/webhook/route.ts
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Stripe-Secret aus Env holen
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY ist nicht gesetzt');
}

// Stripe-Client – API-Version passend zu deinen installierten Typen
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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET ist nicht gesetzt');
    return new Response('Webhook secret not configured', { status: 500 });
  }

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

        const customerEmail =
          session.customer_details?.email ??
          (typeof session.customer_email === 'string'
            ? session.customer_email
            : null);

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : null;

        const customerId =
          typeof session.customer === 'string' ? session.customer : null;

        const plan =
          (session.metadata?.plan as string | undefined) ?? 'growth';
        const billingPeriod =
          (session.metadata?.billingPeriod as string | undefined) ??
          'monthly';
        const priceId =
          (session.metadata?.priceId as string | undefined) ?? '';

        console.log('✅ checkout.session.completed', {
          sessionId: session.id,
          customerEmail,
          subscriptionId,
          customerId,
          plan,
          billingPeriod,
          priceId,
        });

        if (!customerEmail || !subscriptionId || !customerId) {
          console.error(
            '❌ Fehlende Pflichtdaten aus Stripe Session (Email / Subscription / Customer)'
          );
          break;
        }

        // 1. Workspace in Supabase anlegen
        const { data: workspace, error: wsError } = await supabaseAdmin
          .from('workspaces')
          .insert({
            name: `Pilar Workspace · ${customerEmail}`,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan,
            billing_period: billingPeriod,
          })
          .select()
          .single();

        if (wsError || !workspace) {
          console.error('❌ Fehler beim Erstellen des Workspaces:', wsError);
          break;
        }

        // 2. Owner-User/Profil anlegen
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            email: customerEmail,
            workspace_id: workspace.id,
            role: 'owner',
          });

        if (profileError) {
          console.error('❌ Fehler beim Erstellen des Profiles:', profileError);
          break;
        }

        console.log('✅ Workspace + Owner-Profil erfolgreich erstellt');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Invoice bezahlt – ID:', invoice.id);
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
