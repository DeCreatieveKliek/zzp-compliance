import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { computeScore } from '@/lib/scoring';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const assessments = await prisma.assessment.findMany({
    where: { userId: session.user.id },
    include: { payment: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ assessments });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const { title, answers } = await req.json();

  const scoreResult = computeScore(answers);

  const assessment = await prisma.assessment.create({
    data: {
      userId: session.user.id,
      title: title || 'Nieuwe beoordeling',
      answers: JSON.stringify(answers),
      score: scoreResult.totalScore,
      riskLevel: scoreResult.status,
      status: 'DRAFT',
    },
  });

  return NextResponse.json({ assessment, scoreResult }, { status: 201 });
}
