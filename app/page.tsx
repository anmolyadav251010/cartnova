import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { getCategories, getFeaturedProducts, getNewArrivals } from '@/lib/data';

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-slate-100 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              New season edit
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Modern essentials for a sharper daily rhythm.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Discover elevated tech, home upgrades, and everyday pieces designed to simplify your routine.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700">
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700">
                Our story
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-violet-600" />Free shipping over $120</div>
              <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-600" />Secure checkout</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-200/80">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
              alt="CartNova product lifestyle"
              className="h-full min-h-[420px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute bottom-8 left-8 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Best seller</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">Aster Pro</p>
              <p className="text-sm text-slate-600">Smart speaker with premium audio</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Featured</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Popular picks</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product: (typeof featured)[number]) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Truck className="h-10 w-10 text-violet-400" />
            <h3 className="mt-4 text-xl font-semibold">Fast shipping</h3>
            <p className="mt-2 text-sm text-slate-300">Delivery across the U.S. in 2–5 business days with real-time tracking.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Sparkles className="h-10 w-10 text-violet-400" />
            <h3 className="mt-4 text-xl font-semibold">Curated quality</h3>
            <p className="mt-2 text-sm text-slate-300">Thoughtful essentials selected for performance, longevity, and everyday comfort.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="h-10 w-10 text-violet-400" />
            <h3 className="mt-4 text-xl font-semibold">Safe checkout</h3>
            <p className="mt-2 text-sm text-slate-300">Demo payment flow clearly labeled for portfolio use only—never real financial data.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Fresh arrivals</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Just dropped</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product: (typeof newArrivals)[number]) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Categories</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Shop by collection</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category: (typeof categories)[number]) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-violet-50 p-3 text-violet-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{category.description ?? 'High-quality picks for everyday routines.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-violet-50 p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Why CartNova</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Designed for calmer, better routines.</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                <li className="flex items-start gap-3"><BadgeCheck className="mt-1 h-5 w-5 text-violet-700" /> Thoughtful product curation informed by daily habits.</li>
                <li className="flex items-start gap-3"><BadgeCheck className="mt-1 h-5 w-5 text-violet-700" /> Premium finishes, dependable support, and transparent pricing.</li>
                <li className="flex items-start gap-3"><BadgeCheck className="mt-1 h-5 w-5 text-violet-700" /> Hardworking essentials that fit smoothly into modern life.</li>
              </ul>
            </div>
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
              alt="CartNova lifestyle product display"
              className="h-[360px] w-full rounded-[1.5rem] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Newsletter</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Get product drops and special offers.</h2>
            </div>
            <form action="/api/newsletter" method="post" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500"
              />
              <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700">
                Join now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
