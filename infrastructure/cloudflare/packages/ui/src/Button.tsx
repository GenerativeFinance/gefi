import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  as: Tag = "button",
  href,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps): React.ReactElement {
  const cls = [
    "gf-btn",
    `gf-btn--${variant}`,
    size !== "md" ? `gf-btn--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const props = {
    className: cls,
    "aria-disabled": disabled || loading || undefined,
    disabled: Tag === "button" ? disabled || loading : undefined,
    href: Tag === "a" ? href : undefined,
    ...rest,
  } as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag {...(props as any)}>
      {loading && (
        <span className="gf-spinner gf-spinner--sm" aria-hidden="true" />
      )}
      {children}
    </Tag>
  );
}
