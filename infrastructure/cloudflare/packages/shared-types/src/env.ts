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
 * Per-provider KYC + sanctions API keys. All optional — when missing in
 * dev/staging the respective provider falls back to the deterministic
 * stub from `@gefi/integrations`. In production the factory throws
 * rather than falling back, so a misconfigured prod fails closed.
 *
 * `*_WEBHOOK_SECRET` is the per-provider webhook-signing secret used
 * by `parseWebhook` to verify the `X-SHA2-Signature` / `X-Payload-Digest`
 * headers each provider sends.
 */
export interface IntegrationSecrets {
  ONFIDO_API_TOKEN?: string;
  ONFIDO_WEBHOOK_SECRET?: string;
  PERSONA_API_KEY?: string;
  PERSONA_WEBHOOK_SECRET?: string;
  SUMSUB_APP_TOKEN?: string;
  SUMSUB_SECRET_KEY?: string;
  SUMSUB_WEBHOOK_SECRET?: string;
  MIDDESK_API_KEY?: string;
  OPENSANCTIONS_API_KEY?: string;
}

/**
 * Stripe credentials. All optional — when missing the billing service
 * falls back to a deterministic stub that records subscriptions in D1
 * but never makes a network call. In production the resolver throws.
 */
export interface StripeSecrets {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_CONNECT_CLIENT_ID?: string;
  STRIPE_TAX_ENABLED?: string;
  /** Public-facing return URL after a Stripe Checkout / Connect flow. */
  STRIPE_RETURN_URL?: string;
}

/**
 * Resend (transactional email) credentials used for dunning + receipt
 * emails. Optional in dev — without them the mailer logs to D1.
 */
export interface ResendSecrets {
  RESEND_API_KEY?: string;
  RESEND_FROM_ADDRESS?: string;
}

/**
 * AI provider credentials used by the model gateway when Workers AI
 * is unavailable or unsuitable. EU-jurisdiction tenants hit EU
 * endpoints only — see `model-gateway/providers.ts`.
 */
export interface AiProviderSecrets {
  OPENAI_API_KEY_US?: string;
  OPENAI_API_KEY_EU?: string;
  ANTHROPIC_API_KEY_US?: string;
  ANTHROPIC_API_KEY_EU?: string;
  TOGETHER_API_KEY?: string;
}

/**
 * Typesense / Meilisearch credentials. Optional — the LocalIndex stub
 * (in-process inverted index) is used in dev/test when no host is set.
 */
export interface SearchSecrets {
  TYPESENSE_HOST?: string;
  TYPESENSE_API_KEY?: string;
  TYPESENSE_COLLECTION?: string;
}

/** Bindings exposed to `gefi-api`. */
export interface ApiEnv
  extends CommonVars,
    CommonSecrets,
    Auth0Vars,
    Auth0M2MSecrets,
    IntegrationSecrets,
    ComplianceInternalSecrets,
    StripeSecrets,
    ResendSecrets,
    AiProviderSecrets,
    SearchSecrets {
  /** Primary OLTP store for tenant + user + subscription rows. */
  DB: D1Database;
  /** Object store for uploaded artifacts (filings, model weights, etc.). */
  ARTIFACTS: R2Bucket;
  /** Hot cache + rate-limit counters. */
  CACHE: KVNamespace;
  /** Vector index for similarity search across the model + research catalogue. */
  VECTORS: VectorizeIndex;
  /**
   * Workers AI binding — preferred provider for the model gateway.
   * Optional so dev/test environments without a Workers-AI binding
   * fall back to the stubbed provider chain.
   */
  AI?: { run: (model: string, input: unknown) => Promise<unknown> };
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

/**
 * Vocabulary of platform events the compliance engine cares about. Extending
 * this type without also adding a matching rule in `@gefi/compliance-rules`
 * is fine — it just means no rule fires on the new event yet.
 */
export type ComplianceEventKind =
  | "tenant_onboarded"
  | "kyc_declined"
  | "sanction_hit"
  | "model_listed"
  | "subscription_created"
  | "data_breach"
  | "dsar_received"
  | "drift_exceeded"
  | "subpoena_received"
  | "cross_border";

/** Severity used by compliance events + audit entries. */
export type ComplianceSeverity = "info" | "warn" | "high" | "critical";

/**
 * MailChannels DKIM credentials used to sign outbound lawyer-routing emails.
 * Optional in dev/staging — without them the mailer falls back to a stub
 * that records messages to D1 but never makes a network call.
 */
export interface MailChannelsSecrets {
  MAILCHANNELS_DKIM_DOMAIN?: string;
  MAILCHANNELS_DKIM_SELECTOR?: string;
  MAILCHANNELS_DKIM_PRIVATE_KEY?: string;
  /** From-address every routing email is sent from (e.g. `compliance@gefi.io`). */
  MAILCHANNELS_FROM_ADDRESS?: string;
}

/**
 * Polygon (PoS) anchoring credentials for daily Merkle root commits. Optional
 * in dev/staging — without them the anchor service marks the day's root with
 * a synthetic `pending_anchor` reference and the on-chain transaction hash is
 * filled in once a real key is provisioned.
 */
export interface AnchorSecrets {
  POLYGON_RPC_URL?: string;
  POLYGON_ANCHOR_ADDRESS?: string;
  POLYGON_ANCHOR_PRIVATE_KEY?: string;
}

/**
 * DocuSign credentials used to obtain lawyer/auditor sign-off on
 * compliance cases. Optional in dev/staging — stub returns a synthetic
 * envelope id that the routing service treats as already signed.
 */
export interface DocuSignSecrets {
  DOCUSIGN_BASE_URL?: string;
  DOCUSIGN_INTEGRATION_KEY?: string;
  DOCUSIGN_USER_ID?: string;
  DOCUSIGN_RSA_PRIVATE_KEY?: string;
  DOCUSIGN_ACCOUNT_ID?: string;
}

/**
 * Shared secret minted by the compliance Worker and verified on every
 * Service-binding call from `gefi-api`. Prevents an accidental external
 * route on `gefi-compliance` from leaking a privileged endpoint.
 */
export interface ComplianceInternalSecrets {
  COMPLIANCE_INTERNAL_TOKEN?: string;
}

/** Bindings exposed to `gefi-compliance`. */
export interface ComplianceEnv
  extends CommonVars,
    CommonSecrets,
    MailChannelsSecrets,
    AnchorSecrets,
    DocuSignSecrets,
    ComplianceInternalSecrets {
  /** Append-only audit log + cases + directory tables on D1. */
  DB: D1Database;
  /** Object store for compliance evidence packs + signed envelopes. */
  EVIDENCE: R2Bucket;
  /** Cache of jurisdiction rules + per-tenant routing decisions. */
  CACHE: KVNamespace;
  /**
   * Durable Object namespace owning per-case state + SLA `alarm()` timers.
   * One DO instance per ComplianceCase (id = case_id).
   */
  CASE_DO: DurableObjectNamespace;
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
