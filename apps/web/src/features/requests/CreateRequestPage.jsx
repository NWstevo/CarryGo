import PageHeader from "../../components/common/PageHeader";

export default function CreateRequestPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Create request"
        title="Send a package"
        description="Post a delivery request for verified travelers."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Create request form.
      </div>
    </main>
  );
}
