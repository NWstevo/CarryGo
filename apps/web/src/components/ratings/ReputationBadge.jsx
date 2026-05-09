import { Star } from "lucide-react";

export default function ReputationBadge({ rating, count }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-800">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      {rating || "New"}
      {count !== undefined && <span className="text-yellow-700">({count})</span>}
    </div>
  );
}
