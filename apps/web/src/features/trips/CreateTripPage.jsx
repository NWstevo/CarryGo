import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { tripsApi } from "./trips.api";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    availableWeight: "",
  });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      await tripsApi.create(form);
      toast.success("Trip created.");
      navigate("/trips");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create trip.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Create trip"
        title="List your trip"
        description="Offer available baggage space to trusted senders."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Origin"
            name="origin"
            value={form.origin}
            onChange={updateField}
            required
          />
          <Input
            label="Destination"
            name="destination"
            value={form.destination}
            onChange={updateField}
            required
          />
          <Input
            label="Departure date"
            name="departureDate"
            type="date"
            value={form.departureDate}
            onChange={updateField}
            required
          />
          <Input
            label="Available weight"
            name="availableWeight"
            type="number"
            min="0.1"
            step="0.1"
            value={form.availableWeight}
            onChange={updateField}
            required
          />
        </div>

        <Button type="submit" className="mt-6" disabled={loading}>
          {loading ? "Creating..." : "Create trip"}
        </Button>
      </form>
    </main>
  );
}
