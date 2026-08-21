/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "./Button.js";
import { Card } from "./Card.js";
import { Badge } from "./Badge.js";
import { Input } from "./Input.js";
import { Spinner } from "./Spinner.js";
import { MetricCard } from "./primitives/MetricCard.js";
import { TrendIndicator } from "./primitives/TrendIndicator.js";
import { RiskBadge } from "./primitives/RiskBadge.js";
import { ComplianceBadge } from "./primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "./primitives/JurisdictionBadge.js";
import { Sparkline } from "./primitives/Sparkline.js";
import { Gauge } from "./primitives/Gauge.js";

describe("Button", () => {
  it("renders with correct class for variant", () => {
    const { container } = render(<Button variant="primary">Click</Button>);
    expect(container.querySelector(".gf-btn--primary")).toBeTruthy();
  });

  it("renders secondary variant", () => {
    const { container } = render(<Button variant="secondary">Click</Button>);
    expect(container.querySelector(".gf-btn--secondary")).toBeTruthy();
  });

  it("renders ghost variant", () => {
    const { container } = render(<Button variant="ghost">Click</Button>);
    expect(container.querySelector(".gf-btn--ghost")).toBeTruthy();
  });

  it("shows spinner when loading", () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container.querySelector(".gf-spinner")).toBeTruthy();
  });

  it("is disabled when loading", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("applies sm size class", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    expect(container.querySelector(".gf-btn--sm")).toBeTruthy();
  });
});

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Hello card</Card>);
    expect(screen.getByText("Hello card")).toBeTruthy();
  });

  it("renders title", () => {
    render(<Card title="Portfolio" />);
    expect(screen.getByText("Portfolio")).toBeTruthy();
  });

  it("renders subtitle", () => {
    render(<Card title="X" subtitle="24-hour window" />);
    expect(screen.getByText("24-hour window")).toBeTruthy();
  });

  it("applies raised class", () => {
    const { container } = render(<Card variant="raised">x</Card>);
    expect(container.querySelector(".gf-card--raised")).toBeTruthy();
  });
});

describe("Badge", () => {
  it("renders with profit variant", () => {
    const { container } = render(<Badge variant="profit">+2.4%</Badge>);
    expect(container.querySelector(".gf-badge--profit")).toBeTruthy();
    expect(screen.getByText("+2.4%")).toBeTruthy();
  });

  it("renders dot variant", () => {
    const { container } = render(<Badge dot>Live</Badge>);
    expect(container.querySelector(".gf-badge--dot")).toBeTruthy();
  });
});

describe("Input", () => {
  it("renders label", () => {
    render(<Input label="Email" type="email" />);
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("shows error message with role=alert", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Required")).toBeTruthy();
  });

  it("marks input as invalid on error", () => {
    render(<Input label="Email" error="Invalid" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Spinner", () => {
  it("renders with accessible role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("uses custom label", () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByLabelText("Fetching data")).toBeTruthy();
  });
});

describe("MetricCard", () => {
  it("renders label and value", () => {
    render(<MetricCard label="Sharpe Ratio" value="2.41" />);
    expect(screen.getByText("Sharpe Ratio")).toBeTruthy();
    expect(screen.getByText("2.41")).toBeTruthy();
  });

  it("renders unit", () => {
    render(<MetricCard label="AUM" value="4.2" unit="B" />);
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("renders with sparkline data without crash", () => {
    render(
      <MetricCard
        label="Returns"
        value="12.3%"
        sparkline={[10, 12, 11, 14, 13, 15]}
      />,
    );
    expect(screen.getByText("Returns")).toBeTruthy();
  });

  it("renders trend indicator", () => {
    render(
      <MetricCard
        label="Return"
        value="7.2%"
        trend={{ value: 1.5, direction: "up" }}
      />,
    );
    expect(screen.getByText("7.2%")).toBeTruthy();
  });
});

describe("TrendIndicator", () => {
  it("shows up arrow for positive", () => {
    render(<TrendIndicator value={2.5} direction="up" />);
    expect(screen.getByText(/↑/)).toBeTruthy();
  });

  it("shows down arrow for negative", () => {
    render(<TrendIndicator value={-1.2} direction="down" />);
    expect(screen.getByText(/↓/)).toBeTruthy();
  });

  it("infers direction from value sign", () => {
    render(<TrendIndicator value={3.1} />);
    expect(screen.getByText(/↑/)).toBeTruthy();
  });
});

describe("RiskBadge", () => {
  it("renders low risk label", () => {
    render(<RiskBadge level="low" />);
    expect(screen.getByText(/Low Risk/i)).toBeTruthy();
  });

  it("renders critical with score", () => {
    render(<RiskBadge level="critical" score={9.2} />);
    expect(screen.getByText(/Critical/i)).toBeTruthy();
    expect(screen.getByText(/9\.2/)).toBeTruthy();
  });

  it("applies correct class for high", () => {
    const { container } = render(<RiskBadge level="high" />);
    expect(container.querySelector(".gf-risk--high")).toBeTruthy();
  });
});

describe("ComplianceBadge", () => {
  it("renders compliant status with accessible role", () => {
    render(<ComplianceBadge status="compliant" />);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText(/Compliant/i)).toBeTruthy();
  });

  it("renders violation status", () => {
    const { container } = render(<ComplianceBadge status="violation" />);
    expect(container.querySelector(".gf-compliance--violation")).toBeTruthy();
  });

  it("uses custom label", () => {
    render(<ComplianceBadge status="review" label="Pending Review" />);
    expect(screen.getByText("Pending Review")).toBeTruthy();
  });
});

describe("JurisdictionBadge", () => {
  it("renders EU badge", () => {
    render(<JurisdictionBadge region="eu" />);
    expect(screen.getByText("EU")).toBeTruthy();
  });

  it("renders MENA badge", () => {
    render(<JurisdictionBadge region="mena" />);
    expect(screen.getByText("MENA")).toBeTruthy();
  });

  it("has accessible label", () => {
    render(<JurisdictionBadge region="us" />);
    expect(screen.getByLabelText("Jurisdiction: US")).toBeTruthy();
  });

  it("handles unknown region gracefully", () => {
    render(<JurisdictionBadge region="latam" />);
    expect(screen.getByText("LATAM")).toBeTruthy();
  });
});

describe("Sparkline", () => {
  it("renders SVG with data", () => {
    const { container } = render(
      <Sparkline data={[10, 20, 15, 25, 18, 30]} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("path")).toBeTruthy();
  });

  it("returns null for single data point", () => {
    const { container } = render(<Sparkline data={[5]} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders without area path when area=false", () => {
    const { container } = render(
      <Sparkline data={[10, 20, 15]} area={false} />,
    );
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
  });
});

describe("Gauge", () => {
  it("renders with meter role", () => {
    render(<Gauge value={60} label="Privacy Budget" />);
    expect(screen.getByRole("meter")).toBeTruthy();
  });

  it("shows percentage text", () => {
    render(<Gauge value={75} max={100} />);
    expect(screen.getByText("75%")).toBeTruthy();
  });

  it("clamps value above max", () => {
    render(<Gauge value={150} max={100} />);
    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("renders label below SVG", () => {
    render(<Gauge value={40} label="ε budget" />);
    expect(screen.getByText("ε budget")).toBeTruthy();
  });
});
