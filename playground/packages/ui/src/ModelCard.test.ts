/**
 * ModelCard snapshot tests.
 *
 * The HTML output is identical at every breakpoint — responsive layout is
 * driven by `.model-card` CSS in `app.css`. We snapshot once for the canonical
 * shape and re-assert structure at each breakpoint using viewport-flavoured
 * test names so a future visual-regression suite can pin the same fixtures.
 */
import { describe, it, expect } from "vitest";
import { ModelCard, type ModelCardProps } from "./ModelCard.js";

const fixture: ModelCardProps = {
  name: "Privacy-First Federated Credit Oracle",
  description: "Gradient-boosted PD model with alt-data feature pack for SME books.",
  category: "credit-scoring",
  riskLevel: "high",
  price: 14900,
  rating: 4.8,
  ratingCount: 211,
  federated: true,
  thumbnailUrl: null,
  href: "/models/credit-default-classifier/",
};

describe("ModelCard", () => {
  it("renders identical HTML at the desktop (≥ 1024px) breakpoint", () => {
    expect(ModelCard(fixture)).toMatchInlineSnapshot(
      `"<a class="model-card" href="/models/credit-default-classifier/" data-slug="credit-default-classifier"><div class="model-card__thumb model-card__thumb--placeholder" aria-hidden="true"></div><div class="model-card__body"><div class="model-card__meta"><span class="model-card__category">credit-scoring</span><span class="model-card__badge model-card__badge--risk-high">High risk</span><span class="model-card__badge model-card__badge--federated" title="Federated training">Federated</span></div><h3 class="model-card__name">Privacy-First Federated Credit Oracle</h3><p class="model-card__description">Gradient-boosted PD model with alt-data feature pack for SME books.</p><div class="model-card__footer"><span class="model-card__price">$149</span><span class="model-card__rating" aria-label="Rating 4.8 out of 5 from 211 reviews"><span aria-hidden="true">★</span> <span class="model-card__rating-value" data-rating>4.8</span> <span class="model-card__rating-count" data-rating-count>(211)</span></span></div></div></a>"`,
    );
  });

  it("renders the same HTML at the tablet (768px) breakpoint — CSS handles responsiveness", () => {
    expect(ModelCard(fixture)).toBe(ModelCard(fixture));
    const html = ModelCard(fixture);
    expect(html).toContain('class="model-card"');
    expect(html).toContain("data-rating");
  });

  it("renders the same HTML at the mobile (380px) breakpoint", () => {
    const html = ModelCard(fixture);
    expect(html).toContain('class="model-card__name"');
    expect(html).toContain("Federated");
  });

  it("renders Free for price=0 and omits the federated badge when false", () => {
    const html = ModelCard({ ...fixture, name: "Free Tier Demo", price: 0, federated: false });
    expect(html).toContain(">Free<");
    expect(html).not.toContain("model-card__badge--federated");
  });

  it("escapes user-supplied content (XSS guard)", () => {
    const html = ModelCard({ ...fixture, name: "<script>alert(1)</script>" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#60;script&#62;");
  });

  it("uses an <img> when thumbnailUrl is provided", () => {
    const html = ModelCard({ ...fixture, thumbnailUrl: "https://cdn/x.png" });
    expect(html).toContain('src="https://cdn/x.png"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain("model-card__thumb--placeholder");
  });
});
