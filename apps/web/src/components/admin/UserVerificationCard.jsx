import { toast } from "sonner";
import Avatar from "../common/Avatar";
import StatusChip from "../common/StatusChip";

export default function UserVerificationCard({ user, onUpdate }) {
  function update(status) {
    toast.success(`User ${status.replace("_", " ")}.`);
    onUpdate?.({ ...user, verificationStatus: status });
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h3 className="font-semibold text-slate-950">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <StatusChip status={user.verificationStatus} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => update("verified")} className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white">
          Approve
        </button>
        <button onClick={() => update("rejected")} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
          Reject
        </button>
        <button onClick={() => update("suspended")} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Suspend
        </button>
      </div>
    </article>
  );
}
