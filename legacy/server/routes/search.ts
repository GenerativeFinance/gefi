import express from "express";
import { searchIndex, INDEXES, checkSearchHealth } from "../services/search";

const router = express.Router();

/**
 * GET /api/search?q=...&types=models,strategies&limit=10&offset=0
 * Global search across multiple resource types
 */
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const types = String(req.query.types || "models,strategies,reports,users,funding,bounties")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const limit = Math.min(parseInt(String(req.query.limit || "6"), 10), 20);
    const offset = Math.max(parseInt(String(req.query.offset || "0"), 10), 0);

    if (!q || q.length === 0) {
      return res.json({ q, results: {}, total: 0 });
    }

    // Validate requested types
    const validTypes = types.filter(type => Object.values(INDEXES).includes(type as any));
    
    if (validTypes.length === 0) {
      return res.status(400).json({ error: "No valid search types specified" });
    }

    // Parallel searches across requested indexes
    const promises = validTypes.map(async (type) => {
      try {
        const searchOpts: any = { 
          limit,
          offset,
          attributesToHighlight: ['*'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>'
        };

        // Add type-specific filters
        const user = (req as any).user;
        if (user) {
          if (type === INDEXES.MODELS || type === INDEXES.STRATEGIES) {
            // Filter by visibility for authenticated users
            searchOpts.filter = `visibility = public OR ownerId = ${user.id}`;
          } else if (type === INDEXES.REPORTS || type === INDEXES.FUNDING || type === INDEXES.BOUNTIES) {
            // Only show own reports/funding/bounties
            searchOpts.filter = `ownerId = ${user.id}`;
          }
        } else {
          // Public access - only show public resources
          if (type === INDEXES.MODELS || type === INDEXES.STRATEGIES) {
            searchOpts.filter = 'visibility = public';
          } else {
            // Skip private resources for unauthenticated users
            return { type, hits: [], nbHits: 0, processingTimeMs: 0 };
          }
        }

        const result = await searchIndex(type, q, searchOpts);
        return { 
          type, 
          hits: result.hits, 
          nbHits: result.nbHits, 
          processingTimeMs: result.processingTimeMs 
        };
      } catch (error) {
        console.error(`Search error for type ${type}:`, error);
        return { type, hits: [], nbHits: 0, processingTimeMs: 0, error: String(error) };
      }
    });

    const results = await Promise.all(promises);
    const grouped: Record<string, any> = {};
    let totalResults = 0;

    results.forEach((r) => {
      grouped[r.type] = r;
      totalResults += r.nbHits || 0;
    });

    res.json({ 
      q, 
      results: grouped, 
      total: totalResults,
      limit,
      offset 
    });
  } catch (err) {
    console.error("GET /api/search error:", err);
    res.status(500).json({ error: "Search service unavailable" });
  }
});

/**
 * GET /api/search/autocomplete?q=...&type=models&limit=6
 * Fast autocomplete for specific resource type
 */
router.get("/autocomplete", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const type = String(req.query.type || "models");
    const limit = Math.min(parseInt(String(req.query.limit || "6"), 10), 10);

    if (!q || q.length < 2) {
      return res.json({ q, suggestions: [] });
    }

    if (!Object.values(INDEXES).includes(type as any)) {
      return res.status(400).json({ error: "Invalid search type" });
    }

    const searchOpts: any = { 
      limit,
      attributesToRetrieve: ['id', 'name', 'title', 'firstName', 'lastName'],
      attributesToHighlight: ['name', 'title', 'firstName', 'lastName'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    };

    // Apply same access control as main search
    const user = (req as any).user;
    if (user) {
      if (type === INDEXES.MODELS || type === INDEXES.STRATEGIES) {
        searchOpts.filter = `visibility = public OR ownerId = ${user.id}`;
      } else if (type === INDEXES.REPORTS || type === INDEXES.FUNDING || type === INDEXES.BOUNTIES) {
        searchOpts.filter = `ownerId = ${user.id}`;
      }
    } else {
      if (type === INDEXES.MODELS || type === INDEXES.STRATEGIES) {
        searchOpts.filter = 'visibility = public';
      } else {
        return res.json({ q, suggestions: [] });
      }
    }

    const result = await searchIndex(type, q, searchOpts);
    
    const suggestions = result.hits.map((hit: any) => ({
      id: hit.id,
      text: hit.name || hit.title || `${hit.firstName || ''} ${hit.lastName || ''}`.trim(),
      highlighted: hit._formatted?.name || hit._formatted?.title || 
        `${hit._formatted?.firstName || ''} ${hit._formatted?.lastName || ''}`.trim(),
      type
    }));

    res.json({ q, suggestions, type });
  } catch (err) {
    console.error("GET /api/search/autocomplete error:", err);
    res.status(500).json({ error: "Autocomplete service unavailable" });
  }
});

/**
 * Resource-specific search endpoints
 */
router.get("/models", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(parseInt(String(req.query.limit || "10"), 10), 50);
    const offset = Math.max(parseInt(String(req.query.offset || "0"), 10), 0);
    const category = req.query.category as string;
    const tags = req.query.tags as string;

    const searchOpts: any = { 
      limit, 
      offset,
      attributesToHighlight: ['name', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    };

    // Build filters
    const filters = [];
    const user = (req as any).user;
    
    if (user) {
      filters.push(`visibility = public OR ownerId = ${user.id}`);
    } else {
      filters.push('visibility = public');
    }

    if (category) {
      filters.push(`category = "${category}"`);
    }

    if (tags) {
      const tagList = tags.split(',').map(t => `tags = "${t.trim()}"`);
      filters.push(`(${tagList.join(' OR ')})`);
    }

    if (filters.length > 0) {
      searchOpts.filter = filters.join(' AND ');
    }

    if (!q) {
      // No search query - return all with filters
      searchOpts.q = '*';
    }

    const result = await searchIndex(INDEXES.MODELS, q || '*', searchOpts);
    res.json(result);
  } catch (err) {
    console.error("GET /api/search/models error:", err);
    res.status(500).json({ error: "Models search unavailable" });
  }
});

router.get("/strategies", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(parseInt(String(req.query.limit || "10"), 10), 50);
    const offset = Math.max(parseInt(String(req.query.offset || "0"), 10), 0);

    const searchOpts: any = { 
      limit, 
      offset,
      attributesToHighlight: ['name', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    };

    const user = (req as any).user;
    if (user) {
      searchOpts.filter = `visibility = public OR ownerId = ${user.id}`;
    } else {
      searchOpts.filter = 'visibility = public';
    }

    const result = await searchIndex(INDEXES.STRATEGIES, q || '*', searchOpts);
    res.json(result);
  } catch (err) {
    console.error("GET /api/search/strategies error:", err);
    res.status(500).json({ error: "Strategies search unavailable" });
  }
});

/**
 * GET /api/search/health
 * Check search service health
 */
router.get("/health", async (req, res) => {
  try {
    const health = await checkSearchHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({ status: 'error', error: String(err) });
  }
});

export default router;