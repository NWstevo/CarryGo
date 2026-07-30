import { PackageOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import TripCard from "../../components/trips/TripCard";
import TripInterestModal from "../../components/trips/TripInterestModal";
import { useAuthStore } from "../auth/auth.store";
import { tripsApi } from "./trips.api";

export default function TripFeedPage() {
  const token = useAuthStore((state) => state.token);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    let mounted = true;

    tripsApi
      .list()
      .then(({ trips }) => {
        if (mounted) setTrips(trips);
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
  }, []);

  function openInterestModal(trip) {
    if (!token) {
      toast.error("Log in with a real account to request a connection.");
      return;
    }

    setSelectedTrip(trip);
  }

  async function submitInterest(declaration) {
    await tripsApi.requestConnection(selectedTrip.id, declaration);
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Trips"
        title="Browse traveler trips"
        description="Find verified travelers with available baggage space."
        action={
          <Link
            to="/trips/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Post a trip
          </Link>
        }
      />

      {loading && <p className="text-sm text-slate-500">Loading trips...</p>}

      {error && <ErrorState description="Could not load trips from the API." />}

      {!loading && !error && trips.length === 0 && (
        <EmptyState
          icon={PackageOpen}
          title="No trips yet"
          description="Traveler trips created through the backend will appear here."
        />
      )}

      {!loading && !error && trips.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onRequest={openInterestModal} />
          ))}
        </div>
      )}

      <TripInterestModal
        trip={selectedTrip}
        open={Boolean(selectedTrip)}
        onClose={() => setSelectedTrip(null)}
        onSubmit={submitInterest}
      />
    </main>
  );
}
