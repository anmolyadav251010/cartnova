import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login?error=checkout-auth-required', request.url));
    }

    const formData = await request.formData();
    const data = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      line1: String(formData.get('line1') ?? '').trim(),
      line2: String(formData.get('line2') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      state: String(formData.get('state') ?? '').trim(),
      postalCode: String(formData.get('postalCode') ?? '').trim(),
      country: String(formData.get('country') ?? '').trim(),
      shippingMethod: String(formData.get('shippingMethod') ?? 'standard'),
      paymentMethod: String(formData.get('paymentMethod') ?? 'demo-card'),
      couponCode: String(formData.get('couponCode') ?? '').trim(),
    };

    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.redirect(new URL('/checkout?error=invalid-order', request.url));
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.redirect(new URL('/cart?error=empty-cart', request.url));
    }

    const subtotal = cart.items.reduce((sum: number, item: (typeof cart.items)[number]) => sum + item.product.price * item.quantity, 0);
    const shippingFee = parsed.data.shippingMethod === 'express' ? 1299 : subtotal >= 12000 ? 0 : 799;
    let discount = 0;

    if (parsed.data.couponCode === 'SAVE10') {
      discount = Math.round(subtotal * 0.1);
    }

    const total = subtotal + shippingFee - discount;

    await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        if (!item.product.active || item.product.stock < item.quantity) {
          throw new Error('Insufficient stock for one or more products');
        }
      }

      const order = await tx.order.create({
        data: {
          orderNumber: `CN-${Date.now()}`,
          userId: user.id,
          email: parsed.data.email,
          status: 'PENDING',
          subtotal,
          shippingFee,
          discount,
          total,
          shippingAddressJson: {
            fullName: parsed.data.fullName,
            email: parsed.data.email,
            phone: parsed.data.phone,
            line1: parsed.data.line1,
            line2: parsed.data.line2 ?? '',
            city: parsed.data.city,
            state: parsed.data.state ?? '',
            postalCode: parsed.data.postalCode,
            country: parsed.data.country,
          },
          paymentMethod: 'Demo Secure Card',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productPrice: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });

    return NextResponse.redirect(new URL('/account?checkout=success', request.url));
  } catch {
    return NextResponse.redirect(new URL('/checkout?error=order-failed', request.url));
  }
}
