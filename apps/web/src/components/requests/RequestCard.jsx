import { CalendarDays, Package, Wallet, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function RequestCard({ request, onOffer }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/requests/${request.id}`}>
        <p className="text-sm text-slate-500">To {request.targetDestination}</p>

        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          {request.item}
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Info icon={Package} label="Weight" value={`${request.itemWeight} kg`} />
          <Info icon={CalendarDays} label="Date" value={request.targetDate} />
          <Info icon={Wallet} label="Budget" value={`$${request.budget}`} />
        </div>

        <div className="mt-4 flex items-center gap-1 text-sm text-slate-500">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {request.sender?.ratingAverage || "New"} · {request.sender?.name}
        </div>
      </Link>

      <button
        onClick={() => onOffer?.(request)}
        className="mt-5 w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white"
      >
        Offer to carry
      </button>
    </article>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-slate-500" />
      <p className="mt-2 text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
