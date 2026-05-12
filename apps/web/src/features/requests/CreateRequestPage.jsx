import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { requestsApi } from "./requests.api";

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    targetDate: "",
    item: "",
    itemWeight: "",
    budget: "",
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
      await requestsApi.create(form);
      toast.success("Request created.");
      navigate("/requests");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Create request"
        title="Send a package"
        description="Post a delivery request for verified travelers."
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
            label="Target date"
            name="targetDate"
            type="date"
            value={form.targetDate}
            onChange={updateField}
            required
          />
          <Input
            label="Item"
            name="item"
            value={form.item}
            onChange={updateField}
            required
          />
          <Input
            label="Item weight"
            name="itemWeight"
            type="number"
            min="0.1"
            step="0.1"
            value={form.itemWeight}
            onChange={updateField}
            required
          />
          <Input
            label="Budget"
            name="budget"
            type="number"
            min="1"
            step="1"
            value={form.budget}
            onChange={updateField}
            required
          />
        </div>

        <Button type="submit" className="mt-6" disabled={loading}>
          {loading ? "Creating..." : "Create request"}
        </Button>
      </form>
    </main>
  );
}
