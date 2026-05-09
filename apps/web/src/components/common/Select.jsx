import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, className = "", id, children, ...props },
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

      <select
        ref={ref}
        id={inputId}
        className={[
          "app-input",
          label && "mt-1",
          error && "border-red-300 focus:border-red-500 focus:ring-red-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
