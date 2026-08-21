/**
 * Marketplace search abstraction.
 *
 * Two implementations:
 *   - `LocalIndex` — in-process inverted index. Used in dev/tests and for
 *     workers running without an external search host. Faceted filters
 *     are applied first, then a tokenised match against name/summary.
 *
 *   - `TypesenseIndex` — REST wrapper for production. Same `Index`
 *     surface, so handlers swap implementations without branching.
 *
 * Documents are the cards we render on the marketplace browse page.
 */

import type { Region, SearchSecrets } from "@gefi/shared-types";

export interface SearchDoc {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  riskClass: "low" | "medium" | "high";
  jurisdiction: Region;
  jurisdictionsSupported: Region[];
  monthlyPriceCents: number;
  metrics: {
    total_return?: number;
    sharpe?: number;
    max_dd?: number;
    win_rate?: number;
    sortino?: number;
  };
  federationEnabled: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  riskClass?: "low" | "medium" | "high";
  jurisdiction?: Region;
  minPrice?: number;
  maxPrice?: number;
  minSharpe?: number;
  federationEnabled?: boolean;
  /** Filters out docs whose `jurisdictionsSupported` excludes this region. */
  visibleTo?: Region;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  hits: SearchDoc[];
  total: number;
  facets: Record<string, Record<string, number>>;
}

export interface Index {
  upsert(doc: SearchDoc): Promise<void>;
  bulkUpsert(docs: SearchDoc[]): Promise<void>;
  remove(id: string): Promise<void>;
  search(filters: SearchFilters): Promise<SearchResult>;
  readonly live: boolean;
}

function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export class LocalIndex implements Index {
  readonly live = false;
  private readonly docs = new Map<string, SearchDoc>();

  async upsert(doc: SearchDoc): Promise<void> {
    this.docs.set(doc.id, doc);
  }

  async bulkUpsert(docs: SearchDoc[]): Promise<void> {
    for (const d of docs) this.docs.set(d.id, d);
  }

  async remove(id: string): Promise<void> {
    this.docs.delete(id);
  }

  async search(filters: SearchFilters): Promise<SearchResult> {
    const queryTokens = filters.query ? tokenise(filters.query) : [];
    const docs: Array<{ doc: SearchDoc; score: number }> = [];
    for (const doc of this.docs.values()) {
      if (filters.category && doc.category !== filters.category) continue;
      if (filters.riskClass && doc.riskClass !== filters.riskClass) continue;
      if (filters.jurisdiction && doc.jurisdiction !== filters.jurisdiction) continue;
      if (filters.federationEnabled !== undefined && doc.federationEnabled !== filters.federationEnabled) continue;
      if (filters.minPrice !== undefined && doc.monthlyPriceCents < filters.minPrice) continue;
      if (filters.maxPrice !== undefined && doc.monthlyPriceCents > filters.maxPrice) continue;
      if (filters.minSharpe !== undefined && (doc.metrics.sharpe ?? -Infinity) < filters.minSharpe) continue;
      if (filters.visibleTo) {
        const list = doc.jurisdictionsSupported ?? [];
        if (list.length > 0 && !list.includes(filters.visibleTo)) continue;
      }
      let score = 1;
      if (queryTokens.length > 0) {
        const haystack = tokenise(`${doc.name} ${doc.summary}`);
        score = 0;
        for (const q of queryTokens) {
          for (const h of haystack) {
            if (h === q) score += 2;
            else if (h.startsWith(q)) score += 1;
          }
        }
        if (score === 0) continue;
      }
      docs.push({ doc, score });
    }
    docs.sort((a, b) => b.score - a.score || b.doc.monthlyPriceCents - a.doc.monthlyPriceCents);
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 24;
    const hits = docs.slice(offset, offset + limit).map((d) => d.doc);

    const cat: Record<string, number> = {};
    const risk: Record<string, number> = {};
    const jur: Record<string, number> = {};
    for (const d of docs) {
      cat[d.doc.category] = (cat[d.doc.category] ?? 0) + 1;
      risk[d.doc.riskClass] = (risk[d.doc.riskClass] ?? 0) + 1;
      jur[d.doc.jurisdiction] = (jur[d.doc.jurisdiction] ?? 0) + 1;
    }
    const facets: SearchResult["facets"] = { category: cat, riskClass: risk, jurisdiction: jur };

    return { hits, total: docs.length, facets };
  }
}

export class TypesenseIndex implements Index {
  readonly live = true;
  private readonly host: string;
  private readonly apiKey: string;
  private readonly collection: string;

  constructor(secrets: Required<Pick<SearchSecrets, "TYPESENSE_HOST" | "TYPESENSE_API_KEY" | "TYPESENSE_COLLECTION">>) {
    this.host = secrets.TYPESENSE_HOST.replace(/\/$/, "");
    this.apiKey = secrets.TYPESENSE_API_KEY;
    this.collection = secrets.TYPESENSE_COLLECTION;
  }

  private headers(): Record<string, string> {
    return {
      "X-TYPESENSE-API-KEY": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  async upsert(doc: SearchDoc): Promise<void> {
    const res = await fetch(`${this.host}/collections/${this.collection}/documents?action=upsert`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error(`typesense_upsert_${res.status}`);
  }

  async bulkUpsert(docs: SearchDoc[]): Promise<void> {
    const body = docs.map((d) => JSON.stringify(d)).join("\n");
    const res = await fetch(
      `${this.host}/collections/${this.collection}/documents/import?action=upsert`,
      { method: "POST", headers: { ...this.headers(), "Content-Type": "text/plain" }, body },
    );
    if (!res.ok) throw new Error(`typesense_bulk_${res.status}`);
  }

  async remove(id: string): Promise<void> {
    const res = await fetch(`${this.host}/collections/${this.collection}/documents/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.headers(),
    });
    if (!res.ok && res.status !== 404) throw new Error(`typesense_remove_${res.status}`);
  }

  async search(filters: SearchFilters): Promise<SearchResult> {
    const params = new URLSearchParams();
    params.set("q", filters.query ?? "*");
    params.set("query_by", "name,summary");
    const filterParts: string[] = [];
    if (filters.category) filterParts.push(`category:=${filters.category}`);
    if (filters.riskClass) filterParts.push(`riskClass:=${filters.riskClass}`);
    if (filters.jurisdiction) filterParts.push(`jurisdiction:=${filters.jurisdiction}`);
    if (filters.federationEnabled !== undefined)
      filterParts.push(`federationEnabled:=${filters.federationEnabled}`);
    if (filters.minPrice !== undefined) filterParts.push(`monthlyPriceCents:>=${filters.minPrice}`);
    if (filters.maxPrice !== undefined) filterParts.push(`monthlyPriceCents:<=${filters.maxPrice}`);
    if (filters.visibleTo) filterParts.push(`jurisdictionsSupported:=[${filters.visibleTo}]`);
    if (filterParts.length > 0) params.set("filter_by", filterParts.join(" && "));
    if (filters.limit) params.set("per_page", String(filters.limit));
    if (filters.offset) params.set("page", String(Math.floor(filters.offset / (filters.limit ?? 24)) + 1));
    params.set("facet_by", "category,riskClass,jurisdiction");
    const res = await fetch(`${this.host}/collections/${this.collection}/documents/search?${params}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`typesense_search_${res.status}`);
    const out = (await res.json()) as {
      hits?: Array<{ document: SearchDoc }>;
      found?: number;
      facet_counts?: Array<{ field_name: string; counts: Array<{ value: string; count: number }> }>;
    };
    const facets: Record<string, Record<string, number>> = {};
    for (const f of out.facet_counts ?? []) {
      facets[f.field_name] = Object.fromEntries(f.counts.map((c) => [c.value, c.count]));
    }
    return {
      hits: (out.hits ?? []).map((h) => h.document),
      total: out.found ?? 0,
      facets,
    };
  }
}

export function resolveIndex(secrets: SearchSecrets): Index {
  if (secrets.TYPESENSE_HOST && secrets.TYPESENSE_API_KEY && secrets.TYPESENSE_COLLECTION) {
    return new TypesenseIndex({
      TYPESENSE_HOST: secrets.TYPESENSE_HOST,
      TYPESENSE_API_KEY: secrets.TYPESENSE_API_KEY,
      TYPESENSE_COLLECTION: secrets.TYPESENSE_COLLECTION,
    });
  }
  return new LocalIndex();
}
