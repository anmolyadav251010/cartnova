'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export function AddToCartButton({ productId, quantity = 1 }: { productId: string; quantity?: number }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (response.ok) {
      window.location.href = '/cart';
      return;
    }

    setIsAdding(false);
  };

  return (
    <button type="button" onClick={handleAdd} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60" disabled={isAdding}>
      <ShoppingBag className="h-4 w-4" />
      {isAdding ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
