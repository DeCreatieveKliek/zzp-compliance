import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const { id } = await params;

  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.user.id },
    include: { payment: true, invoice: true },
  });

  if (!assessment) {
    return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });
  }

  return NextResponse.json({ assessment });
}
