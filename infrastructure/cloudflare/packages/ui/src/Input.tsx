import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({
  label,
  hint,
  error,
  id,
  className = "",
  ...rest
}: InputProps): React.ReactElement {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="gf-input-wrap">
      {label && (
        <label className="gf-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "gf-input",
          error ? "gf-input--error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-describedby={
          error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
        }
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-err`} className="gf-hint gf-hint--error" role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${inputId}-hint`} className="gf-hint">
          {hint}
        </span>
      )}
    </div>
  );
}
