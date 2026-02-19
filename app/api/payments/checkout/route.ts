import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getMollie, ASSESSMENT_PRICE, ASSESSMENT_PRICE_DISPLAY } from '@/lib/mollie';
import { Locale } from '@mollie/api-client';

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

  let molliePayment;
  try {
    molliePayment = await getMollie().payments.create({
      amount: {
        currency: 'EUR',
        value: ASSESSMENT_PRICE_DISPLAY,
      },
      description: `ZZP Compliance Beoordeling — ${assessment.title}`,
      redirectUrl: `${appUrl}/payment/success?assessment_id=${assessmentId}`,
      webhookUrl: `${appUrl}/api/payments/webhook`,
      metadata: {
        assessmentId,
        userId: session.user.id,
      },
      locale: Locale.nl_NL,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Mollie fout';
    console.error('Mollie create payment error:', msg);
    return NextResponse.json({ error: `Betaling aanmaken mislukt: ${msg}` }, { status: 500 });
  }

  await prisma.payment.upsert({
    where: { assessmentId },
    create: {
      userId: session.user.id,
      assessmentId,
      molliePaymentId: molliePayment.id,
      status: 'PENDING',
      amount: ASSESSMENT_PRICE,
    },
    update: {
      molliePaymentId: molliePayment.id,
      status: 'PENDING',
    },
  });

  const checkoutUrl = molliePayment.getCheckoutUrl();
  return NextResponse.json({ url: checkoutUrl });
}
