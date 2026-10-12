export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Contact</p>
      <h1 className="mt-2 text-4xl font-black text-slate-900">We’d love to hear from you.</h1>
      <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-3 text-slate-600">
          <p>Email: hello@cartnova.example</p>
          <p>Phone: +1 (415) 555-0144</p>
          <p>Hours: Monday to Friday, 9am–6pm PT</p>
        </div>
      </div>
    </div>
  );
}
