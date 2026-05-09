import PageHeader from "../../components/common/PageHeader";

export default function TripFeedPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Trips"
        title="Browse traveler trips"
        description="Find verified travelers with available baggage space."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          Trip marketplace
        </h2>
        <p className="mt-2 text-slate-600">
          Trip cards, filters, and traveler connection requests will appear here.
        </p>
      </div>
    </main>
  );
}
