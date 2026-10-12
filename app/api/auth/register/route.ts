import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { createSessionForUser, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    };

    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.redirect(new URL('/register?error=invalid-input', request.url));
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.redirect(new URL('/register?error=email-taken', request.url));
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
      },
    });

    await createSessionForUser(user.id);
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect(new URL('/login?error=session-failed', request.url));
    }

    return NextResponse.redirect(new URL('/account?registered=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/register?error=registration-failed', request.url));
  }
}
