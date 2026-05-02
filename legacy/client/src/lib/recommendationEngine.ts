// Recommendation Engine for AI Financial Models
// Uses local storage to track viewed models and generate recommendations

export interface ViewedModel {
  id: number;
  name: string;
  category: string;
  tags: string[];
  price: number;
  viewedAt: number;
  timeSpent: number;
}

export interface RecommendedModel {
  id: number;
  name: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  reason: string;
  similarity: number;
}

export class RecommendationEngine {
  private static STORAGE_KEY = 'viewed_models';
  private static MAX_VIEWED_MODELS = 50;
  private static MIN_TIME_SPENT = 5000; // 5 seconds minimum view time

  // Track a model view
  static trackModelView(modelId: number, name: string, category: string, tags: string[] = [], price: number = 0, timeSpent: number = 0) {
    const viewedModels = this.getViewedModels();
    
    // Remove existing view of same model
    const filteredModels = viewedModels.filter(m => m.id !== modelId);
    
    // Add new view if time spent is sufficient
    if (timeSpent >= this.MIN_TIME_SPENT) {
      const newView: ViewedModel = {
        id: modelId,
        name,
        category,
        tags,
        price,
        viewedAt: Date.now(),
        timeSpent
      };
      
      filteredModels.unshift(newView);
      
      // Keep only recent views
      const recentViews = filteredModels.slice(0, this.MAX_VIEWED_MODELS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentViews));
    }
  }

  // Get viewed models from localStorage
  static getViewedModels(): ViewedModel[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Generate recommendations based on viewing history
  static generateRecommendations(allModels: any[], limit: number = 5): RecommendedModel[] {
    const viewedModels = this.getViewedModels();
    
    if (viewedModels.length === 0) {
      // Return popular/featured models if no history
      return this.getFallbackRecommendations(allModels, limit);
    }

    const recommendations: RecommendedModel[] = [];
    const viewedModelIds = new Set(viewedModels.map(m => m.id));

    // Analyze user preferences
    const preferences = this.analyzeUserPreferences(viewedModels);

    // Score and rank models
    for (const model of allModels) {
      if (viewedModelIds.has(model.id)) continue; // Skip already viewed

      const score = this.calculateModelScore(model, preferences, viewedModels);
      
      if (score.similarity > 0.3) { // Only recommend models with reasonable similarity
        recommendations.push({
          id: model.id,
          name: model.name,
          category: model.category || 'AI Model',
          tags: model.tags || [],
          price: parseFloat(model.price || 0),
          rating: parseFloat(model.rating || 4.5),
          reason: score.reason,
          similarity: score.similarity
        });
      }
    }

    // Sort by similarity score and return top results
    return recommendations
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // Analyze user preferences from viewing history
  private static analyzeUserPreferences(viewedModels: ViewedModel[]) {
    const categoryCount: Record<string, number> = {};
    const tagCount: Record<string, number> = {};
    const priceRanges: number[] = [];
    let totalTimeSpent = 0;

    for (const model of viewedModels) {
      // Count categories
      categoryCount[model.category] = (categoryCount[model.category] || 0) + 1;
      
      // Count tags
      for (const tag of model.tags) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
      
      // Track price preferences
      priceRanges.push(model.price);
      totalTimeSpent += model.timeSpent;
    }

    // Find preferred categories and tags
    const preferredCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const preferredTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // Calculate price range preference
    const avgPrice = priceRanges.reduce((sum, price) => sum + price, 0) / priceRanges.length;
    const priceStdDev = Math.sqrt(
      priceRanges.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / priceRanges.length
    );

    return {
      preferredCategories,
      preferredTags,
      avgPrice,
      priceStdDev,
      totalTimeSpent,
      avgTimeSpent: totalTimeSpent / viewedModels.length
    };
  }

  // Calculate similarity score for a model
  private static calculateModelScore(model: any, preferences: any, viewedModels: ViewedModel[]) {
    let similarity = 0;
    let reasons: string[] = [];

    // Category similarity (40% weight)
    if (preferences.preferredCategories.includes(model.category)) {
      const categoryRank = preferences.preferredCategories.indexOf(model.category);
      similarity += (0.4 * (3 - categoryRank) / 3);
      reasons.push(`Similar to your ${model.category} preferences`);
    }

    // Tag similarity (30% weight)
    const modelTags = model.tags || [];
    const matchingTags = modelTags.filter((tag: string) => preferences.preferredTags.includes(tag));
    if (matchingTags.length > 0) {
      similarity += 0.3 * (matchingTags.length / Math.max(modelTags.length, preferences.preferredTags.length));
      reasons.push(`Matches your interest in ${matchingTags.slice(0, 2).join(', ')}`);
    }

    // Price similarity (20% weight)
    const modelPrice = parseFloat(model.price || 0);
    const priceDiff = Math.abs(modelPrice - preferences.avgPrice);
    const priceScore = Math.max(0, 1 - (priceDiff / (preferences.avgPrice + preferences.priceStdDev)));
    similarity += 0.2 * priceScore;
    
    if (priceScore > 0.7) {
      reasons.push(`Within your preferred price range`);
    }

    // Rating boost (10% weight)
    const rating = parseFloat(model.rating || 4.5);
    if (rating >= 4.5) {
      similarity += 0.1;
      reasons.push(`Highly rated by users`);
    }

    return {
      similarity,
      reason: reasons.length > 0 ? reasons[0] : 'Popular choice'
    };
  }

  // Fallback recommendations for new users
  private static getFallbackRecommendations(allModels: any[], limit: number): RecommendedModel[] {
    return allModels
      .filter(model => model.isFeatured || parseFloat(model.rating || 0) >= 4.5)
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      .slice(0, limit)
      .map(model => ({
        id: model.id,
        name: model.name,
        category: model.category || 'AI Model',
        tags: model.tags || [],
        price: parseFloat(model.price || 0),
        rating: parseFloat(model.rating || 4.5),
        reason: model.isFeatured ? 'Featured model' : 'Popular choice',
        similarity: 0.8
      }));
  }

  // Get user's viewing statistics
  static getUserStats() {
    const viewedModels = this.getViewedModels();
    
    if (viewedModels.length === 0) {
      return {
        totalViews: 0,
        categories: [],
        avgTimeSpent: 0,
        recentActivity: []
      };
    }

    const categoryCount: Record<string, number> = {};
    let totalTime = 0;

    for (const model of viewedModels) {
      categoryCount[model.category] = (categoryCount[model.category] || 0) + 1;
      totalTime += model.timeSpent;
    }

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));

    return {
      totalViews: viewedModels.length,
      categories: topCategories,
      avgTimeSpent: totalTime / viewedModels.length,
      recentActivity: viewedModels.slice(0, 5).map(m => ({
        name: m.name,
        category: m.category,
        viewedAt: m.viewedAt
      }))
    };
  }

  // Clear viewing history
  static clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}