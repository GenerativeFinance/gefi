/**
 * Auth0 Management API client (M2M).
 *
 * Used after `/v1/auth/onboard` to write the GeFi custom claims onto
 * the Auth0 user's `app_metadata`. The post-login Action documented
 * in `AUTH0-SETUP.md` reads `app_metadata.gefi` on every login and
 * copies the values into the namespaced ID/access-token claims that
 * `verifyAuth0Token` expects (`https://gefi.io/tenant_id`,
 * `…/jurisdiction`, etc).
 *
 * Why this matters: a freshly signed-up Auth0 user has no
 * `app_metadata.gefi` yet, so their first JWT carries no GeFi claims
 * and the strict `requireAuth` middleware refuses every protected
 * call (`auth_onboarding_incomplete`). After the user picks
 * jurisdiction + entity type and we create their tenant in D1, we
 * write `app_metadata.gefi` here and tell the frontend to refresh
 * its token — the next access token has the claims and protected
 * routes (e.g. `/v1/kyc/start`) start working.
 *
 * The Management API M2M token is cached in KV (`CACHE`) at the
 * key `auth0:m2m:{client_id}` for half its `expires_in` window so
 * we don't pay the round-trip on every onboard.
 */

const TOKEN_PATH = "oauth/token";
const USERS_PATH = "api/v2/users";

/** GeFi-namespaced claim payload we mirror onto `app_metadata.gefi`. */
export interface GefiAppMetadata {
  tenant_id: string;
  jurisdiction: "eu" | "us";
  entity_type: "retail" | "professional" | "institutional" | "data_provider";
  subscription_tier: "free" | "starter" | "pro" | "enterprise";
  kyc_tier: "none" | "basic" | "standard" | "enhanced";
  roles: readonly string[];
}

export class Auth0Management {
  /**
   * @param domain         Auth0 tenant domain, e.g. `https://gefi.eu.auth0.com/`.
   *                       MUST end with a slash — Auth0 uses that exact value
   *                       as the `iss` claim and audience prefix.
   * @param clientId       M2M application client_id.
   * @param clientSecret   M2M application client_secret.
   * @param cache          Optional KV namespace for caching the M2M access
   *                       token. Strongly recommended in production; the
   *                       Management API throttles M2M token requests.
   * @param fetchImpl      Injected for tests; defaults to global `fetch`.
   */
  constructor(
    private readonly domain: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly cache: KVNamespace | null = null,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** Audience for the Management API on this tenant. */
  private get audience(): string {
    return `${this.domain}api/v2/`;
  }

  /** KV cache key for the cached M2M access token. */
  private get cacheKey(): string {
    return `auth0:m2m:${this.clientId}`;
  }

  /** Fetch (or recall from cache) a Management API access token. */
  async getManagementToken(): Promise<string> {
    if (this.cache) {
      const cached = await this.cache.get(this.cacheKey);
      if (cached) return cached;
    }
    const res = await this.fetchImpl(`${this.domain}${TOKEN_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
      }),
    });
    if (!res.ok) {
      throw new Error(`auth0_m2m_token_failed status=${res.status}`);
    }
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) throw new Error("auth0_m2m_token_missing");
    if (this.cache) {
      // Cache for half the lifetime so we never serve a token within
      // the last 50% of its window — gives us slack for clock skew
      // and the PATCH round-trip.
      const ttl = Math.max(60, Math.floor((data.expires_in ?? 86400) / 2));
      await this.cache.put(this.cacheKey, data.access_token, { expirationTtl: ttl });
    }
    return data.access_token;
  }

  /**
   * PATCH `app_metadata.gefi` on the given Auth0 user. Throws on a
   * non-2xx response so the caller can decide whether to surface a
   * client-facing error or log + continue (the onboard handler logs
   * + continues; the user can still pick the claims up via the
   * post-login Action on next login).
   */
  async updateAppMetadata(authUserId: string, gefi: GefiAppMetadata): Promise<void> {
    const token = await this.getManagementToken();
    const res = await this.fetchImpl(`${this.domain}${USERS_PATH}/${encodeURIComponent(authUserId)}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ app_metadata: { gefi } }),
    });
    if (!res.ok) {
      throw new Error(`auth0_m2m_update_failed status=${res.status}`);
    }
  }
}
