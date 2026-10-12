import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductCard } from '@/components/product-card';
import { getCategoryBySlug, getProducts } from '@/lib/data';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ category: slug, page: 1, pageSize: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] bg-slate-100 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Category</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{category.description ?? 'Explore our most-loved essentials in this category.'}</p>
      </div>

      {products.items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.items.map((product: (typeof products.items)[number]) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Nothing here yet.</h2>
          <p className="mt-2 text-slate-600">Check back soon for more styles in this category.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
