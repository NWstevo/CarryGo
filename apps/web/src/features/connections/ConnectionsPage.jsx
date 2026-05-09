import PageHeader from "../../components/common/PageHeader";

export default function ConnectionsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Connections"
        title="Connection inbox"
        description="Review pending, accepted, and rejected connection requests."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Connections page.
      </div>
    </main>
  );
}
