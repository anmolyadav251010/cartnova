import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getCartRecord() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    return prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });
  }

  let guestToken = cookieStore.get('cartnova_guest')?.value;
  if (!guestToken) {
    guestToken = crypto.randomUUID();
    cookieStore.set('cartnova_guest', guestToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return prisma.cart.findFirst({
    where: { sessionToken: guestToken },
    include: {
      items: { include: { product: { include: { category: true } } } },
    },
  });
}

type CartItemWithProduct = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    active: boolean;
    stock: number;
    category?: { id: string; name: string; slug: string } | null;
  };
};

async function ensureCart(): Promise<{ id: string; items: CartItemWithProduct[] } | null> {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    return { id: cart.id, items: (cart.items as CartItemWithProduct[]) ?? [] };
  }

  let guestToken = cookieStore.get('cartnova_guest')?.value;
  if (!guestToken) {
    guestToken = crypto.randomUUID();
    cookieStore.set('cartnova_guest', guestToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const guestCart = await prisma.cart.findFirst({
    where: { sessionToken: guestToken },
    include: { items: { include: { product: true } } },
  });

  if (guestCart) {
    return { id: guestCart.id, items: (guestCart.items as CartItemWithProduct[]) ?? [] };
  }

  const createdCart = await prisma.cart.create({
    data: { sessionToken: guestToken },
    include: { items: { include: { product: true } } },
  });

  return { id: createdCart.id, items: (createdCart.items as CartItemWithProduct[]) ?? [] };
}

export async function GET() {
  const cart = await getCartRecord();
  const items = cart?.items ?? [];

  return NextResponse.json({
    itemCount: items.reduce((sum: number, item: CartItemWithProduct) => sum + item.quantity, 0),
    subtotal: items.reduce((sum: number, item: CartItemWithProduct) => sum + item.quantity * item.product.price, 0),
    items: items.map((item: CartItemWithProduct) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const payload = await request.json();
  const productId = String(payload.productId ?? '');
  const quantity = Number(payload.quantity ?? 1);

  if (!productId) {
    return NextResponse.json({ error: 'Product is required' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    return NextResponse.json({ error: 'Product is unavailable for purchase.' }, { status: 404 });
  }

  const cart = await ensureCart();
  if (!cart) {
    return NextResponse.json({ error: 'Cart is unavailable' }, { status: 500 });
  }

  const items = cart.items ?? [];
  const existingItem = items.find((item: CartItemWithProduct) => item.productId === productId);
  const nextQuantity = Math.max(1, Math.min(99, (existingItem?.quantity ?? 0) + quantity));

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: nextQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: Math.max(1, Math.min(99, quantity)),
      },
    });
  }

  if (!user) {
    let guestToken = cookieStore.get('cartnova_guest')?.value;
    if (!guestToken) {
      guestToken = crypto.randomUUID();
      cookieStore.set('cartnova_guest', guestToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sessionToken: guestToken,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  const itemId = String(payload.itemId ?? '');
  const quantity = Number(payload.quantity ?? 1);

  if (!itemId) {
    return NextResponse.json({ error: 'Item is required' }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.max(1, Math.min(99, quantity)) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const itemId = String(payload.itemId ?? '');

  if (!itemId) {
    return NextResponse.json({ error: 'Item is required' }, { status: 400 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
