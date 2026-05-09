const steps = ["pending", "agreed", "in_transit", "delivered", "completed"];

export default function DealTimeline({ status }) {
  if (status === "cancelled" || status === "disputed") {
    return (
      <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
        Deal is {status.replace("_", " ")}.
      </div>
    );
  }

  const currentIndex = Math.max(steps.indexOf(status), 0);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const active = index <= currentIndex;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className={["h-3 w-3 rounded-full", active ? "bg-blue-600" : "bg-slate-200"].join(" ")} />
            {index < steps.length - 1 && (
              <div className={["h-0.5 flex-1", active ? "bg-blue-600" : "bg-slate-200"].join(" ")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
