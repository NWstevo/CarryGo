import Input from "../common/Input";

export default function TripFilters({ filters, onChange }) {
  function update(key, value) {
    onChange?.({ ...filters, [key]: value });
  }

  return (
    <div className="mb-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
      <Input
        placeholder="Origin"
        value={filters?.origin || ""}
        onChange={(e) => update("origin", e.target.value)}
      />
      <Input
        placeholder="Destination"
        value={filters?.destination || ""}
        onChange={(e) => update("destination", e.target.value)}
      />
      <Input
        type="date"
        value={filters?.date || ""}
        onChange={(e) => update("date", e.target.value)}
      />
      <Input
        type="number"
        placeholder="Min kg"
        value={filters?.weight || ""}
        onChange={(e) => update("weight", e.target.value)}
      />
    </div>
  );
}
