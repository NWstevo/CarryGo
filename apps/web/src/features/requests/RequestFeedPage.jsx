import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import RequestCard from "../../components/requests/RequestCard";
import { useAuthStore } from "../auth/auth.store";
import { requestsApi } from "./requests.api";

export default function RequestFeedPage() {
  const token = useAuthStore((state) => state.token);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    requestsApi
      .list()
      .then(({ requests }) => {
        if (mounted) setRequests(requests);
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

  async function offerConnection(request) {
    if (!token) {
      toast.error("Log in with a real account to offer a connection.");
      return;
    }

    const message = window.prompt("Add a short message for the sender.");

    try {
      await requestsApi.offerConnection(request.id, { message });
      toast.success("Offer sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send offer.");
    }
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Requests"
        title="Browse package requests"
        description="Find senders looking for verified travelers."
      />

      {loading && <p className="text-sm text-slate-500">Loading requests...</p>}

      {error && <ErrorState description="Could not load requests from the API." />}

      {!loading && !error && requests.length === 0 && (
        <EmptyState
          icon={PackageOpen}
          title="No requests yet"
          description="Sender requests created through the backend will appear here."
        />
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onOffer={offerConnection}
            />
          ))}
        </div>
      )}
    </main>
  );
}
