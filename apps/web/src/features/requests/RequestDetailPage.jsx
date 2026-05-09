import PageHeader from "../../components/common/PageHeader";

export default function RequestDetailPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Request details"
        title="Package request"
        description="View item, destination, date, budget, and offer to carry."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Request detail page.
      </div>
    </main>
  );
}
