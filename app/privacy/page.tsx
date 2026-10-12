export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Privacy policy</p>
      <h1 className="mt-2 text-4xl font-black text-slate-900">Privacy and data handling</h1>
      <div className="mt-8 space-y-5 text-slate-600">
        <p>CartNova stores only the data needed to deliver the demo storefront experience, including account info, order records, and the cart contents for a logged in user or guest session.</p>
        <p>This is a portfolio application and should not be treated as a production financial platform. No real banking details or payment secrets are collected or stored.</p>
      </div>
    </div>
  );
}
