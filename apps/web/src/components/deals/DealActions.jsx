import { toast } from "sonner";
import { getDealActions } from "../../lib/permissions";

const labels = {
  mark_in_transit: "Mark in transit",
  mark_delivered: "Mark delivered",
  confirm_completed: "Confirm completion",
  raise_dispute: "Raise dispute",
};

const statusMap = {
  mark_in_transit: "in_transit",
  mark_delivered: "delivered",
  confirm_completed: "completed",
  raise_dispute: "disputed",
};

export default function DealActions({ deal, role, onUpdate }) {
  const actions = getDealActions({ deal, role });

  if (!actions.length) return null;

  async function handleAction(action) {
    try {
      await onUpdate?.(deal, statusMap[action]);
      toast.success("Deal updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update deal.");
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => handleAction(action)}
          className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          {labels[action]}
        </button>
      ))}
    </div>
  );
}
