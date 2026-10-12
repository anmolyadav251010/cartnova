import Link from 'next/link';
import { Search, ShoppingCart, UserCircle2 } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getCartCount() {
  try {
    return await prisma.cartItem.count();
  } catch {
    return 0;
  }
}

export async function SiteHeader() {
  const user = await getCurrentUser();
  const cartCount = await getCartCount();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
            CartNova
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/shop" className="hover:text-slate-900">Shop</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500">
            <Search className="h-4 w-4" />
            <input
              type="text"
              aria-label="Search products"
              placeholder="Search products..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/login" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/account" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                <UserCircle2 className="h-4 w-4" />
                {user.name ?? 'Account'}
              </Link>
              {user.role === 'ADMIN' ? (
                <Link href="/admin" className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 md:inline-flex">
                  Admin
                </Link>
              ) : null}
            </>
          )}
          <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            <ShoppingCart className="h-4 w-4" />
            Cart
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
