import { describe, expect, it } from "vitest";
import { Button } from "./Button.js";
import { Card } from "./Card.js";
import { colors, fonts, radii, tokensToCss } from "./tokens.js";

describe("brand tokens", () => {
  it("locks the published palette", () => {
    expect(colors.bg).toBe("#0B0E1A");
    expect(colors.surface).toBe("#141826");
    expect(colors.brand).toBe("#6D5BFF");
    expect(colors.accent).toBe("#22D3EE");
    expect(colors.text).toBe("#E6E8F0");
    expect(colors.muted).toBe("#8A8FA3");
  });

  it("exposes Inter as the sans font", () => {
    expect(fonts.sans).toMatch(/Inter/);
  });

  it("exposes sm/md/lg radii", () => {
    expect(radii).toMatchObject({ sm: expect.any(String), md: expect.any(String), lg: expect.any(String) });
  });

  it("emits :root CSS custom properties for every token", () => {
    const css = tokensToCss();
    expect(css).toContain(":root {");
    expect(css).toContain("--color-brand: #6D5BFF;");
    expect(css).toContain("--color-bg: #0B0E1A;");
    expect(css).toContain("--radius-md:");
    expect(css).toContain("--font-sans:");
  });
});

describe("Button", () => {
  it("renders an anchor when href is provided", () => {
    const html = Button({ label: "Subscribe", href: "/api/subscribe", variant: "primary" });
    expect(html).toContain("<a");
    expect(html).toContain('href="/api/subscribe"');
    expect(html).toContain("btn--primary");
  });

  it("renders a button element by default", () => {
    expect(Button({ label: "Go", type: "submit" })).toContain('type="submit"');
  });

  it("escapes label content", () => {
    expect(Button({ label: "<script>" })).not.toContain("<script>");
  });
});

describe("Card", () => {
  it("renders title + body + footer", () => {
    const html = Card({ title: "Hi", body: "<p>x</p>", footer: "<small>y</small>" });
    expect(html).toContain("card__title");
    expect(html).toContain("<p>x</p>");
    expect(html).toContain("card__footer");
  });
});
