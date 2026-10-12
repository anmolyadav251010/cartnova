import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">404</p>
      <h1 className="mt-4 text-4xl font-black text-slate-900">This page is missing.</h1>
      <p className="mt-4 text-slate-600">The product, category, or page you requested could not be found.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700">
        Return home
      </Link>
    </div>
  );
}
