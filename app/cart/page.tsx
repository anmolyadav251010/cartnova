import { cookies } from 'next/headers';

import { CartClient } from '@/components/cart-client';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type CartItemSummary = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl: string | null;
  };
};

async function getCartItems() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    return (cart?.items ?? []).map((item: CartItemSummary) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
    }));
  }

  const guestToken = cookieStore.get('cartnova_guest')?.value;
  if (!guestToken) {
    return [];
  }

  const cart = await prisma.cart.findFirst({
    where: { sessionToken: guestToken },
    include: { items: { include: { product: true } } },
  });

  return (cart?.items ?? []).map((item: CartItemSummary) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    name: item.product.name,
    price: item.product.price,
    imageUrl: item.product.imageUrl,
  }));
}

export default async function CartPage() {
  const items = await getCartItems();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Shopping cart</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Your selected items</h1>
      </div>
      <CartClient initialItems={items} />
    </div>
  );
}
