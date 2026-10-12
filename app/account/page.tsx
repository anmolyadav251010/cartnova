import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Account</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Welcome, {user.name ?? 'Customer'}</h1>
        </div>
        <form method="post" action="/api/auth/logout">
          <button type="submit" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Logout
          </button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between gap-4"><dt>Name</dt><dd className="font-medium text-slate-900">{user.name ?? 'Customer'}</dd></div>
              <div className="flex justify-between gap-4"><dt>Email</dt><dd className="font-medium text-slate-900">{user.email}</dd></div>
              <div className="flex justify-between gap-4"><dt>Role</dt><dd className="font-medium text-slate-900">{user.role}</dd></div>
            </dl>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Saved addresses</h2>
            {addresses.length > 0 ? (
              <div className="mt-4 space-y-3">
                {addresses.map((address: (typeof addresses)[number]) => (
                  <div key={address.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{address.label ?? 'Home'}</p>
                    <p>{address.fullName}</p>
                    <p>{address.line1}</p>
                    <p>{address.city}, {address.state ?? ''} {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">No saved addresses yet.</p>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Change password</h2>
            <form method="post" action="/api/account/password" className="mt-4 space-y-4">
              <input type="password" name="currentPassword" placeholder="Current password" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              <input type="password" name="newPassword" placeholder="New password" minLength={8} required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              <button type="submit" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Update password</button>
            </form>
          </section>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order history</h2>
          {orders.length > 0 ? (
            <div className="mt-5 space-y-4">
              {orders.map((order: (typeof orders)[number]) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{order.orderNumber}</p>
                      <p className="mt-1 font-semibold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{order.status}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-slate-900">{formatMoney(order.total)}</span>
                  </div>
                  <Link href={`/account/orders/${order.id}`} className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    View details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">You have not placed any orders yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
