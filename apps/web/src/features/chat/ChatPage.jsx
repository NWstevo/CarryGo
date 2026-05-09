import PageHeader from "../../components/common/PageHeader";

export default function ChatPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Chats"
        title="Messages"
        description="Private chat opens after a connection is accepted."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Chat page.
      </div>
    </main>
  );
}
