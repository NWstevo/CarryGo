import { Calendar, MapPin, Package, PackageOpen, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import TripInterestModal from "../../components/trips/TripInterestModal";
import { useAuthStore } from "../auth/auth.store";
import { tripsApi } from "./trips.api";

export default function TripDetailPage() {
  const { tripId } = useParams();
  const token = useAuthStore((state) => state.token);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    tripsApi
      .detail(tripId)
      .then(({ trip }) => {
        if (mounted) setTrip(trip);
      })
      .catch((error) => {
        if (mounted) setError(error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [tripId]);

  function openInterestModal() {
    if (!token) {
      toast.error("Log in with a real account to request a connection.");
      return;
    }

    setModalOpen(true);
  }

  async function submitInterest(declaration) {
    await tripsApi.requestConnection(trip.id, declaration);
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Trip details"
        title="Traveler trip"
        description="View route, departure date, available weight, and request to connect."
      />

      {loading && <p className="text-sm text-slate-500">Loading trip...</p>}

      {error && <ErrorState description="Could not load this trip from the API." />}

      {!loading && !error && !trip && (
        <EmptyState
          icon={PackageOpen}
          title="This trip is no longer available"
          description="It may have already been booked or removed by the traveler."
        />
      )}

      {!loading && !error && trip && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {trip.origin} → {trip.destination}
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Traveler to {trip.destination}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Info icon={Calendar} label="Departure" value={trip.departureDate} />
            <Info icon={Package} label="Space" value={`${trip.availableWeight} kg`} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-6">
            <div>
              <p className="font-medium text-slate-950">{trip.traveler?.name}</p>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {trip.traveler?.ratingAverage || "New"}
              </p>
            </div>

            <button
              onClick={openInterestModal}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Request this trip
            </button>
          </div>
        </div>
      )}

      <TripInterestModal
        trip={trip}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitInterest}
      />
    </main>
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
