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

  // NEXT_PUBLIC_APP_URL must be set in Vercel → Project Settings → Environment Variables
  // VERCEL_PROJECT_PRODUCTION_URL is the stable fallback (auto-set by Vercel for production)
  // NEVER use VERCEL_URL: it is deployment-specific and becomes invalid after each new deploy,
  // which causes Mollie redirects to return a 404 DEPLOYMENT_NOT_FOUND error.
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000');

  if (appUrl === 'http://localhost:3000' && process.env.NODE_ENV === 'production') {
    console.error(
      '[checkout] NEXT_PUBLIC_APP_URL is not set — redirect URLs may be incorrect. ' +
        'Add it in Vercel → Project Settings → Environment Variables.'
    );
  }

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
