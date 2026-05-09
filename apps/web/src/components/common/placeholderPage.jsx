export default function PlaceholderPage({ title, description }) {
  return (
    <main className="page-shell">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          SendMeAsap
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      </div>
    </main>
  );
}
