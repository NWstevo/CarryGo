import { PackageOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import RequestCard from "../../components/requests/RequestCard";
import TravelerOfferModal from "../../components/requests/TravelerOfferModal";
import { useAuthStore } from "../auth/auth.store";
import { requestsApi } from "./requests.api";

export default function RequestFeedPage() {
  const token = useAuthStore((state) => state.token);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  function openOfferModal(request) {
    if (!token) {
      toast.error("Log in with a real account to offer a connection.");
      return;
    }

    setSelectedRequest(request);
  }

  async function submitOffer(declaration) {
    await requestsApi.offerConnection(selectedRequest.id, declaration);
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Requests"
        title="Browse package requests"
        description="Find senders looking for verified travelers."
        action={
          <Link
            to="/requests/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New request
          </Link>
        }
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
              onOffer={openOfferModal}
            />
          ))}
        </div>
      )}

      <TravelerOfferModal
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onSubmit={submitOffer}
      />
    </main>
  );
}
