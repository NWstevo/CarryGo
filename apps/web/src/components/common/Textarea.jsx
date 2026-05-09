import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, className = "", id, rows = 4, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="app-label">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={[
          "app-input resize-none",
          label && "mt-1",
          error && "border-red-300 focus:border-red-500 focus:ring-red-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Textarea;
