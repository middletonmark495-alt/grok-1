const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const Stripe = require('stripe');

const stripeSecret = defineSecret('STRIPE_SECRET_KEY');

exports.createPaymentIntent = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const stripe = new Stripe(stripeSecret.value());
    const { amount, currency = 'usd' } = request.data;

    if (!amount || amount < 50) {
      throw new HttpsError('invalid-argument', 'Invalid amount');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret };
  }
);
