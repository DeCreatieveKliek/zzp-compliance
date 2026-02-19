import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Geen signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Ongeldige signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const assessmentId = session.metadata?.assessmentId;

    if (assessmentId && session.payment_status === 'paid') {
      await prisma.payment.update({
        where: { stripeSessionId: session.id },
        data: { status: 'PAID' },
      });

      await prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'PAID' },
      });
    }
  }

  return NextResponse.json({ received: true });
}
