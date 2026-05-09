import PageHeader from "../../components/common/PageHeader";

export default function UserModerationPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Admin"
        title="User moderation"
        description="Approve, reject, or suspend users."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        User moderation table.
      </div>
    </main>
  );
}
