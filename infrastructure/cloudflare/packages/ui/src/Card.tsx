import React from "react";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "ghost" | "raised";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function Card({
  variant = "default",
  title,
  subtitle,
  action,
  className = "",
  children,
  ...rest
}: CardProps): React.ReactElement {
  const cls = [
    "gf-card",
    variant !== "default" ? `gf-card--${variant}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...rest}>
      {(title ?? action) && (
        <div className="gf-card__header">
          <div>
            {title && <h3 className="gf-card__title">{title}</h3>}
            {subtitle && <p className="gf-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
