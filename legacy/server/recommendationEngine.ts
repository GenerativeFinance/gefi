import { db } from "./db";
import { 
  aiModels, 
  userModelSubscriptions, 
  modelUsageHistory, 
  userModelInteractions,
  portfolios,
  userPreferences,
  modelRecommendations,
  trendingModels,
  personalizedFeed,
  similarityScores,
  recommendationMetrics,
  users
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql, inArray, ne } from "drizzle-orm";

export interface RecommendationRequest {
  userId: string;
  context?: 'home' | 'category' | 'search' | 'portfolio';
  categoryFilter?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  maxPrice?: number;
  limit?: number;
}

export interface RecommendationResult {
  modelId: number;
  model: any;
  score: number;
  reasoning: string;
  reasonCode: string;
  recommendationType: 'personalized' | 'trending' | 'collaborative' | 'content_based' | 'hybrid';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export class RecommendationEngine {
  // Generate personalized recommendations for a user
  static async generateRecommendations(request: RecommendationRequest): Promise<RecommendationResult[]> {
    const { userId, context = 'home', categoryFilter, riskLevel, maxPrice, limit = 10 } = request;

    try {
      // Get user preferences and portfolio
      const [userPrefs, userPortfolio, userSubscriptions, userInteractions] = await Promise.all([
        this.getUserPreferences(userId),
        this.getUserPortfolio(userId),
        this.getUserSubscriptions(userId),
        this.getUserInteractions(userId)
      ]);

      // Get available models
      const availableModels = await this.getAvailableModels(userSubscriptions, categoryFilter, riskLevel, maxPrice);

      // Generate different types of recommendations
      const [
        personalizedRecs,
        collaborativeRecs,
        contentBasedRecs,
        trendingRecs
      ] = await Promise.all([
        this.generatePersonalizedRecommendations(userId, userPrefs, userPortfolio, availableModels),
        this.generateCollaborativeRecommendations(userId, userInteractions, availableModels),
        this.generateContentBasedRecommendations(userSubscriptions, userInteractions, availableModels),
        this.getTrendingRecommendations(availableModels, context)
      ]);

      // Combine and score recommendations
      const hybridRecs = this.combineRecommendations(
        personalizedRecs,
        collaborativeRecs,
        contentBasedRecs,
        trendingRecs,
        userPrefs
      );

      // Apply business rules and filters
      const filteredRecs = this.applyBusinessRules(hybridRecs, userPrefs, userPortfolio);

      // Sort by score and limit results
      const finalRecs = filteredRecs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Store recommendations for tracking
      await this.storeRecommendations(userId, finalRecs);

      return finalRecs;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Get user preferences or create default ones
  private static async getUserPreferences(userId: string) {
    try {
      const prefs = await db.query.userPreferences.findFirst({
        where: eq(userPreferences.userId, userId)
      });

      if (!prefs) {
        // Create default preferences based on user behavior
        const defaultPrefs = {
          userId,
          riskTolerance: 'moderate' as const,
          investmentHorizon: 'medium' as const,
          preferredCategories: [],
          excludedCategories: [],
          maxMonthlySpend: 500,
          preferredCompliance: ['GDPR'],
          financialGoals: ['wealth_building'],
          experienceLevel: 'intermediate' as const,
          preferredRegions: ['US', 'EU'],
          autoSubscribe: false,
          notificationPrefs: {}
        };

        const [newPrefs] = await db.insert(userPreferences)
          .values(defaultPrefs)
          .returning();
        
        return newPrefs;
      }

      return prefs;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Get user portfolio information
  private static async getUserPortfolio(userId: string) {
    try {
      const portfolio = await db.query.portfolios.findFirst({
        where: eq(portfolios.userId, userId)
      });
      return portfolio;
    } catch (error) {
      console.error('Error getting user portfolio:', error);
      return null;
    }
  }

  // Get user's current subscriptions
  private static async getUserSubscriptions(userId: string) {
    try {
      const subscriptions = await db.query.userModelSubscriptions.findMany({
        where: and(
          eq(userModelSubscriptions.userId, userId),
          eq(userModelSubscriptions.isActive, true)
        ),
        with: {
          model: true
        }
      });
      return subscriptions;
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      return [];
    }
  }

  // Get user interaction history
  private static async getUserInteractions(userId: string) {
    try {
      const interactions = await db.query.userModelInteractions.findMany({
        where: eq(userModelInteractions.userId, userId),
        orderBy: desc(userModelInteractions.timestamp),
        limit: 100
      });
      return interactions;
    } catch (error) {
      console.error('Error getting user interactions:', error);
      return [];
    }
  }

  // Get available models (excluding already subscribed)
  private static async getAvailableModels(userSubscriptions: any[], categoryFilter?: string[], riskLevel?: string, maxPrice?: number) {
    try {
      const subscribedModelIds = userSubscriptions.map(sub => sub.modelId);
      
      let query = db.select().from(aiModels).where(eq(aiModels.isActive, true));

      if (subscribedModelIds.length > 0) {
        query = query.where(ne(aiModels.id, sql`ANY(${subscribedModelIds})`));
      }

      if (categoryFilter && categoryFilter.length > 0) {
        query = query.where(inArray(aiModels.category, categoryFilter));
      }

      if (riskLevel) {
        query = query.where(eq(aiModels.riskLevel, riskLevel));
      }

      if (maxPrice) {
        query = query.where(lte(aiModels.price, maxPrice.toString()));
      }

      const models = await query;
      return models;
    } catch (error) {
      console.error('Error getting available models:', error);
      return [];
    }
  }

  // Generate personalized recommendations based on user profile
  private static async generatePersonalizedRecommendations(
    userId: string, 
    userPrefs: any, 
    userPortfolio: any, 
    availableModels: any[]
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    for (const model of availableModels) {
      let score = 0.5; // Base score
      let reasoning = '';
      let reasonCode = 'general_match';

      // Risk tolerance matching
      if (userPrefs?.riskTolerance && model.riskLevel) {
        if (userPrefs.riskTolerance === model.riskLevel) {
          score += 0.2;
          reasoning += `Matches your ${userPrefs.riskTolerance} risk tolerance. `;
          reasonCode = 'risk_alignment';
        } else if (
          (userPrefs.riskTolerance === 'moderate' && ['low', 'high'].includes(model.riskLevel)) ||
          (userPrefs.riskTolerance === 'conservative' && model.riskLevel === 'low') ||
          (userPrefs.riskTolerance === 'aggressive' && model.riskLevel === 'high')
        ) {
          score += 0.1;
          reasoning += `Compatible with your ${userPrefs.riskTolerance} risk preference. `;
        }
      }

      // Category preference matching
      if (userPrefs?.preferredCategories?.includes(model.category)) {
        score += 0.15;
        reasoning += `Matches your interest in ${model.category}. `;
        reasonCode = 'category_preference';
      }

      // Investment horizon matching
      if (userPrefs?.investmentHorizon && model.targetUserType) {
        if (
          (userPrefs.investmentHorizon === 'long' && model.targetUserType.includes('Investment')) ||
          (userPrefs.investmentHorizon === 'short' && model.targetUserType.includes('Trading'))
        ) {
          score += 0.1;
          reasoning += `Suitable for your ${userPrefs.investmentHorizon}-term strategy. `;
        }
      }

      // Portfolio size consideration
      if (userPortfolio && model.minInvestment) {
        const portfolioValue = parseFloat(userPortfolio.totalInvestment);
        const minInvestment = parseFloat(model.minInvestment);
        
        if (portfolioValue >= minInvestment * 10) {
          score += 0.1;
          reasoning += 'Well-suited for your portfolio size. ';
        } else if (portfolioValue >= minInvestment) {
          score += 0.05;
          reasoning += 'Compatible with your portfolio size. ';
        }
      }

      // Rating and performance boost
      if (model.rating && parseFloat(model.rating) >= 4.0) {
        score += 0.1;
        reasoning += 'Highly rated by other users. ';
      }

      // Compliance matching
      if (userPrefs?.preferredCompliance && model.complianceFrameworks) {
        const matchingCompliance = userPrefs.preferredCompliance.filter((comp: string) => 
          model.complianceFrameworks.includes(comp)
        );
        if (matchingCompliance.length > 0) {
          score += 0.05 * matchingCompliance.length;
          reasoning += `Meets your compliance requirements (${matchingCompliance.join(', ')}). `;
        }
      }

      // Price consideration
      if (userPrefs?.maxMonthlySpend && parseFloat(model.price) <= userPrefs.maxMonthlySpend) {
        score += 0.05;
        reasoning += 'Within your budget. ';
      }

      if (score > 0.6) {
        recommendations.push({
          modelId: model.id,
          model,
          score: Math.min(score, 1.0),
          reasoning: reasoning.trim() || 'Good fit based on your profile.',
          reasonCode,
          recommendationType: 'personalized',
          priority: score > 0.8 ? 'high' : score > 0.7 ? 'medium' : 'low'
        });
      }
    }

    return recommendations;
  }

  // Generate collaborative filtering recommendations
  private static async generateCollaborativeRecommendations(
    userId: string,
    userInteractions: any[],
    availableModels: any[]
  ): Promise<RecommendationResult[]> {
    try {
      // Find similar users based on interaction patterns
      const similarUsers = await this.findSimilarUsers(userId, userInteractions);
      
      if (similarUsers.length === 0) {
        return [];
      }

      // Get models that similar users liked/subscribed to
      const recommendations: RecommendationResult[] = [];
      
      for (const model of availableModels) {
        let score = 0;
        let similaritySum = 0;

        for (const similarUser of similarUsers) {
          const userInteractedWithModel = await db.query.userModelInteractions.findFirst({
            where: and(
              eq(userModelInteractions.userId, similarUser.similarUserId),
              eq(userModelInteractions.modelId, model.id),
              inArray(userModelInteractions.interactionType, ['like', 'subscribe', 'trial'])
            )
          });

          if (userInteractedWithModel) {
            score += similarUser.score * 0.8;
            similaritySum += similarUser.score;
          }
        }

        if (similaritySum > 0) {
          score = score / similaritySum;
          
          if (score > 0.3) {
            recommendations.push({
              modelId: model.id,
              model,
              score,
              reasoning: 'Users with similar preferences also liked this model.',
              reasonCode: 'collaborative_filtering',
              recommendationType: 'collaborative',
              priority: score > 0.7 ? 'high' : 'medium'
            });
          }
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating collaborative recommendations:', error);
      return [];
    }
  }

  // Generate content-based recommendations
  private static async generateContentBasedRecommendations(
    userSubscriptions: any[],
    userInteractions: any[],
    availableModels: any[]
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // Extract features from user's current models
    const userCategories = new Set(userSubscriptions.map(sub => sub.model?.category).filter(Boolean));
    const userTechniques = new Set(userSubscriptions.map(sub => sub.model?.aiTechnique).filter(Boolean));
    const userInstruments = new Set(userSubscriptions.map(sub => sub.model?.financialInstrument).filter(Boolean));

    // Also consider models the user has interacted with positively
    const positiveInteractions = userInteractions.filter(int => 
      ['like', 'subscribe', 'trial'].includes(int.interactionType) || 
      (int.rating && parseFloat(int.rating) >= 4.0)
    );

    for (const model of availableModels) {
      let score = 0;
      let reasoning = '';

      // Category similarity
      if (userCategories.has(model.category)) {
        score += 0.3;
        reasoning += `Similar to your ${model.category} models. `;
      }

      // AI technique similarity
      if (userTechniques.has(model.aiTechnique)) {
        score += 0.2;
        reasoning += `Uses familiar ${model.aiTechnique} approach. `;
      }

      // Financial instrument similarity
      if (userInstruments.has(model.financialInstrument)) {
        score += 0.2;
        reasoning += `Covers ${model.financialInstrument} like your other models. `;
      }

      // Tag similarity
      if (model.tags && userSubscriptions.length > 0) {
        const userTags = new Set(
          userSubscriptions.flatMap(sub => sub.model?.tags || [])
        );
        const commonTags = model.tags.filter((tag: string) => userTags.has(tag));
        if (commonTags.length > 0) {
          score += 0.1 * (commonTags.length / model.tags.length);
          reasoning += `Shares features: ${commonTags.join(', ')}. `;
        }
      }

      if (score > 0.4) {
        recommendations.push({
          modelId: model.id,
          model,
          score: Math.min(score, 1.0),
          reasoning: reasoning.trim() || 'Similar to your current models.',
          reasonCode: 'content_similarity',
          recommendationType: 'content_based',
          priority: score > 0.7 ? 'high' : 'medium'
        });
      }
    }

    return recommendations;
  }

  // Get trending recommendations
  private static async getTrendingRecommendations(
    availableModels: any[],
    context: string
  ): Promise<RecommendationResult[]> {
    try {
      const trending = await db.query.trendingModels.findMany({
        where: eq(trendingModels.timeFrame, 'weekly'),
        orderBy: desc(trendingModels.rank),
        limit: 5,
        with: {
          model: true
        }
      });

      const recommendations: RecommendationResult[] = [];

      for (const trendingModel of trending) {
        const model = availableModels.find(m => m.id === trendingModel.modelId);
        if (model) {
          const score = Math.max(0.3, 1.0 - (trendingModel.rank - 1) * 0.1);
          
          recommendations.push({
            modelId: model.id,
            model,
            score,
            reasoning: `Currently trending (#${trendingModel.rank} this week) with ${trendingModel.subscriptionCount} new subscriptions.`,
            reasonCode: 'trending',
            recommendationType: 'trending',
            priority: trendingModel.rank <= 3 ? 'medium' : 'low'
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting trending recommendations:', error);
      return [];
    }
  }

  // Find users similar to the current user
  private static async findSimilarUsers(userId: string, userInteractions: any[]) {
    try {
      const similarUsers = await db.query.similarityScores.findMany({
        where: and(
          eq(similarityScores.userId, userId),
          gte(similarityScores.score, 0.3)
        ),
        orderBy: desc(similarityScores.score),
        limit: 10
      });

      return similarUsers;
    } catch (error) {
      console.error('Error finding similar users:', error);
      return [];
    }
  }

  // Combine different recommendation types
  private static combineRecommendations(
    personalizedRecs: RecommendationResult[],
    collaborativeRecs: RecommendationResult[],
    contentBasedRecs: RecommendationResult[],
    trendingRecs: RecommendationResult[],
    userPrefs: any
  ): RecommendationResult[] {
    const combinedMap = new Map<number, RecommendationResult>();

    // Weights for different recommendation types
    const weights = {
      personalized: 0.4,
      collaborative: 0.3,
      content_based: 0.2,
      trending: 0.1
    };

    // Process each recommendation type
    const allRecs = [
      ...personalizedRecs.map(r => ({ ...r, weight: weights.personalized })),
      ...collaborativeRecs.map(r => ({ ...r, weight: weights.collaborative })),
      ...contentBasedRecs.map(r => ({ ...r, weight: weights.content_based })),
      ...trendingRecs.map(r => ({ ...r, weight: weights.trending }))
    ];

    for (const rec of allRecs) {
      const existing = combinedMap.get(rec.modelId);
      
      if (existing) {
        // Combine scores using weighted average
        const totalWeight = existing.score + (rec as any).weight;
        existing.score = (existing.score + rec.score * (rec as any).weight) / totalWeight;
        existing.reasoning += ` ${rec.reasoning}`;
        existing.recommendationType = 'hybrid';
        
        // Upgrade priority if any component has high priority
        if (rec.priority === 'high' || existing.priority === 'high') {
          existing.priority = 'high';
        } else if (rec.priority === 'medium' || existing.priority === 'medium') {
          existing.priority = 'medium';
        }
      } else {
        combinedMap.set(rec.modelId, {
          ...rec,
          recommendationType: rec.recommendationType
        });
      }
    }

    return Array.from(combinedMap.values());
  }

  // Apply business rules and filters
  private static applyBusinessRules(
    recommendations: RecommendationResult[],
    userPrefs: any,
    userPortfolio: any
  ): RecommendationResult[] {
    return recommendations.filter(rec => {
      // Filter out models that are too expensive
      if (userPrefs?.maxMonthlySpend && parseFloat(rec.model.price) > userPrefs.maxMonthlySpend) {
        return false;
      }

      // Filter out excluded categories
      if (userPrefs?.excludedCategories?.includes(rec.model.category)) {
        return false;
      }

      // Filter out models with minimum investment too high
      if (userPortfolio && rec.model.minInvestment) {
        const portfolioValue = parseFloat(userPortfolio.totalInvestment);
        const minInvestment = parseFloat(rec.model.minInvestment);
        
        if (portfolioValue < minInvestment) {
          return false;
        }
      }

      return true;
    });
  }

  // Store recommendations for tracking and analytics
  private static async storeRecommendations(userId: string, recommendations: RecommendationResult[]) {
    try {
      const recommendationData = recommendations.map((rec, index) => ({
        userId,
        modelId: rec.modelId,
        score: rec.score,
        reasonCode: rec.reasonCode,
        reasoning: rec.reasoning,
        recommendationType: rec.recommendationType,
        priority: rec.priority,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }));

      await db.insert(modelRecommendations).values(recommendationData);
    } catch (error) {
      console.error('Error storing recommendations:', error);
    }
  }

  // Track user interaction with recommendations
  static async trackInteraction(userId: string, modelId: number, interactionType: string, metadata?: any) {
    try {
      await db.insert(userModelInteractions).values({
        userId,
        modelId,
        interactionType,
        metadata,
        sessionDuration: metadata?.sessionDuration,
        clickDepth: metadata?.clickDepth,
        rating: metadata?.rating
      });

      // Update recommendation metrics
      await this.updateRecommendationMetrics(userId, modelId, interactionType);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  // Update recommendation performance metrics
  private static async updateRecommendationMetrics(userId: string, modelId: number, interactionType: string) {
    try {
      const recommendation = await db.query.modelRecommendations.findFirst({
        where: and(
          eq(modelRecommendations.userId, userId),
          eq(modelRecommendations.modelId, modelId),
          eq(modelRecommendations.isViewed, false)
        )
      });

      if (recommendation) {
        // Update the recommendation as viewed/interacted
        await db.update(modelRecommendations)
          .set({
            isViewed: true,
            isInteracted: ['like', 'subscribe', 'trial'].includes(interactionType),
            updatedAt: new Date()
          })
          .where(eq(modelRecommendations.id, recommendation.id));

        // Record metrics
        const metricValue = interactionType === 'subscribe' ? 1.0 : 
                           interactionType === 'like' ? 0.8 :
                           interactionType === 'trial' ? 0.6 :
                           interactionType === 'view' ? 0.2 : 0.1;

        await db.insert(recommendationMetrics).values({
          userId,
          modelId,
          recommendationId: recommendation.id,
          metricType: 'interaction',
          metricValue,
          timeFrame: 'daily'
        });
      }
    } catch (error) {
      console.error('Error updating recommendation metrics:', error);
    }
  }

  // Calculate and update user similarity scores
  static async calculateUserSimilarity(userId: string) {
    try {
      const userInteractions = await this.getUserInteractions(userId);
      const userSubscriptions = await this.getUserSubscriptions(userId);

      // Get all other users
      const allUsers = await db.select({ id: users.id }).from(users).where(ne(users.id, userId));

      for (const otherUser of allUsers) {
        const otherInteractions = await this.getUserInteractions(otherUser.id);
        const otherSubscriptions = await this.getUserSubscriptions(otherUser.id);

        // Calculate similarity based on shared models and interactions
        const similarity = this.calculateSimilarityScore(
          { interactions: userInteractions, subscriptions: userSubscriptions },
          { interactions: otherInteractions, subscriptions: otherSubscriptions }
        );

        if (similarity > 0.1) {
          // Store or update similarity score
          await db.insert(similarityScores).values({
            userId,
            similarUserId: otherUser.id,
            score: similarity,
            sharedModels: this.countSharedModels(userSubscriptions, otherSubscriptions),
            sharedCategories: this.countSharedCategories(userSubscriptions, otherSubscriptions),
            similarityType: 'behavioral'
          }).onConflictDoUpdate({
            target: [similarityScores.userId, similarityScores.similarUserId],
            set: {
              score: similarity,
              lastCalculated: new Date()
            }
          });
        }
      }
    } catch (error) {
      console.error('Error calculating user similarity:', error);
    }
  }

  // Calculate similarity score between two users
  private static calculateSimilarityScore(user1: any, user2: any): number {
    let similarity = 0;

    // Subscription-based similarity
    const user1Models = new Set(user1.subscriptions.map((s: any) => s.modelId));
    const user2Models = new Set(user2.subscriptions.map((s: any) => s.modelId));
    const sharedModels = new Set([...user1Models].filter(id => user2Models.has(id)));
    const totalModels = new Set([...user1Models, ...user2Models]);

    if (totalModels.size > 0) {
      similarity += (sharedModels.size / totalModels.size) * 0.5;
    }

    // Interaction-based similarity
    const user1Likes = new Set(
      user1.interactions.filter((i: any) => i.interactionType === 'like').map((i: any) => i.modelId)
    );
    const user2Likes = new Set(
      user2.interactions.filter((i: any) => i.interactionType === 'like').map((i: any) => i.modelId)
    );
    const sharedLikes = new Set([...user1Likes].filter(id => user2Likes.has(id)));
    const totalLikes = new Set([...user1Likes, ...user2Likes]);

    if (totalLikes.size > 0) {
      similarity += (sharedLikes.size / totalLikes.size) * 0.3;
    }

    // Rating correlation
    const commonModels = [...sharedModels];
    if (commonModels.length > 0) {
      let ratingCorrelation = 0;
      let validRatings = 0;

      for (const modelId of commonModels) {
        const user1Rating = user1.interactions.find((i: any) => i.modelId === modelId && i.rating)?.rating;
        const user2Rating = user2.interactions.find((i: any) => i.modelId === modelId && i.rating)?.rating;

        if (user1Rating && user2Rating) {
          ratingCorrelation += 1 - Math.abs(parseFloat(user1Rating) - parseFloat(user2Rating)) / 4;
          validRatings++;
        }
      }

      if (validRatings > 0) {
        similarity += (ratingCorrelation / validRatings) * 0.2;
      }
    }

    return Math.min(similarity, 1.0);
  }

  // Count shared models between users
  private static countSharedModels(subscriptions1: any[], subscriptions2: any[]): number {
    const models1 = new Set(subscriptions1.map(s => s.modelId));
    const models2 = new Set(subscriptions2.map(s => s.modelId));
    return new Set([...models1].filter(id => models2.has(id))).size;
  }

  // Count shared categories between users
  private static countSharedCategories(subscriptions1: any[], subscriptions2: any[]): number {
    const categories1 = new Set(subscriptions1.map(s => s.model?.category).filter(Boolean));
    const categories2 = new Set(subscriptions2.map(s => s.model?.category).filter(Boolean));
    return new Set([...categories1].filter(cat => categories2.has(cat))).size;
  }

  // Update trending models
  static async updateTrendingModels() {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Calculate trending scores based on recent activity
      const trendingData = await db
        .select({
          modelId: userModelSubscriptions.modelId,
          subscriptionCount: sql<number>`COUNT(*)`,
          avgRating: sql<number>`AVG(CASE WHEN ${userModelInteractions.rating} IS NOT NULL THEN ${userModelInteractions.rating} ELSE 0 END)`,
          viewCount: sql<number>`COUNT(CASE WHEN ${userModelInteractions.interactionType} = 'view' THEN 1 END)`
        })
        .from(userModelSubscriptions)
        .leftJoin(userModelInteractions, eq(userModelSubscriptions.modelId, userModelInteractions.modelId))
        .where(gte(userModelSubscriptions.subscribedAt, weekAgo))
        .groupBy(userModelSubscriptions.modelId)
        .orderBy(desc(sql`COUNT(*)`));

      // Calculate trend scores and rankings
      const trendingModels = trendingData.map((data, index) => {
        const trendScore = (
          (data.subscriptionCount * 0.4) +
          (data.viewCount * 0.3) +
          (data.avgRating * 0.3)
        );

        return {
          modelId: data.modelId,
          rank: index + 1,
          trendScore,
          viewCount: data.viewCount,
          subscriptionCount: data.subscriptionCount,
          avgRating: data.avgRating,
          timeFrame: 'weekly' as const
        };
      });

      // Clear old trending data and insert new
      await db.delete(trendingModels).where(eq(trendingModels.timeFrame, 'weekly'));
      
      if (trendingModels.length > 0) {
        await db.insert(trendingModels).values(trendingModels);
      }

    } catch (error) {
      console.error('Error updating trending models:', error);
    }
  }
}