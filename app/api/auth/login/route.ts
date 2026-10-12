import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createSessionForUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = {
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    };

    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.redirect(new URL('/login?error=invalid-input', request.url));
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.redirect(new URL('/login?error=invalid-credentials', request.url));
    }

    const cookieStore = await cookies();
    const guestToken = cookieStore.get('cartnova_guest')?.value;

    if (guestToken) {
      const guestCart = await prisma.cart.findFirst({
        where: { sessionToken: guestToken },
        include: { items: true },
      });

      if (guestCart) {
        const userCart = await prisma.cart.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
          include: { items: true },
        });

        for (const item of guestCart.items) {
          const existing = userCart.items.find((cartItem: (typeof userCart.items)[number]) => cartItem.productId === item.productId);
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: existing.quantity + item.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: { cartId: userCart.id, productId: item.productId, quantity: item.quantity },
            });
          }
        }

        await prisma.cart.delete({ where: { id: guestCart.id } });
        cookieStore.set('cartnova_guest', '', { path: '/', maxAge: 0 });
      }
    }

    await createSessionForUser(user.id);
    return NextResponse.redirect(new URL('/account?loggedin=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/login?error=login-failed', request.url));
  }
}
