export function LegalDocument({ title, updated, children }) {
  return (
    <main className="page-shell max-w-3xl">
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        <strong>Draft, not final legal copy.</strong> This document was generated to match
        CarryGo's actual current functionality. It has not been reviewed by a lawyer and
        should not be relied on as-is before real users, real payments, or real cross-border
        shipments are involved. Bracketed text like{" "}
        <code className="rounded bg-amber-100 px-1">[Company Legal Name]</code> must be
        filled in, and the whole document should be reviewed by qualified counsel before
        launch.
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>

      <div className="legal-prose mt-8">{children}</div>
    </main>
  );
}

export function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}
