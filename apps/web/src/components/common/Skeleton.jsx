export default function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl bg-slate-200",
        className,
      ].join(" ")}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-48" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
