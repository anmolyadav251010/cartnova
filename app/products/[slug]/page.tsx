import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductCard } from '@/components/product-card';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import { formatMoney } from '@/lib/utils';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
            <img src={product.imageUrl ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'} alt={product.name} className="h-[520px] w-full rounded-[1.5rem] object-cover" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl]).map((item: string | null, index: number) => (
              <div key={`${item}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
                <img src={item ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'} alt={`${product.name} detail ${index + 1}`} className="h-32 w-full rounded-xl object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">{product.category?.name ?? 'Product'}</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatMoney(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price ? <span className="text-lg text-slate-400 line-through">{formatMoney(product.compareAtPrice)}</span> : null}
          </div>
          <p className="mt-5 text-slate-600">{product.description}</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Availability</span><span className={product.stock > 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span></div>
            <div className="mt-2 flex items-center justify-between"><span>SKU</span><span className="font-medium text-slate-800">{product.sku}</span></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <AddToCartButton productId={product.id} quantity={1} />
            <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Keep shopping
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><Truck className="h-5 w-5 text-violet-700" /><p className="mt-2 font-medium text-slate-900">Fast shipping</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><ShieldCheck className="h-5 w-5 text-violet-700" /><p className="mt-2 font-medium text-slate-900">Secure checkout</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><Sparkles className="h-5 w-5 text-violet-700" /><p className="mt-2 font-medium text-slate-900">Premium quality</p></div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black text-slate-900">Related products</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item: (typeof relatedProducts)[number]) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
