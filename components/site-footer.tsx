import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">CartNova</div>
          <p className="mt-4 text-sm text-slate-600">
            Thoughtful essentials for life, work, and home, curated for modern routines.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link href="/shop" className="hover:text-slate-900">All products</Link></li>
            <li><Link href="/categories/electronics" className="hover:text-slate-900">Electronics</Link></li>
            <li><Link href="/categories/home" className="hover:text-slate-900">Home essentials</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Company</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
            <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-900">Privacy policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Support</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link href="/terms" className="hover:text-slate-900">Terms</Link></li>
            <li><Link href="/cart" className="hover:text-slate-900">Cart</Link></li>
            <li><Link href="/account" className="hover:text-slate-900">Account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>© 2026 CartNova. All rights reserved.</p>
          <p>Demo storefront for portfolio use.</p>
        </div>
      </div>
    </footer>
  );
}
