'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import { formatMoney } from '@/lib/utils';

export function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    price: number;
    compareAtPrice?: number | null;
    imageUrl?: string | null;
    category?: { name?: string | null } | null;
  };
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Unable to add item');
      }

      window.location.href = '/cart';
    } catch {
      setIsAdding(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-slate-100">
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.imageUrl ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'}
            alt={product.name}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white">
            Save {formatMoney(product.compareAtPrice - product.price)}
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-500">
          <span>{product.category?.name ?? 'Featured'}</span>
          <span>In stock</span>
        </div>
        <Link href={`/products/${product.slug}`} className="block text-xl font-semibold text-slate-900 hover:text-violet-700">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-600">{product.shortDescription ?? product.description}</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-slate-900">{formatMoney(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <span className="text-sm text-slate-400 line-through">{formatMoney(product.compareAtPrice)}</span>
              ) : null}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
            disabled={isAdding}
          >
            <ShoppingBag className="h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
