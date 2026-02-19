import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: 'Token en wachtwoord zijn verplicht' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Wachtwoord moet minimaal 8 tekens bevatten' },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return NextResponse.json({ error: 'Ongeldige of verlopen resetlink' }, { status: 400 });
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ error: 'De resetlink is verlopen. Vraag een nieuwe aan.' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashed },
  });

  // Remove the used token
  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
