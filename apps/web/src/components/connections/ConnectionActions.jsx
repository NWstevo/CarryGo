import { toast } from "sonner";

export default function ConnectionActions({ connection, onUpdate }) {
  if (connection?.status !== "pending") return null;

  async function update(status) {
    try {
      await onUpdate?.(connection, status);
      toast.success(`Connection ${status}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update connection.");
    }
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        onClick={() => update("accepted")}
        className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Accept
      </button>
      <button
        onClick={() => update("rejected")}
        className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
      >
        Reject
      </button>
    </div>
  );
}
