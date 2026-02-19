import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { stripe, ASSESSMENT_PRICE } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const { assessmentId } = await req.json();

  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, userId: session.user.id },
  });

  if (!assessment) {
    return NextResponse.json({ error: 'Beoordeling niet gevonden' }, { status: 404 });
  }

  if (assessment.status === 'PAID') {
    return NextResponse.json({ error: 'Al betaald' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['ideal'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'ZZP Compliance Beoordeling',
            description: `Beoordeling: ${assessment.title}`,
          },
          unit_amount: ASSESSMENT_PRICE,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
    cancel_url: `${appUrl}/assessment/${assessmentId}`,
    metadata: {
      assessmentId,
      userId: session.user.id,
    },
    customer_email: session.user.email ?? undefined,
    locale: 'nl',
  });

  await prisma.payment.upsert({
    where: { assessmentId },
    create: {
      userId: session.user.id,
      assessmentId,
      stripeSessionId: checkoutSession.id,
      status: 'PENDING',
      amount: ASSESSMENT_PRICE,
    },
    update: {
      stripeSessionId: checkoutSession.id,
      status: 'PENDING',
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
