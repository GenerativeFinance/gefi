import React from "react";
import { TrendIndicator, type TrendDirection } from "./TrendIndicator.js";
import { Sparkline } from "./Sparkline.js";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; direction: TrendDirection; label?: string };
  sparkline?: number[];
  sub?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  sparkline,
  sub,
  className = "",
}: MetricCardProps): React.ReactElement {
  return (
    <div className={["gf-metric", className].filter(Boolean).join(" ")}>
      <div className="gf-metric__label">{label}</div>
      <div className="gf-metric__value">
        {value}
        {unit && (
          <span
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--color-muted)",
              marginLeft: 4,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {(trend ?? sub) && (
        <div className="gf-metric__footer">
          {trend && (
            <TrendIndicator
              value={trend.value}
              direction={trend.direction}
              label={trend.label}
            />
          )}
          {sub && <span className="gf-metric__sub">{sub}</span>}
        </div>
      )}
      {sparkline && sparkline.length > 1 && (
        <div style={{ marginTop: "var(--space-3)" }}>
          <Sparkline
            data={sparkline}
            color={
              trend?.direction === "up"
                ? "var(--color-profit)"
                : trend?.direction === "down"
                  ? "var(--color-loss)"
                  : "var(--color-brand)"
            }
            height={36}
          />
        </div>
      )}
    </div>
  );
}
