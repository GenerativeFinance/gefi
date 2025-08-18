import type { Express } from "express";
import { z } from "zod";
import { db } from "../db";
import { aiModels, users, aiModelCategories } from "@shared/schema";
import { eq, or, ilike, desc, sql, and } from "drizzle-orm";
import rateLimit from 'express-rate-limit';

// Rate limiting for search endpoint
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 search requests per windowMs
  message: { error: 'Too many search requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search query schema
const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(50).default(20),
  category: z.string().optional(),
  type: z.enum(['model', 'strategy', 'report', 'user', 'bounty']).optional(),
});

interface SearchResult {
  id: string | number;
  name: string;
  description?: string;
  url: string;
  tags?: string[];
  category?: string;
  status?: string;
  rating?: number;
  updatedAt?: string;
  type: 'model' | 'strategy' | 'report' | 'user' | 'bounty';
}

export function registerSearchRoutes(app: Express) {
  
  // Main search endpoint
  app.get("/api/search", searchLimiter, async (req, res) => {
    try {
      const { q, limit, category, type } = searchQuerySchema.parse(req.query);
      
      const searchTerm = q.trim();
      if (!searchTerm) {
        return res.json({
          models: [],
          strategies: [],
          reports: [],
          users: [],
          bounties: [],
          total: 0
        });
      }

      // Parallel search execution for better performance
      const [models, users, strategies, reports, bounties] = await Promise.all([
        searchAIModels(searchTerm, limit, category),
        searchUsers(searchTerm, limit),
        searchStrategies(searchTerm, limit),
        searchReports(searchTerm, limit), 
        searchBounties(searchTerm, limit)
      ]);

      const totalResults = models.length + users.length + strategies.length + reports.length + bounties.length;

      // Filter by type if specified
      let responseData: any = {
        models,
        strategies,
        reports, 
        users,
        bounties,
        total: totalResults
      };

      if (type) {
        responseData = {
          models: type === 'model' ? models : [],
          strategies: type === 'strategy' ? strategies : [],
          reports: type === 'report' ? reports : [],
          users: type === 'user' ? users : [],
          bounties: type === 'bounty' ? bounties : [],
          total: type === 'model' ? models.length : 
                 type === 'strategy' ? strategies.length :
                 type === 'report' ? reports.length :
                 type === 'user' ? users.length :
                 type === 'bounty' ? bounties.length : 0
        };
      }

      res.json(responseData);

    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ 
        error: 'Invalid search parameters',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Search suggestions endpoint
  app.get("/api/search/suggestions", searchLimiter, async (req, res) => {
    try {
      const { q } = z.object({ q: z.string().min(1) }).parse(req.query);
      
      // Get popular search terms and model names for suggestions
      const modelSuggestions = await db
        .select({ name: aiModels.name })
        .from(aiModels)
        .where(
          and(
            ilike(aiModels.name, `${q}%`),
            eq(aiModels.visibility, 'public'),
            eq(aiModels.status, 'active')
          )
        )
        .limit(5)
        .orderBy(desc(aiModels.updatedAt));

      const categorySuggestions = await db
        .select({ name: aiModelCategories.name })
        .from(aiModelCategories)
        .where(ilike(aiModelCategories.name, `${q}%`))
        .limit(3);

      const suggestions = [
        ...modelSuggestions.map(s => ({ text: s.name, type: 'model' })),
        ...categorySuggestions.map(s => ({ text: s.name, type: 'category' }))
      ];

      res.json({ suggestions: suggestions.slice(0, 8) });

    } catch (error) {
      console.error('Search suggestions error:', error);
      res.status(400).json({ error: 'Invalid request' });
    }
  });
}

// Search AI Models
async function searchAIModels(searchTerm: string, limit: number, category?: string): Promise<SearchResult[]> {
  try {
    const whereConditions = [
      or(
        ilike(aiModels.name, `%${searchTerm}%`),
        ilike(aiModels.description, `%${searchTerm}%`),
        sql`${aiModels.tags}::text ILIKE ${'%' + searchTerm + '%'}`
      )
    ];

    if (category) {
      whereConditions.push(ilike(aiModels.category, `%${category}%`));
    }

    const results = await db
      .select({
        id: aiModels.id,
        name: aiModels.name,
        description: aiModels.description,
        category: aiModels.category,
        tags: aiModels.tags,
        updatedAt: aiModels.updatedAt
      })
      .from(aiModels)
      .where(and(...whereConditions))
      .limit(limit)
      .orderBy(desc(aiModels.updatedAt));

    return results.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description || '',
      url: `/ai-models/${model.id}`,
      tags: Array.isArray(model.tags) ? model.tags : [],
      category: model.category,
      updatedAt: model.updatedAt?.toISOString(),
      type: 'model' as const
    }));

  } catch (error) {
    console.error('Error searching AI models:', error);
    return [];
  }
}

// Search Users
async function searchUsers(searchTerm: string, limit: number): Promise<SearchResult[]> {
  try {
    const results = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        company: users.company,
        status: users.status,
        profileImageUrl: users.profileImageUrl,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(
        and(
          or(
            ilike(users.firstName, `%${searchTerm}%`),
            ilike(users.lastName, `%${searchTerm}%`),
            ilike(users.email, `%${searchTerm}%`),
            ilike(users.company, `%${searchTerm}%`)
          ),
          eq(users.status, 'active')
        )
      )
      .limit(limit)
      .orderBy(desc(users.updatedAt));

    return results.map(user => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
      description: user.company ? `${user.role} at ${user.company}` : user.role || '',
      url: `/user/${user.id}`,
      tags: user.role ? [user.role] : [],
      status: user.status || undefined,
      updatedAt: user.updatedAt?.toISOString(),
      type: 'user' as const
    }));

  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

// Search Trading Strategies (placeholder - implement based on your strategy schema)
async function searchStrategies(searchTerm: string, limit: number): Promise<SearchResult[]> {
  // TODO: Implement when strategy table is available
  // For now, return empty array or mock data
  return [];
}

// Search Reports (placeholder - implement based on your reports schema)  
async function searchReports(searchTerm: string, limit: number): Promise<SearchResult[]> {
  // TODO: Implement when reports table is available
  // For now, return empty array or mock data
  return [];
}

// Search Bounties (placeholder - implement based on your bounties schema)
async function searchBounties(searchTerm: string, limit: number): Promise<SearchResult[]> {
  // TODO: Implement when bounties table is available
  // For now, return empty array or mock data
  return [];
}