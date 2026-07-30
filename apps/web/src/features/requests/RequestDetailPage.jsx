import { CalendarDays, Package, PackageOpen, Star, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import TravelerOfferModal from "../../components/requests/TravelerOfferModal";
import { useAuthStore } from "../auth/auth.store";
import { requestsApi } from "./requests.api";

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const token = useAuthStore((state) => state.token);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    requestsApi
      .detail(requestId)
      .then(({ request }) => {
        if (mounted) setRequest(request);
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
  }, [requestId]);

  function openOfferModal() {
    if (!token) {
      toast.error("Log in with a real account to offer a connection.");
      return;
    }

    setModalOpen(true);
  }

  async function submitOffer(declaration) {
    await requestsApi.offerConnection(request.id, declaration);
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Request details"
        title="Package request"
        description="View item, destination, date, budget, and offer to carry."
      />

      {loading && <p className="text-sm text-slate-500">Loading request...</p>}

      {error && <ErrorState description="Could not load this request from the API." />}

      {!loading && !error && !request && (
        <EmptyState
          icon={PackageOpen}
          title="This request is no longer available"
          description="It may have already been matched or removed by the sender."
        />
      )}

      {!loading && !error && request && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">To {request.targetDestination}</p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            {request.item}
          </h2>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Info icon={Package} label="Weight" value={`${request.itemWeight} kg`} />
            <Info icon={CalendarDays} label="Date" value={request.targetDate} />
            <Info icon={Wallet} label="Budget" value={`$${request.budget}`} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {request.sender?.ratingAverage || "New"} · {request.sender?.name}
            </div>

            <button
              onClick={openOfferModal}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Offer to carry
            </button>
          </div>
        </div>
      )}

      <TravelerOfferModal
        request={request}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitOffer}
      />
    </main>
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
