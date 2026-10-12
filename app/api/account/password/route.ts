import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { getCurrentUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { passwordChangeSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login?error=auth-required', request.url));
    }

    const formData = await request.formData();
    const payload = {
      currentPassword: String(formData.get('currentPassword') ?? ''),
      newPassword: String(formData.get('newPassword') ?? ''),
    };

    const parsed = passwordChangeSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.redirect(new URL('/account?error=password-invalid', request.url));
    }

    const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.redirect(new URL('/account?error=password-mismatch', request.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(parsed.data.newPassword, 10),
      },
    });

    return NextResponse.redirect(new URL('/account?password=updated', request.url));
  } catch {
    return NextResponse.redirect(new URL('/account?error=update-failed', request.url));
  }
}
