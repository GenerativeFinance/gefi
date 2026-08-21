import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  id,
  className = "",
  ...rest
}: SelectProps): React.ReactElement {
  const selectId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="gf-input-wrap">
      {label && (
        <label className="gf-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={["gf-select", className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="gf-hint gf-hint--error">{error}</span>}
      {!error && hint && <span className="gf-hint">{hint}</span>}
    </div>
  );
}
