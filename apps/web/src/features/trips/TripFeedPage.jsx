import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import TripCard from "../../components/trips/TripCard";
import { useAuthStore } from "../auth/auth.store";
import { tripsApi } from "./trips.api";

export default function TripFeedPage() {
  const token = useAuthStore((state) => state.token);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  async function requestConnection(trip) {
    if (!token) {
      toast.error("Log in with a real account to request a connection.");
      return;
    }

    const message = window.prompt("Add a short message for the traveler.");

    try {
      await tripsApi.requestConnection(trip.id, { message });
      toast.success("Connection request sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not request connection.");
    }
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Trips"
        title="Browse traveler trips"
        description="Find verified travelers with available baggage space."
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
            <TripCard key={trip.id} trip={trip} onRequest={requestConnection} />
          ))}
        </div>
      )}
    </main>
  );
}
