const styles = {
  pending: "bg-amber-50 text-amber-700",
  pending_verification: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  suspended: "bg-red-50 text-red-700",
  agreed: "bg-blue-50 text-blue-700",
  in_transit: "bg-blue-50 text-blue-700",
  delivered: "bg-purple-50 text-purple-700",
  completed: "bg-green-50 text-green-700",
  disputed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export default function StatusChip({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
        styles[status] || "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {String(status).replace("_", " ")}
    </span>
  );
}
