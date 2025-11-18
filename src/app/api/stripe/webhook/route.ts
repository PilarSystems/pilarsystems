// src/app/api/stripe/webhook/route.ts
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature', { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log('🔔 checkout.session.completed:', {
          userId,
          subscriptionId,
          customerId,
        });

        if (!userId) {
          console.error('❌ Kein user_id in Stripe-Metadata!');
          break;
        }

        // Falls Supabase Admin nicht konfiguriert ist → nur loggen, kein Crash
        if (!supabaseAdmin) {
          console.error(
            '❌ Supabase Admin ist nicht konfiguriert – kein DB-Update möglich.'
          );
          break;
        }

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq('id', userId);

        if (error) {
          console.error('❌ Supabase Update Error:', error);
        } else {
          console.log('✅ Subscription aktiviert für User:', userId);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('💰 Invoice bezahlt:', invoice.id);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log(`ℹ️ Subscription ${event.type}:`, {
          id: subscription.id,
          status: subscription.status,
        });

        break;
      }

      default:
        console.log(`ℹ️ Unbehandelter Event-Typ: ${event.type}`);
    }
  } catch (err) {
    console.error('❌ Fehler im Handler:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
