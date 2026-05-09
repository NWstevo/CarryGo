import { Calendar, MapPin, Package, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function TripCard({ trip, onRequest }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/trips/${trip.id}`}>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {trip.origin} → {trip.destination}
        </div>

        <h2 className="mt-3 text-xl font-semibold text-slate-950">
          Traveler to {trip.destination}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Info icon={Calendar} label="Departure" value={trip.departureDate} />
          <Info icon={Package} label="Space" value={`${trip.availableWeight} kg`} />
        </div>
      </Link>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div>
          <p className="font-medium text-slate-950">{trip.traveler?.name}</p>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {trip.traveler?.ratingAverage || "New"}
          </p>
        </div>

        <button
          onClick={() => onRequest?.(trip)}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Request
        </button>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="h-4 w-4 text-slate-500" />
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-950">{value}</p>
    </div>
  );
}
