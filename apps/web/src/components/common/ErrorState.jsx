import { AlertCircle } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the issue continues, contact support.",
  action,
}) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-700">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-red-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
