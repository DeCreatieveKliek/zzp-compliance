import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, type, companyName } = await req.json();

    if (!name || !email || !password || !type) {
      return NextResponse.json({ error: 'Vul alle verplichte velden in' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 8 tekens bevatten' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit e-mailadres' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        type,
        companyName: type === 'BEDRIJF' ? companyName : null,
      },
      select: { id: true, email: true, name: true, type: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 });
  }
}
