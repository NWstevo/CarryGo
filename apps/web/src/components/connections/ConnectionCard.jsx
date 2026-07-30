import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StatusChip from "../common/StatusChip";
import ConnectionActions from "./ConnectionActions";

export default function ConnectionCard({ connection, onUpdate }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {connection.listingTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            From {connection.otherUser?.name || connection.otherUser}
          </p>
        </div>

        <StatusChip status={connection.status} />
      </div>

      {connection.message && (
        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          “{connection.message}”
        </p>
      )}

      <ConnectionActions connection={connection} onUpdate={onUpdate} />

      {connection.status === "accepted" && (
        <Link
          to={`/chats/${connection.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Open chat
        </Link>
      )}
    </article>
  );
}
