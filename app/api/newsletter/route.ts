import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '').trim();
    const parsed = newsletterSchema.safeParse({ email });

    if (!parsed.success) {
      return NextResponse.redirect(new URL('/?error=invalid-email', request.url));
    }

    await prisma.newsletterSubscription.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.redirect(new URL('/?success=subscribed', request.url));
  } catch {
    return NextResponse.redirect(new URL('/?error=subscribe-failed', request.url));
  }
}
