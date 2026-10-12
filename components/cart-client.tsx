'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { formatMoney } from '@/lib/utils';

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export function CartClient({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState(initialItems);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  );

  const updateQuantity = async (itemId: string, quantity: number) => {
    const nextQty = Math.max(1, Math.min(99, quantity));

    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity: nextQty }),
    });

    if (response.ok) {
      setItems((current) =>
        current.map((item) => (item.id === itemId ? { ...item, quantity: nextQty } : item)),
      );
    }
  };

  const handleRemove = async (itemId: string) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== itemId));
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-2xl font-semibold text-slate-900">Your cart is empty.</p>
        <p className="mt-3 text-slate-600">Browse the collection and add a few favorites to get started.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <img src={item.imageUrl ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'} alt={item.name} className="h-28 w-28 rounded-2xl object-cover" />
            <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{formatMoney(item.price)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full p-1 hover:bg-white">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full p-1 hover:bg-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button type="button" onClick={() => handleRemove(item.id)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-red-200 hover:text-red-600">
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{subtotal >= 12000 ? 'Free' : formatMoney(799)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatMoney(0)}</span></div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
          <div className="flex justify-between"><span>Total</span><span>{formatMoney(subtotal + (subtotal >= 12000 ? 0 : 799))}</span></div>
        </div>
        <Link href="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
          Proceed to checkout
        </Link>
        <Link href="/shop" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
