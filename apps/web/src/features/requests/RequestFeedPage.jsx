import PageHeader from "../../components/common/PageHeader";

export default function RequestFeedPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Requests"
        title="Browse package requests"
        description="Find senders looking for verified travelers."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Request marketplace.
      </div>
    </main>
  );
}
