import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount, currency = 'usd' } = await request.json();

  if (!amount || amount < 50) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
