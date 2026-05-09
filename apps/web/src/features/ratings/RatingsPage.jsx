import PageHeader from "../../components/common/PageHeader";

export default function RatingsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Ratings"
        title="Reputation"
        description="View user ratings and trust history."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Ratings page.
      </div>
    </main>
  );
}
