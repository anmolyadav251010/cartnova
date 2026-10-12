import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">New customer</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Create your CartNova account</h1>
        <form method="post" action="/api/auth/register" className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input type="text" name="name" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" name="email" required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" name="password" minLength={8} required className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
          </div>
          <button type="submit" className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700">Create account</button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-medium text-violet-700">Login</Link>
        </p>
      </div>
    </div>
  );
}
