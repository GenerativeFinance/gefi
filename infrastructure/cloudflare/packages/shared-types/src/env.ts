/**
 * Worker bindings shared across the GeFi backend.
 *
 * Every Worker imports `Env` (or one of the focused sub-types) and types its
 * `fetch(req, env, ctx)` signature with it. Wrangler config in each Worker's
 * `wrangler.jsonc` is the source of truth for which bindings actually exist
 * per environment — keep this file in sync with those bindings.
 *
 * Bindings declared here are populated at deploy time via Wrangler's
 * `d1_databases`, `r2_buckets`, `kv_namespaces`, and `vectorize` blocks.
 * Local `wrangler dev` emulates them in-memory unless `--remote` is passed.
 */

/**
 * A canonical region identifier.
 *
 * Two regions today: `eu` (Frankfurt-ish data plane) and `us` (Iowa-ish).
 * Countries in MENA route to `eu` (closest), countries in APAC route to
 * `us` (closest west-coast PoP). When dedicated MENA / APAC / LATAM data
 * planes ship, expand this type and `pickRegion`'s lookup tables in step.
 */
export type Region = "eu" | "us";

/** The runtime environment a Worker has been deployed into. */
export type DeployEnv = "dev" | "staging" | "prod";

/**
 * The kind of legal entity a tenant signs up as. Different KYC paths and
 * compliance rules apply to each. Captured during onboarding (Task #3).
 */
export type EntityType =
  | "retail"          // Individual retail investor.
  | "professional"    // Sophisticated/accredited individual.
  | "institutional"   // Bank, asset manager, broker-dealer, etc.
  | "data_provider";  // Counterparty contributing data to the federation.

/**
 * KYC depth performed during onboarding. Mapped from subscription tier:
 * see `subscriptionToKycTier()` in `@gefi/auth`.
 */
export type KycTier = "none" | "basic" | "standard" | "enhanced";

/** Subscription pricing tiers. Source of truth for what a tenant has paid for. */
export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";

/**
 * Personas in the GeFi RBAC model. A user's `roles` claim is a non-empty
 * subset of these. Real permissions are computed from the union of their
 * roles via the permission matrix in `@gefi/auth`.
 */
export type Persona =
  | "admin"
  | "developer"
  | "investor"
  | "data_provider"
  | "regulator"
  | "auditor"
  | "compliance_officer";

/** Common variables every Worker reads. */
export interface CommonVars {
  /** Which deploy slot is this — used in logs and observability tagging. */
  ENVIRONMENT: DeployEnv;
  /** Region this specific Worker instance is bound to. */
  WORKER_REGION: Region;
  /** Public-facing root URL for the API surface (e.g. https://api.gefi.io). */
  API_PUBLIC_URL: string;
  /** Public-facing site URL for CORS allow-list (e.g. https://gefi.io). */
  SITE_PUBLIC_URL: string;
}

/**
 * Auth0 configuration used to validate user JWTs. Unlike `INTERNAL_SIGNING_KEY`
 * (HS256, edge↔region only) these are RS256 + JWKS, used for *user* auth.
 *
 * `AUTH0_DOMAIN` is the tenant URL, e.g. `https://gefi.eu.auth0.com/` —
 * MUST end with a slash (Auth0 sets `iss` to that exact value).
 * `AUTH0_AUDIENCE` is the API identifier configured in the Auth0 dashboard,
 * usually `https://api.gefi.io`. Both are vars (not secrets) — they're
 * public.
 */
export interface Auth0Vars {
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
}

/** Common secrets every Worker may need. Set via `wrangler secret put`. */
export interface CommonSecrets {
  /**
   * Symmetric key for signing the internal short-lived JWTs the public router
   * mints when forwarding to a regional `gefi-api`. Different per environment.
   */
  INTERNAL_SIGNING_KEY: string;
}

/**
 * Optional Auth0 management-API credentials, only needed by background jobs
 * that update user metadata (e.g. write-back of KYC tier after onboarding).
 * Not required for token verification.
 */
export interface Auth0M2MSecrets {
  AUTH0_M2M_CLIENT_ID?: string;
  AUTH0_M2M_CLIENT_SECRET?: string;
}

/**
 * Per-provider KYC + sanctions API keys. All optional — when missing, the
 * respective provider falls back to the deterministic stub implementation
 * from `@gefi/integrations` (intended for dev / local tests, never prod).
 */
export interface IntegrationSecrets {
  ONFIDO_API_TOKEN?: string;
  PERSONA_API_KEY?: string;
  SUMSUB_APP_TOKEN?: string;
  SUMSUB_SECRET_KEY?: string;
  MIDDESK_API_KEY?: string;
  OPENSANCTIONS_API_KEY?: string;
}

/** Bindings exposed to `gefi-api`. */
export interface ApiEnv
  extends CommonVars,
    CommonSecrets,
    Auth0Vars,
    Auth0M2MSecrets,
    IntegrationSecrets {
  /** Primary OLTP store for tenant + user + subscription rows. */
  DB: D1Database;
  /** Object store for uploaded artifacts (filings, model weights, etc.). */
  ARTIFACTS: R2Bucket;
  /** Hot cache + rate-limit counters. */
  CACHE: KVNamespace;
  /** Vector index for similarity search across the model + research catalogue. */
  VECTORS: VectorizeIndex;
  /** Internal Service binding to the compliance Worker (RPC over fetch). */
  COMPLIANCE: Fetcher;
  /**
   * Service binding to the EU regional sibling (`gefi-api-eu`). Only
   * present on the public edge deployment (`api.gefi.io`). When the edge
   * picks `region === "eu"` and this binding exists, the request is
   * forwarded over the binding (signed with an internal JWT) instead of
   * being handled locally.
   */
  REGIONAL_EU?: Fetcher;
  /** Service binding to the US regional sibling (`gefi-api-us`). */
  REGIONAL_US?: Fetcher;
}

/** Bindings exposed to `gefi-compliance`. */
export interface ComplianceEnv extends CommonVars, CommonSecrets {
  /** Append-only audit log table on D1. */
  DB: D1Database;
  /** Object store for compliance evidence packs. */
  EVIDENCE: R2Bucket;
  /** Cache of jurisdiction rules + per-tenant routing decisions. */
  CACHE: KVNamespace;
}

/** Bindings exposed to `gefi-web`. */
export interface WebEnv extends CommonVars {
  /**
   * Pages-asset binding (only set when this Worker is in front of a Pages
   * project). Optional so the Worker can also run as a pure header-injecting
   * proxy in front of GitHub Pages during the apex-domain transition.
   */
  ASSETS?: Fetcher;
}
