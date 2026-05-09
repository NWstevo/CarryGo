import StatusChip from "../common/StatusChip";
import DealTimeline from "./DealTimeline";
import DealActions from "./DealActions";

export default function DealCard({ deal, role = "sender", onUpdate }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {deal.origin} → {deal.destination}
          </h2>
          <p className="text-sm text-slate-500">
            {deal.item} · ${deal.budget}
          </p>
        </div>

        <StatusChip status={deal.status} />
      </div>

      <div className="mt-6">
        <DealTimeline status={deal.status} />
      </div>

      <DealActions deal={deal} role={role} onUpdate={onUpdate} />
    </article>
  );
}
