import PageHeader from "../../components/common/PageHeader";

export default function DealsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Deals"
        title="Deal tracking"
        description="Track delivery status from agreement to completion."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Deals page.
      </div>
    </main>
  );
}
