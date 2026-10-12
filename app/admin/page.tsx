import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  try {
    await requireAdmin();
  } catch {
    redirect('/account');
  }

  const [totalOrders, totalProducts, registeredCustomers, lowStock, recentOrders, categories] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.findMany({ where: { stock: { lte: 5 }, active: true }, orderBy: { stock: 'asc' }, take: 5 }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Admin dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Operations overview</h1>
        </div>
        <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Storefront
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-slate-500">Orders</p><p className="mt-4 text-3xl font-black text-slate-900">{totalOrders}</p></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-slate-500">Products</p><p className="mt-4 text-3xl font-black text-slate-900">{totalProducts}</p></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-slate-500">Customers</p><p className="mt-4 text-3xl font-black text-slate-900">{registeredCustomers}</p></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-slate-500">Low stock</p><p className="mt-4 text-3xl font-black text-slate-900">{lowStock.length}</p></div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create category</h2>
          <form method="post" action="/api/admin/categories" className="mt-5 space-y-4">
            <input name="name" placeholder="Category name" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <input name="description" placeholder="Short description" className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Add category</button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create product</h2>
          <form method="post" action="/api/admin/products" className="mt-5 space-y-4">
            <input name="name" placeholder="Product name" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <input name="sku" placeholder="SKU" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <input name="price" type="number" placeholder="Price in cents" min={100} required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <input name="stock" type="number" placeholder="Stock" min={0} required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <select name="categoryId" defaultValue="" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <option value="" disabled>Select category</option>
              {categories.map((category: (typeof categories)[number]) => (<option key={category.id} value={category.id}>{category.name}</option>))}
            </select>
            <textarea name="description" placeholder="Description" required rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Add product</button>
          </form>
        </section>
      </div>

      <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
        <div className="mt-5 space-y-3">
          {recentOrders.map((order: (typeof recentOrders)[number]) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                <p className="text-sm text-slate-600">{order.user?.email ?? 'Guest customer'}</p>
              </div>
              <div className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</div>
              <div className="font-semibold text-slate-900">{formatMoney(order.total)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
