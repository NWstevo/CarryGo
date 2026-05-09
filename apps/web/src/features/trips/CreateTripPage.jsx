import PageHeader from "../../components/common/PageHeader";

export default function CreateTripPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Create trip"
        title="List your trip"
        description="Offer available baggage space to trusted senders."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Create trip form.
      </div>
    </main>
  );
}
