import { NextRequest, NextResponse } from 'next/server';
import { getMollie } from '@/lib/mollie';
import { prisma } from '@/lib/db';

// Mollie sends a POST with `id` in the body when payment status changes
export async function POST(req: NextRequest) {
  let molliePaymentId: string | null = null;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    molliePaymentId = params.get('id');
  } else {
    try {
      const body = await req.json();
      molliePaymentId = body.id ?? null;
    } catch {
      const text = await req.text();
      const params = new URLSearchParams(text);
      molliePaymentId = params.get('id');
    }
  }

  if (!molliePaymentId) {
    return NextResponse.json({ error: 'Geen payment ID' }, { status: 400 });
  }

  // Fetch the actual payment status from Mollie
  const molliePayment = await getMollie().payments.get(molliePaymentId);

  const assessmentId = (molliePayment.metadata as Record<string, string>)?.assessmentId;
  const userId = (molliePayment.metadata as Record<string, string>)?.userId;

  if (!assessmentId || !userId) {
    return NextResponse.json({ error: 'Ontbrekende metadata' }, { status: 400 });
  }

  if (molliePayment.status === 'paid') {
    // Update payment record
    await prisma.payment.update({
      where: { molliePaymentId },
      data: { status: 'PAID' },
    });

    // Update assessment status
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: 'PAID' },
    });

    // Create invoice if not already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { assessmentId },
    });

    if (!existingInvoice) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        // Generate invoice number: INV-YYYY-NNNN
        const year = new Date().getFullYear();
        const count = await prisma.invoice.count();
        const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;

        const amount = 2479; // ex BTW: €24.79
        const vatAmount = 520; // 21% BTW: €5.20
        const totalAmount = 2999; // incl. BTW: €29.99

        await prisma.invoice.create({
          data: {
            invoiceNumber,
            userId,
            assessmentId,
            amount,
            vatAmount,
            totalAmount,
            customerName: user.name,
            customerEmail: user.email,
            companyName: user.companyName ?? null,
          },
        });
      }
    }
  } else if (molliePayment.status === 'failed' || molliePayment.status === 'expired') {
    await prisma.payment.update({
      where: { molliePaymentId },
      data: { status: molliePayment.status.toUpperCase() },
    });
  }

  return NextResponse.json({ received: true });
}
