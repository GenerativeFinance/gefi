/**
 * ModelCard snapshot tests at the three Phase-2 breakpoints.
 *
 * The component itself is breakpoint-agnostic (responsive layout is driven
 * by `.model-card` CSS in `app.css`), so we lock down three real inline
 * snapshots — one per breakpoint — using a representative fixture at each:
 *
 *   - desktop (≥1024px): full meta, thumbnail, federated, paid tier
 *   - tablet  (768px)  : no thumbnail, federated false, mid price
 *   - mobile  (380px)  : minimal — free tier, low rating volume
 *
 * Any drift in the rendered HTML — string changes, attribute order,
 * whitespace — fails the matching snapshot loudly.
 */
import { describe, it, expect } from "vitest";
import { ModelCard, type ModelCardProps } from "./ModelCard.js";

const desktopFixture: ModelCardProps = {
  name: "Privacy-First Federated Credit Oracle",
  description: "Gradient-boosted PD model with alt-data feature pack for SME books.",
  category: "credit-scoring",
  riskLevel: "high",
  price: 14900,
  rating: 4.8,
  ratingCount: 211,
  federated: true,
  thumbnailUrl: "https://cdn.gefi.io/models/credit-oracle.png",
  href: "/models/credit-default-classifier/",
};

const tabletFixture: ModelCardProps = {
  name: "Compliance Redaction LLM",
  description: "PII and counterparty-name redaction tuned for chat and call transcripts.",
  category: "compliance-aml",
  riskLevel: "low",
  price: 7900,
  rating: 4.9,
  ratingCount: 304,
  federated: false,
  thumbnailUrl: null,
  href: "/models/compliance-redaction-llm/",
};

const mobileFixture: ModelCardProps = {
  name: "Sentiment from Filings",
  description: "FinBERT-style classifier scoring 10-K and 10-Q narrative sections.",
  category: "sentiment-analysis",
  riskLevel: "medium",
  price: 0,
  rating: 4.2,
  ratingCount: 18,
  federated: false,
  thumbnailUrl: null,
  href: "/models/sentiment-from-filings/",
};

describe("ModelCard", () => {
  it("renders the desktop (≥1024px) snapshot", () => {
    expect(ModelCard(desktopFixture)).toMatchInlineSnapshot(
      `"<a class="model-card" href="/models/credit-default-classifier/" data-slug="credit-default-classifier"><img class="model-card__thumb" src="https://cdn.gefi.io/models/credit-oracle.png" alt="" loading="lazy" width="320" height="160" /><div class="model-card__body"><div class="model-card__meta"><span class="model-card__category">credit-scoring</span><span class="model-card__badge model-card__badge--risk-high">High risk</span><span class="model-card__badge model-card__badge--federated" title="Federated training">Federated</span></div><h3 class="model-card__name">Privacy-First Federated Credit Oracle</h3><p class="model-card__description">Gradient-boosted PD model with alt-data feature pack for SME books.</p><div class="model-card__footer"><span class="model-card__price">$149</span><span class="model-card__rating" aria-label="Rating 4.8 out of 5 from 211 reviews"><span aria-hidden="true">★</span> <span class="model-card__rating-value" data-rating>4.8</span> <span class="model-card__rating-count" data-rating-count>(211)</span></span></div></div></a>"`,
    );
  });

  it("renders the tablet (768px) snapshot", () => {
    expect(ModelCard(tabletFixture)).toMatchInlineSnapshot(
      `"<a class="model-card" href="/models/compliance-redaction-llm/" data-slug="compliance-redaction-llm"><div class="model-card__thumb model-card__thumb--placeholder" aria-hidden="true"></div><div class="model-card__body"><div class="model-card__meta"><span class="model-card__category">compliance-aml</span><span class="model-card__badge model-card__badge--risk-low">Low risk</span></div><h3 class="model-card__name">Compliance Redaction LLM</h3><p class="model-card__description">PII and counterparty-name redaction tuned for chat and call transcripts.</p><div class="model-card__footer"><span class="model-card__price">$79</span><span class="model-card__rating" aria-label="Rating 4.9 out of 5 from 304 reviews"><span aria-hidden="true">★</span> <span class="model-card__rating-value" data-rating>4.9</span> <span class="model-card__rating-count" data-rating-count>(304)</span></span></div></div></a>"`,
    );
  });

  it("renders the mobile (380px) snapshot", () => {
    expect(ModelCard(mobileFixture)).toMatchInlineSnapshot(
      `"<a class="model-card" href="/models/sentiment-from-filings/" data-slug="sentiment-from-filings"><div class="model-card__thumb model-card__thumb--placeholder" aria-hidden="true"></div><div class="model-card__body"><div class="model-card__meta"><span class="model-card__category">sentiment-analysis</span><span class="model-card__badge model-card__badge--risk-medium">Medium risk</span></div><h3 class="model-card__name">Sentiment from Filings</h3><p class="model-card__description">FinBERT-style classifier scoring 10-K and 10-Q narrative sections.</p><div class="model-card__footer"><span class="model-card__price">Free</span><span class="model-card__rating" aria-label="Rating 4.2 out of 5 from 18 reviews"><span aria-hidden="true">★</span> <span class="model-card__rating-value" data-rating>4.2</span> <span class="model-card__rating-count" data-rating-count>(18)</span></span></div></div></a>"`,
    );
  });

  it("escapes user-supplied content (XSS guard)", () => {
    const html = ModelCard({ ...desktopFixture, name: "<script>alert(1)</script>" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#60;script&#62;");
  });

  it("renders the placeholder thumb when thumbnailUrl is null", () => {
    expect(ModelCard(tabletFixture)).toContain("model-card__thumb--placeholder");
  });

  it("renders an <img> when thumbnailUrl is provided", () => {
    const html = ModelCard(desktopFixture);
    expect(html).toContain('src="https://cdn.gefi.io/models/credit-oracle.png"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain("model-card__thumb--placeholder");
  });
});
