import PageHeader from "../../components/common/PageHeader";

export default function AdminDashboardPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard"
        description="Review pending users, verification status, and moderation activity."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Admin dashboard.
      </div>
    </main>
  );
}
