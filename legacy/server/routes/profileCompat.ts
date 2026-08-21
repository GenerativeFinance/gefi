import express, { Request, Response } from "express";

/**
 * Compatibility routes for profile lookups.
 *
 * This router exposes:
 *  - GET /api/user-profile/:type/:id
 *  - GET /api/users/:id/profile
 *
 * It will try multiple lookup strategies in order to find a user:
 *  1) Exact id lookup (storage.getUserById or storage.findUser)
 *  2) Provider-prefixed id (e.g. `${provider}_${rawId}`)
 *  3) Provider + raw id lookup (storage.getUserByProviderId)
 *  4) Email lookup (if id looks like an email)
 *  5) Generic fallback search (storage.findUser / storage.searchUsers / storage.queryUsers)
 *
 * The function accepts a `storage` object so it can be registered against your existing storage layer.
 *
 * It is intentionally defensive: it checks whether storage exposes helper methods and falls back
 * to what is available to avoid throwing if a method is absent.
 */

type StorageLike = {
  getUserById?: (id: string) => Promise<any | null>;
  getUserByProviderId?: (provider: string, rawId: string) => Promise<any | null>;
  getUserByEmail?: (email: string) => Promise<any | null>;
  findUser?: (query: any) => Promise<any | null>;
};

function looksLikeEmail(s: string) {
  return typeof s === "string" && /\S+@\S+\.\S+/.test(s);
}

export default function registerProfileCompatibilityRoutes(app: express.Express, storage: StorageLike) {
  const router = express.Router();

  async function tryLookup(providerOrType: string | null, idOrRaw: string): Promise<any | null> {
    // 1) Exact ID
    if (storage.getUserById) {
      try {
        const u = await storage.getUserById(idOrRaw);
        if (u) return u;
      } catch (e) {
        console.warn("getUserById failed:", e);
      }
    }

    // 2) If provider provided, try provider_prefixed id
    if (providerOrType) {
      const providerPrefixedId = `${providerOrType}_${idOrRaw}`;
      if (storage.getUserById) {
        try {
          const u = await storage.getUserById(providerPrefixedId);
          if (u) return u;
        } catch (e) {
          console.warn("getUserById(providerPrefixed) failed:", e);
        }
      }
    }

    // 3) Try provider-specific lookup if available (getUserByProviderId)
    if (providerOrType && storage.getUserByProviderId) {
      try {
        const u = await storage.getUserByProviderId(providerOrType, idOrRaw);
        if (u) return u;
      } catch (e) {
        console.warn("getUserByProviderId failed:", e);
      }
    }

    // 4) If id looks like an email, try email lookup
    if (looksLikeEmail(idOrRaw) && storage.getUserByEmail) {
      try {
        const u = await storage.getUserByEmail(idOrRaw);
        if (u) return u;
      } catch (e) {
        console.warn("getUserByEmail failed:", e);
      }
    }

    // 5) Generic findUser fallback (accepts arbitrary query)
    if (storage.findUser) {
      const tries = [
        { id: idOrRaw },
        providerOrType ? { id: `${providerOrType}_${idOrRaw}` } : null,
        providerOrType ? { provider: providerOrType, providerId: idOrRaw } : null,
        looksLikeEmail(idOrRaw) ? { email: idOrRaw } : null,
      ].filter(Boolean) as any[];

      for (const q of tries) {
        try {
          const u = await storage.findUser(q);
          if (u) return u;
        } catch (e) {
          console.warn("findUser failed for query", q, e);
        }
      }
    }

    // nothing found
    return null;
  }

  // Primary canonical route already used by the client
  router.get("/api/user-profile/:type/:id", async (req: Request, res: Response) => {
    const { type, id } = req.params;
    try {
      const user = await tryLookup(type, id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } catch (err) {
      console.error("Error in /api/user-profile lookup:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compatibility route used by older clients/links
  router.get("/api/users/:id/profile", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Try raw id first, then attempt to parse provider prefix if present
      let provider: string | null = null;
      let rawId = id;

      // If id contains an underscore and looks like provider_prefix, split it
      const underscoreIndex = id.indexOf("_");
      if (underscoreIndex > 0) {
        const possibleProvider = id.substring(0, underscoreIndex);
        const possibleRaw = id.substring(underscoreIndex + 1);
        provider = possibleProvider;
        rawId = possibleRaw;
      }

      // 1) try exact id first (including cases where db stores full id)
      let user = await tryLookup(null, id);
      if (!user && provider) {
        // If not found yet, try provider + rawId strategy
        user = await tryLookup(provider, rawId);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (err) {
      console.error("Error in /api/users/:id/profile lookup:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.use(router);
}