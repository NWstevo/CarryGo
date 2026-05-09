import PageHeader from "../../components/common/PageHeader";

export default function TripDetailPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Trip details"
        title="Traveler trip"
        description="View route, departure date, available weight, and request to connect."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Trip detail page.
      </div>
    </main>
  );
}
