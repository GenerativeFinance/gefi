/**
 * Server-side ModelCard component (returns an HTML string).
 *
 * Framework-free so the same renderer works from the Jekyll build (via a
 * tiny Liquid include that calls into the generated HTML data) AND from
 * the Cloudflare Worker. Output is identical at every breakpoint —
 * responsive layout is driven by the `.model-card` CSS in `app.css`.
 *
 * The shape of `ModelCardProps` mirrors the public `ModelDTO` returned by
 * `GET /api/models`, so callers can pipe an API response straight in.
 */

export type RiskLevel = "low" | "medium" | "high";

export interface ModelCardProps {
  name: string;
  description: string;
  category: string;
  riskLevel: RiskLevel;
  /** USD cents. 0 → renders as "Free". */
  price: number;
  /** 0..5 with one decimal. */
  rating: number;
  ratingCount: number;
  federated: boolean;
  /** Optional. Falls back to a tinted gradient card header. */
  thumbnailUrl?: string | null;
  href: string;
}

const escape = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  const dollars = cents / 100;
  return dollars >= 1000
    ? `$${Math.round(dollars).toLocaleString("en-US")}`
    : `$${dollars.toFixed(dollars % 1 === 0 ? 0 : 2)}`;
}

function formatRating(r: number): string {
  return r.toFixed(1);
}

function riskLabel(r: RiskLevel): string {
  return r === "low" ? "Low risk" : r === "medium" ? "Medium risk" : "High risk";
}

export function ModelCard(props: ModelCardProps): string {
  const {
    name,
    description,
    category,
    riskLevel,
    price,
    rating,
    ratingCount,
    federated,
    thumbnailUrl,
    href,
  } = props;

  const thumb = thumbnailUrl
    ? `<img class="model-card__thumb" src="${escape(thumbnailUrl)}" alt="" loading="lazy" width="320" height="160" />`
    : `<div class="model-card__thumb model-card__thumb--placeholder" aria-hidden="true"></div>`;

  const fedBadge = federated
    ? `<span class="model-card__badge model-card__badge--federated" title="Federated training">Federated</span>`
    : "";

  return [
    `<a class="model-card" href="${escape(href)}" data-slug="${escape(href.replace(/^\/models\/|\/$/g, ""))}">`,
    thumb,
    `<div class="model-card__body">`,
    `<div class="model-card__meta">`,
    `<span class="model-card__category">${escape(category)}</span>`,
    `<span class="model-card__badge model-card__badge--risk-${escape(riskLevel)}">${escape(riskLabel(riskLevel))}</span>`,
    fedBadge,
    `</div>`,
    `<h3 class="model-card__name">${escape(name)}</h3>`,
    `<p class="model-card__description">${escape(description)}</p>`,
    `<div class="model-card__footer">`,
    `<span class="model-card__price">${escape(formatPrice(price))}</span>`,
    `<span class="model-card__rating" aria-label="Rating ${formatRating(rating)} out of 5 from ${ratingCount} reviews">`,
    `<span aria-hidden="true">★</span> <span class="model-card__rating-value" data-rating>${formatRating(rating)}</span>`,
    ` <span class="model-card__rating-count" data-rating-count>(${ratingCount})</span>`,
    `</span>`,
    `</div>`,
    `</div>`,
    `</a>`,
  ].join("");
}
