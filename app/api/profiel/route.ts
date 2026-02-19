import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      companyName: true,
      street: true,
      houseNumber: true,
      postalCode: true,
      city: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === 'profile') {
    const { name, companyName, street, houseNumber, postalCode, city } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Naam is verplicht' }, { status: 400 });
    }

    const userType = (session.user as { type?: string }).type;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        companyName: userType === 'BEDRIJF' ? (companyName?.trim() || null) : null,
        street: street?.trim() || null,
        houseNumber: houseNumber?.trim() || null,
        postalCode: postalCode?.trim() || null,
        city: city?.trim() || null,
      },
    });

    return NextResponse.json({ success: true });
  }

  if (action === 'password') {
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Vul alle wachtwoordvelden in' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Nieuw wachtwoord moet minimaal 8 tekens bevatten' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Wachtwoorden komen niet overeen' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 });
}
