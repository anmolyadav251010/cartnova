import Link from 'next/link';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { getCategories, getProducts } from '@/lib/data';

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? '1');
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: params.q,
      category: params.category,
      minPrice,
      maxPrice,
      sort: (params.sort as 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'popularity') ?? 'featured',
      page,
      pageSize: 12,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Shop</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Curated essentials</h1>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>

      <form className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" method="get">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.5fr_0.5fr_0.8fr]">
          <input name="q" defaultValue={params.q ?? ''} placeholder="Search products" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          <select name="category" defaultValue={params.category ?? ''} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500">
            <option value="">All categories</option>
            {categories.map((category: (typeof categories)[number]) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
          <input name="minPrice" defaultValue={params.minPrice ?? ''} type="number" placeholder="Min $" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          <input name="maxPrice" defaultValue={params.maxPrice ?? ''} type="number" placeholder="Max $" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          <select name="sort" defaultValue={params.sort ?? 'featured'} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
            <SlidersHorizontal className="h-4 w-4" /> Apply filters
          </button>
          <a href="/shop" className="inline-flex rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear filters</a>
        </div>
      </form>

      {products.items.length > 0 ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">Showing {products.items.length} of {products.total} products</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.items.map((product: (typeof products.items)[number]) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.pageCount > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              {page > 1 ? (
                <a href={`/shop?page=${page - 1}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}${params.minPrice ? `&minPrice=${params.minPrice}` : ''}${params.maxPrice ? `&maxPrice=${params.maxPrice}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  <ArrowLeft className="h-4 w-4" /> Prev
                </a>
              ) : null}
              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">Page {page}</span>
              {page < products.pageCount ? (
                <a href={`/shop?page=${page + 1}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}${params.minPrice ? `&minPrice=${params.minPrice}` : ''}${params.maxPrice ? `&maxPrice=${params.maxPrice}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  Next <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">No products match your filters.</h2>
          <p className="mt-2 text-slate-600">Try widening the price range or switching categories.</p>
        </div>
      )}
    </div>
  );
}
