import Stripe from 'stripe';

export const ASSESSMENT_PRICE = 2999; // €29.99 in cents

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
  });
}
