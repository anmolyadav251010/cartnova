import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?error=checkout-auth-required');
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  const subtotal = (cart?.items ?? []).reduce((sum: number, item: NonNullable<typeof cart>['items'][number]) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Checkout</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Complete your order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form method="post" action="/api/checkout" className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="fullName" placeholder="Full name" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
              <input name="email" type="email" placeholder="Email address" defaultValue={user.email} required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
              <input name="phone" placeholder="Phone number" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
              <input name="line1" placeholder="Street address" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
              <input name="line2" placeholder="Apartment, suite, etc. (optional)" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
              <input name="city" placeholder="City" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              <input name="state" placeholder="State" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              <input name="postalCode" placeholder="Postal code" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
              <input name="country" placeholder="Country" defaultValue="United States" required className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:col-span-2" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Shipping method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div><p className="font-medium text-slate-900">Standard shipping</p><p className="text-sm text-slate-500">Delivery in 4–6 business days</p></div>
                <input type="radio" name="shippingMethod" value="standard" defaultChecked />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div><p className="font-medium text-slate-900">Express shipping</p><p className="text-sm text-slate-500">Priority delivery in 2–3 business days</p></div>
                <input type="radio" name="shippingMethod" value="express" />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
            <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-violet-700">Demo secure payment</p>
              <p className="mt-1">This portfolio project uses a simulated checkout, so no real card, banking, or personal financial data is collected or stored.</p>
              <input type="hidden" name="paymentMethod" value="demo-card" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Coupon</h2>
            <div className="mt-4 flex gap-3">
              <input name="couponCode" placeholder="Enter coupon code (SAVE10)" className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
            </div>
          </div>

          <button type="submit" className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700">Place order</button>
        </form>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order review</h2>
          <div className="mt-5 space-y-4">
            {(cart?.items ?? []).map((item: NonNullable<typeof cart>['items'][number]) => (
              <div key={item.id} className="flex items-center gap-3 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
                <img src={item.product.imageUrl ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'} alt={item.product.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.product.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-slate-900">${((item.product.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{subtotal >= 12000 ? 'Free' : '$7.99'}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-$0.00</span></div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
            <div className="flex justify-between"><span>Total</span><span>${((subtotal + (subtotal >= 12000 ? 0 : 799)) / 100).toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
