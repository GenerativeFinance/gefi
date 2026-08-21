import React from "react";

export type BadgeVariant = "neutral" | "brand" | "profit" | "loss" | "warn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
  ...rest
}: BadgeProps): React.ReactElement {
  const cls = [
    "gf-badge",
    `gf-badge--${variant}`,
    dot ? "gf-badge--dot" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
