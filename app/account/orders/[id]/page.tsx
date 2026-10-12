import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">← Back to account</Link>
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-violet-700">Order</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{order.orderNumber}</h1>
          </div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">{order.status}</span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Shipping</h2>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>{String((order.shippingAddressJson as Record<string, string>).fullName ?? '')}</p>
              <p>{String((order.shippingAddressJson as Record<string, string>).line1 ?? '')}</p>
              <p>{String((order.shippingAddressJson as Record<string, string>).city ?? '')}, {String((order.shippingAddressJson as Record<string, string>).postalCode ?? '')}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatMoney(order.shippingFee)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>{formatMoney(order.discount)}</span></div>
              <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>{formatMoney(order.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {order.items.map((item: (typeof order.items)[number]) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-900">{item.productName}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-slate-900">{formatMoney(item.productPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
