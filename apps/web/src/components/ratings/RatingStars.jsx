import { Star } from "lucide-react";

export default function RatingStars({ value = 0, onChange, size = "md" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-9 w-9",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={[
              sizes[size],
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300",
            ].join(" ")}
          />
        </button>
      ))}
    </div>
  );
}
