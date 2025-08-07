import {
  users,
  portfolios,
  portfolioAssets,
  aiModels,
  userModelSubscriptions,
  portfolioAiModels,
  marketInsights,
  riskAlerts,
  reports,
  complianceFrameworks,
  complianceChecks,
  auditTrail,
  regulatoryReports,
  riskLimits,
  complianceDocuments,
  modelComments,
  modelRatings,
  developerModels,
  modelFunding,
  userProfiles,
  userEducation,
  userExperience,
  userCertifications,
  userSkills,
  userPublications,
  userReviews,
  userStats,
  dataProviders,
  datasets,
  datasetUsage,
  datasetSubscriptions,
  dataQualityMetrics,
  dataCollaborations,
  datasetReviews,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Portfolio,
  type InsertPortfolio,
  type PortfolioAsset,
  type InsertPortfolioAsset,
  type AiModel,
  type InsertAiModel,
  type UserModelSubscription,
  type InsertUserModelSubscription,
  type PortfolioAiModel,
  type InsertPortfolioAiModel,
  type MarketInsight,
  type InsertMarketInsight,
  type RiskAlert,
  type InsertRiskAlert,
  type Report,
  type InsertReport,
  type ComplianceFramework,
  type InsertComplianceFramework,
  type ComplianceCheck,
  type InsertComplianceCheck,
  type AuditTrail,
  type InsertAuditTrail,
  type RegulatoryReport,
  type InsertRegulatoryReport,
  type RiskLimit,
  type InsertRiskLimit,
  type ComplianceDocument,
  type InsertComplianceDocument,
  type AiModelCategory,
  type InsertAiModelCategory,
  type AiModelSubcategory,
  type InsertAiModelSubcategory,
  aiModelCategories,
  aiModelSubcategories,
  type ModelComment,
  type InsertModelComment,
  type ModelRating,
  type InsertModelRating,
  type DeveloperModel,
  type InsertDeveloperModel,
  type ModelFunding,
  type InsertModelFunding,
  web3Wallets,
  cryptoHoldings,
  defiPositions,
  defiTransactions,
  yieldFarmingPositions,
  nftHoldings,
  type Web3Wallet,
  type InsertWeb3Wallet,
  type CryptoHolding,
  type InsertCryptoHolding,
  type DefiPosition,
  type InsertDefiPosition,
  type DefiTransaction,
  type InsertDefiTransaction,
  type YieldFarmingPosition,
  type InsertYieldFarmingPosition,
  type NftHolding,
  type InsertNftHolding,
  botFundingRequests,
  botFundingContributions,
  type BotFundingRequest,
  type InsertBotFundingRequest,
  type BotFundingContribution,
  type InsertBotFundingContribution,
  type DataProvider,
  type InsertDataProvider,
  type Dataset,
  type InsertDataset,
  type DatasetUsage,
  type InsertDatasetUsage,
  type DatasetSubscription,
  type InsertDatasetSubscription,
  type DataQualityMetrics,
  type InsertDataQualityMetrics,
  type DataCollaboration,
  type InsertDataCollaboration,
  type DatasetReview,
  type InsertDatasetReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  getUserEducation(userId: string): Promise<any[]>;
  getUserExperience(userId: string): Promise<any[]>;
  getUserCertifications(userId: string): Promise<any[]>;
  getUserSkills(userId: string): Promise<any[]>;
  getUserPublications(userId: string): Promise<any[]>;
  getUserReviews(userId: string): Promise<any[]>;
  getUserStats(userId: string): Promise<any>;
  
  // Portfolio operations
  getUserPortfolio(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(portfolioId: number, updates: Partial<InsertPortfolio>): Promise<Portfolio>;
  getPortfolioAssets(portfolioId: number): Promise<PortfolioAsset[]>;
  getPortfolioAiModels(portfolioId: number): Promise<PortfolioAiModel[]>;
  
  // AI Models operations
  getAllAiModels(): Promise<AiModel[]>;
  getAiModel(id: number): Promise<AiModel | undefined>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  getUserModelSubscriptions(userId: string): Promise<UserModelSubscription[]>;
  subscribeToModel(subscription: InsertUserModelSubscription): Promise<UserModelSubscription>;
  getUserAiModels(userId: string): Promise<AiModel[]>;
  
  // AI Model Categories operations
  getAiModelCategories(): Promise<AiModelCategory[]>;
  createAiModelCategory(category: InsertAiModelCategory): Promise<AiModelCategory>;
  getAiModelSubcategories(): Promise<AiModelSubcategory[]>;
  getAiModelSubcategoriesByCategory(categoryId: number): Promise<AiModelSubcategory[]>;
  getAiModelSubcategoriesByCategoryName(categoryName: string): Promise<AiModelSubcategory[]>;
  createAiModelSubcategory(subcategory: InsertAiModelSubcategory): Promise<AiModelSubcategory>;
  getAiModelsByCategory(categoryId: number): Promise<AiModel[]>;
  getAiModelsBySubcategory(subcategoryId: number): Promise<AiModel[]>;
  searchAiModels(filters: {
    category?: number;
    subcategory?: number;
    priceMin?: number;
    priceMax?: number;
    riskLevel?: string;
    aiTechnique?: string;
    targetUserType?: string;
    financialInstrument?: string;
    tags?: string[];
  }): Promise<AiModel[]>;
  
  // Market insights operations
  getLatestMarketInsights(): Promise<MarketInsight[]>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;
  
  // Risk alerts operations
  getUserRiskAlerts(userId: string): Promise<RiskAlert[]>;
  createRiskAlert(alert: InsertRiskAlert): Promise<RiskAlert>;
  markAlertAsRead(alertId: number): Promise<void>;
  
  // Reports operations
  getUserReports(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Compliance operations
  getComplianceFrameworks(): Promise<ComplianceFramework[]>;
  createComplianceFramework(framework: InsertComplianceFramework): Promise<ComplianceFramework>;
  getUserComplianceChecks(userId: string): Promise<ComplianceCheck[]>;
  createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck>;
  getUserAuditTrail(userId: string, limit?: number): Promise<AuditTrail[]>;
  createAuditEntry(entry: InsertAuditTrail): Promise<AuditTrail>;
  getUserRegulatoryReports(userId: string): Promise<RegulatoryReport[]>;
  createRegulatoryReport(report: InsertRegulatoryReport): Promise<RegulatoryReport>;
  getUserRiskLimits(userId: string): Promise<RiskLimit[]>;
  createRiskLimit(limit: InsertRiskLimit): Promise<RiskLimit>;
  updateRiskLimit(limitId: number, updates: Partial<InsertRiskLimit>): Promise<RiskLimit>;
  getUserComplianceDocuments(userId: string): Promise<ComplianceDocument[]>;
  createComplianceDocument(document: InsertComplianceDocument): Promise<ComplianceDocument>;
  
  // Comments and ratings operations
  getModelComments(modelId: number): Promise<ModelComment[]>;
  createModelComment(comment: InsertModelComment): Promise<ModelComment>;
  getModelRatings(modelId: number): Promise<ModelRating[]>;
  createModelRating(rating: InsertModelRating): Promise<ModelRating>;
  
  // Developer Models operations
  getAllDeveloperModels(): Promise<DeveloperModel[]>;
  getDeveloperModels(...statuses: string[]): Promise<DeveloperModel[]>;
  getDeveloperModel(id: number): Promise<DeveloperModel | undefined>;
  getDeveloperModelCategories(): Promise<string[]>;
  updateDeveloperModelFunding(modelId: number, newAmount: string): Promise<void>;
  
  // Model Funding operations
  createModelFunding(funding: InsertModelFunding): Promise<ModelFunding>;
  getUserModelFunding(userId: string): Promise<ModelFunding[]>;
  
  // Web3 Wallet operations
  getUserWallets(userId: string): Promise<Web3Wallet[]>;
  getWallet(walletId: number): Promise<Web3Wallet | undefined>;
  addWallet(wallet: InsertWeb3Wallet): Promise<Web3Wallet>;
  updateWallet(walletId: number, updates: Partial<InsertWeb3Wallet>): Promise<Web3Wallet>;
  removeWallet(walletId: number): Promise<void>;
  
  // Crypto Holdings operations
  getWalletHoldings(walletId: number): Promise<CryptoHolding[]>;
  getUserCryptoHoldings(userId: string): Promise<CryptoHolding[]>;
  addCryptoHolding(holding: InsertCryptoHolding): Promise<CryptoHolding>;
  updateCryptoHolding(holdingId: number, updates: Partial<InsertCryptoHolding>): Promise<CryptoHolding>;
  removeCryptoHolding(holdingId: number): Promise<void>;
  
  // DeFi Positions operations
  getWalletDefiPositions(walletId: number): Promise<DefiPosition[]>;
  getUserDefiPositions(userId: string): Promise<DefiPosition[]>;
  addDefiPosition(position: InsertDefiPosition): Promise<DefiPosition>;
  updateDefiPosition(positionId: number, updates: Partial<InsertDefiPosition>): Promise<DefiPosition>;
  removeDefiPosition(positionId: number): Promise<void>;
  
  // DeFi Transactions operations
  getWalletTransactions(walletId: number, limit?: number): Promise<DefiTransaction[]>;
  getUserTransactions(userId: string, limit?: number): Promise<DefiTransaction[]>;
  addTransaction(transaction: InsertDefiTransaction): Promise<DefiTransaction>;
  
  // Yield Farming operations
  getWalletYieldPositions(walletId: number): Promise<YieldFarmingPosition[]>;
  getUserYieldPositions(userId: string): Promise<YieldFarmingPosition[]>;
  addYieldPosition(position: InsertYieldFarmingPosition): Promise<YieldFarmingPosition>;
  updateYieldPosition(positionId: number, updates: Partial<InsertYieldFarmingPosition>): Promise<YieldFarmingPosition>;
  
  // NFT Holdings operations
  getWalletNFTs(walletId: number): Promise<NftHolding[]>;
  getUserNFTs(userId: string): Promise<NftHolding[]>;
  addNFT(nft: InsertNftHolding): Promise<NftHolding>;
  updateNFT(nftId: number, updates: Partial<InsertNftHolding>): Promise<NftHolding>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to find existing user by email or id
      let existingUser = null;
      if (userData.email) {
        existingUser = await this.getUserByEmail(userData.email);
      }
      if (!existingUser && userData.id) {
        existingUser = await this.getUser(userData.id);
      }

      if (existingUser) {
        // Update only safe fields that won't cause constraint violations
        const [user] = await db
          .update(users)
          .set({ 
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date() 
          })
          .where(eq(users.id, existingUser.id))
          .returning();
        return user;
      } else {
        // Create new user - use insert with onConflictDoNothing to avoid duplicate key errors
        const [user] = await db
          .insert(users)
          .values(userData)
          .onConflictDoNothing()
          .returning();
        
        if (!user) {
          // If insert was skipped due to conflict, fetch the existing user
          return await this.getUser(userData.id!) || await this.getUserByEmail(userData.email!);
        }
        
        return user;
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      // Try to fetch existing user as fallback
      if (userData.id) {
        const existing = await this.getUser(userData.id);
        if (existing) return existing;
      }
      if (userData.email) {
        const existing = await this.getUserByEmail(userData.email);
        if (existing) return existing;
      }
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserOnboarding(id: string, onboardingData: {
    role: string;
    onboardingAnswers: Record<string, string>;
    onboardingCompleted: boolean;
    onboardingCompletedAt: Date;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        role: onboardingData.role,
        onboardingAnswers: JSON.stringify(onboardingData.onboardingAnswers),
        onboardingCompleted: onboardingData.onboardingCompleted,
        onboardingCompletedAt: onboardingData.onboardingCompletedAt,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    try {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Return undefined if profile doesn't exist or schema mismatch
      return undefined;
    }
  }

  async createOrUpdateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    try {
      console.log("Attempting to create/update profile for user:", userId);
      console.log("Profile data:", profile);
      
      // First check if profile already exists
      const existingProfile = await this.getUserProfile(userId);
      
      if (existingProfile) {
        console.log("Profile exists, updating...");
        const [userProfile] = await db
          .update(userProfiles)
          .set({
            ...profile,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId))
          .returning();
        console.log("Profile updated successfully");
        return userProfile;
      } else {
        console.log("Profile doesn't exist, creating...");
        const [userProfile] = await db
          .insert(userProfiles)
          .values({
            ...profile,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        console.log("Profile created successfully");
        return userProfile;
      }
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
      throw new Error(`Failed to create/update profile: ${error.message}`);
    }
  }

  async getUserEducation(userId: string): Promise<any[]> {
    try {
      const education = await db
        .select()
        .from(userEducation)
        .where(eq(userEducation.userId, userId))
        .orderBy(userEducation.endYear);
      return education;
    } catch (error) {
      console.error("Error fetching user education:", error);
      return [];
    }
  }

  async getUserExperience(userId: string): Promise<any[]> {
    try {
      const experience = await db
        .select()
        .from(userExperience)
        .where(eq(userExperience.userId, userId))
        .orderBy(userExperience.endDate);
      return experience;
    } catch (error) {
      console.error("Error fetching user experience:", error);
      return [];
    }
  }

  async getUserCertifications(userId: string): Promise<any[]> {
    try {
      const certifications = await db
        .select()
        .from(userCertifications)
        .where(eq(userCertifications.userId, userId))
        .orderBy(userCertifications.issueDate);
      return certifications;
    } catch (error) {
      console.error("Error fetching user certifications:", error);
      return [];
    }
  }

  async getUserSkills(userId: string): Promise<any[]> {
    try {
      const skills = await db
        .select()
        .from(userSkills)
        .where(eq(userSkills.userId, userId))
        .orderBy(userSkills.category, userSkills.name);
      return skills;
    } catch (error) {
      console.error("Error fetching user skills:", error);
      return [];
    }
  }

  async getUserPublications(userId: string): Promise<any[]> {
    try {
      const publications = await db
        .select()
        .from(userPublications)
        .where(eq(userPublications.userId, userId))
        .orderBy(userPublications.publicationDate);
      return publications;
    } catch (error) {
      console.error("Error fetching user publications:", error);
      return [];
    }
  }

  async getUserReviews(userId: string): Promise<any[]> {
    try {
      const reviews = await db
        .select({
          id: userReviews.id,
          rating: userReviews.rating,
          reviewText: userReviews.reviewText,
          projectTitle: userReviews.projectTitle,
          projectCategory: userReviews.projectCategory,
          deliveryRating: userReviews.deliveryRating,
          communicationRating: userReviews.communicationRating,
          qualityRating: userReviews.qualityRating,
          createdAt: userReviews.createdAt,
          reviewerUser: {
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          }
        })
        .from(userReviews)
        .leftJoin(users, eq(userReviews.reviewerUserId, users.id))
        .where(eq(userReviews.reviewedUserId, userId))
        .orderBy(userReviews.createdAt);
      return reviews;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const [stats] = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId));
      return stats || {};
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {};
    }
  }

  // Portfolio operations
  async getUserPortfolio(userId: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId));
    return portfolio;
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db
      .insert(portfolios)
      .values(portfolio)
      .returning();
    return newPortfolio;
  }

  async updatePortfolio(portfolioId: number, updates: Partial<InsertPortfolio>): Promise<Portfolio> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolios.id, portfolioId))
      .returning();
    return updatedPortfolio;
  }

  async getPortfolioAssets(portfolioId: number): Promise<PortfolioAsset[]> {
    return await db
      .select()
      .from(portfolioAssets)
      .where(eq(portfolioAssets.portfolioId, portfolioId));
  }

  async getPortfolioAiModels(portfolioId: number): Promise<PortfolioAiModel[]> {
    return await db
      .select()
      .from(portfolioAiModels)
      .where(eq(portfolioAiModels.portfolioId, portfolioId));
  }

  // AI Models operations
  async getAllAiModels(): Promise<AiModel[]> {
    const models = await db
      .select({
        ...aiModels,
        subcategory: aiModelSubcategories.name,
      })
      .from(aiModels)
      .leftJoin(aiModelSubcategories, eq(aiModels.subcategoryId, aiModelSubcategories.id))
      .where(eq(aiModels.isActive, true))
      .orderBy(desc(aiModels.rating));
    
    return models as AiModel[];
  }

  async getAiModel(id: number): Promise<AiModel | undefined> {
    const [model] = await db
      .select()
      .from(aiModels)
      .where(eq(aiModels.id, id));
    return model;
  }

  async createAiModel(model: InsertAiModel): Promise<AiModel> {
    const [newModel] = await db
      .insert(aiModels)
      .values(model)
      .returning();
    return newModel;
  }

  async getUserModelSubscriptions(userId: string): Promise<UserModelSubscription[]> {
    return await db
      .select()
      .from(userModelSubscriptions)
      .where(and(
        eq(userModelSubscriptions.userId, userId),
        eq(userModelSubscriptions.isActive, true)
      ));
  }

  async subscribeToModel(subscription: InsertUserModelSubscription): Promise<UserModelSubscription> {
    const [newSubscription] = await db
      .insert(userModelSubscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async getUserAiModels(userId: string): Promise<AiModel[]> {
    const subscriptions = await db
      .select({
        modelId: userModelSubscriptions.modelId,
        status: userModelSubscriptions.status,
        subscriptionDate: userModelSubscriptions.subscriptionDate,
        isActive: userModelSubscriptions.isActive,
      })
      .from(userModelSubscriptions)
      .where(and(
        eq(userModelSubscriptions.userId, userId),
        eq(userModelSubscriptions.isActive, true)
      ));

    if (subscriptions.length === 0) {
      return [];
    }

    const modelIds = subscriptions.map(s => s.modelId);
    
    const models = await db
      .select()
      .from(aiModels)
      .where(and(
        inArray(aiModels.id, modelIds),
        eq(aiModels.isActive, true)
      ))
      .orderBy(desc(aiModels.rating));

    return models;
  }

  // Market insights operations
  async getLatestMarketInsights(): Promise<MarketInsight[]> {
    return await db
      .select()
      .from(marketInsights)
      .orderBy(desc(marketInsights.timestamp))
      .limit(10);
  }

  async createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight> {
    const [newInsight] = await db
      .insert(marketInsights)
      .values(insight)
      .returning();
    return newInsight;
  }

  // Risk alerts operations
  async getUserRiskAlerts(userId: string): Promise<RiskAlert[]> {
    return await db
      .select()
      .from(riskAlerts)
      .where(eq(riskAlerts.userId, userId))
      .orderBy(desc(riskAlerts.createdAt))
      .limit(20);
  }

  async createRiskAlert(alert: InsertRiskAlert): Promise<RiskAlert> {
    const [newAlert] = await db
      .insert(riskAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async markAlertAsRead(alertId: number): Promise<void> {
    await db
      .update(riskAlerts)
      .set({ isRead: true })
      .where(eq(riskAlerts.id, alertId));
  }

  // Reports operations
  async getUserReports(userId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.lastUpdated));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db
      .insert(reports)
      .values(report)
      .returning();
    return newReport;
  }

  // Compliance operations implementation
  async getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return await db.select().from(complianceFrameworks).where(eq(complianceFrameworks.isActive, true));
  }

  async createComplianceFramework(framework: InsertComplianceFramework): Promise<ComplianceFramework> {
    const [newFramework] = await db
      .insert(complianceFrameworks)
      .values(framework)
      .returning();
    return newFramework;
  }

  async getUserComplianceChecks(userId: string): Promise<ComplianceCheck[]> {
    return await db.select().from(complianceChecks).where(eq(complianceChecks.userId, userId));
  }

  async createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck> {
    const [newCheck] = await db
      .insert(complianceChecks)
      .values(check)
      .returning();
    return newCheck;
  }

  async getUserAuditTrail(userId: string, limit: number = 100): Promise<AuditTrail[]> {
    return await db
      .select()
      .from(auditTrail)
      .where(eq(auditTrail.userId, userId))
      .orderBy(desc(auditTrail.timestamp))
      .limit(limit);
  }

  async createAuditEntry(entry: InsertAuditTrail): Promise<AuditTrail> {
    const [newEntry] = await db
      .insert(auditTrail)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getUserRegulatoryReports(userId: string): Promise<RegulatoryReport[]> {
    return await db.select().from(regulatoryReports).where(eq(regulatoryReports.userId, userId));
  }

  async createRegulatoryReport(report: InsertRegulatoryReport): Promise<RegulatoryReport> {
    const [newReport] = await db
      .insert(regulatoryReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getUserRiskLimits(userId: string): Promise<RiskLimit[]> {
    return await db.select().from(riskLimits).where(eq(riskLimits.userId, userId));
  }

  async createRiskLimit(limit: InsertRiskLimit): Promise<RiskLimit> {
    const [newLimit] = await db
      .insert(riskLimits)
      .values(limit)
      .returning();
    return newLimit;
  }

  async updateRiskLimit(limitId: number, updates: Partial<InsertRiskLimit>): Promise<RiskLimit> {
    const [updatedLimit] = await db
      .update(riskLimits)
      .set(updates)
      .where(eq(riskLimits.id, limitId))
      .returning();
    return updatedLimit;
  }

  async getUserComplianceDocuments(userId: string): Promise<ComplianceDocument[]> {
    return await db.select().from(complianceDocuments).where(eq(complianceDocuments.userId, userId));
  }

  async createComplianceDocument(document: InsertComplianceDocument): Promise<ComplianceDocument> {
    const [newDocument] = await db
      .insert(complianceDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  // AI Model Categories implementation
  async getAiModelCategories(): Promise<AiModelCategory[]> {
    return await db.select().from(aiModelCategories).where(eq(aiModelCategories.isActive, true)).orderBy(aiModelCategories.sortOrder);
  }

  async createAiModelCategory(category: InsertAiModelCategory): Promise<AiModelCategory> {
    const [newCategory] = await db
      .insert(aiModelCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getAiModelSubcategories(): Promise<AiModelSubcategory[]> {
    return await db.select().from(aiModelSubcategories).where(eq(aiModelSubcategories.isActive, true)).orderBy(aiModelSubcategories.sortOrder);
  }

  async getAiModelSubcategoriesByCategory(categoryId: number): Promise<AiModelSubcategory[]> {
    return await db.select().from(aiModelSubcategories)
      .where(and(eq(aiModelSubcategories.categoryId, categoryId), eq(aiModelSubcategories.isActive, true)))
      .orderBy(aiModelSubcategories.sortOrder);
  }

  async getAiModelSubcategoriesByCategoryName(categoryName: string): Promise<AiModelSubcategory[]> {
    const [category] = await db.select().from(aiModelCategories).where(eq(aiModelCategories.name, categoryName));
    if (!category) {
      return [];
    }
    return await db.select().from(aiModelSubcategories)
      .where(and(eq(aiModelSubcategories.categoryId, category.id), eq(aiModelSubcategories.isActive, true)))
      .orderBy(aiModelSubcategories.sortOrder);
  }

  async createAiModelSubcategory(subcategory: InsertAiModelSubcategory): Promise<AiModelSubcategory> {
    const [newSubcategory] = await db
      .insert(aiModelSubcategories)
      .values(subcategory)
      .returning();
    return newSubcategory;
  }

  async getAiModelsByCategory(categoryId: number): Promise<AiModel[]> {
    return await db.select().from(aiModels)
      .where(and(eq(aiModels.categoryId, categoryId), eq(aiModels.isActive, true)))
      .orderBy(desc(aiModels.isFeatured), desc(aiModels.rating));
  }

  async getAiModelsBySubcategory(subcategoryId: number): Promise<AiModel[]> {
    return await db.select().from(aiModels)
      .where(and(eq(aiModels.subcategoryId, subcategoryId), eq(aiModels.isActive, true)))
      .orderBy(desc(aiModels.isFeatured), desc(aiModels.rating));
  }

  async searchAiModels(filters: {
    category?: number;
    subcategory?: number;
    priceMin?: number;
    priceMax?: number;
    riskLevel?: string;
    aiTechnique?: string;
    targetUserType?: string;
    financialInstrument?: string;
    tags?: string[];
  }): Promise<AiModel[]> {
    let query = db.select().from(aiModels).where(eq(aiModels.isActive, true));
    
    const conditions = [eq(aiModels.isActive, true)];
    
    if (filters.category) {
      conditions.push(eq(aiModels.categoryId, filters.category));
    }
    
    if (filters.subcategory) {
      conditions.push(eq(aiModels.subcategoryId, filters.subcategory));
    }
    
    if (filters.priceMin !== undefined) {
      conditions.push(gte(aiModels.price, filters.priceMin.toString()));
    }
    
    if (filters.priceMax !== undefined) {
      conditions.push(lte(aiModels.price, filters.priceMax.toString()));
    }
    
    if (filters.riskLevel) {
      conditions.push(eq(aiModels.riskLevel, filters.riskLevel));
    }
    
    if (filters.aiTechnique) {
      conditions.push(eq(aiModels.aiTechnique, filters.aiTechnique));
    }
    
    if (filters.targetUserType) {
      conditions.push(eq(aiModels.targetUserType, filters.targetUserType));
    }
    
    if (filters.financialInstrument) {
      conditions.push(eq(aiModels.financialInstrument, filters.financialInstrument));
    }
    
    return await db.select().from(aiModels)
      .where(and(...conditions))
      .orderBy(desc(aiModels.isFeatured), desc(aiModels.rating));
  }

  // Developer Models operations
  async getAllDeveloperModels(): Promise<DeveloperModel[]> {
    return await db.select().from(developerModels)
      .orderBy(desc(developerModels.createdAt));
  }

  async getDeveloperModels(...statuses: string[]): Promise<DeveloperModel[]> {
    if (statuses.length === 0) {
      return this.getAllDeveloperModels();
    }
    
    return await db.select().from(developerModels)
      .where(inArray(developerModels.status, statuses))
      .orderBy(desc(developerModels.createdAt));
  }

  async getDeveloperModel(id: number): Promise<DeveloperModel | undefined> {
    const [model] = await db.select().from(developerModels)
      .where(eq(developerModels.id, id));
    return model;
  }

  async getDeveloperModelCategories(): Promise<string[]> {
    const result = await db.selectDistinct({ category: developerModels.category })
      .from(developerModels);
    return result.map(r => r.category);
  }

  async updateDeveloperModelFunding(modelId: number, newAmount: string): Promise<void> {
    await db.update(developerModels)
      .set({ fundingRaised: newAmount, updatedAt: new Date() })
      .where(eq(developerModels.id, modelId));
  }

  // Model Funding operations
  async createModelFunding(funding: InsertModelFunding): Promise<ModelFunding> {
    const [newFunding] = await db.insert(modelFunding)
      .values(funding)
      .returning();
    return newFunding;
  }

  async getUserModelFunding(userId: string): Promise<any[]> {
    try {
      return await db.select({
        id: modelFunding.id,
        modelId: modelFunding.modelId,
        investorId: modelFunding.investorId,
        amount: modelFunding.amount,
        status: modelFunding.status,
        createdAt: modelFunding.createdAt,
        updatedAt: modelFunding.updatedAt,
        modelName: developerModels.name,
        modelStatus: developerModels.status,
      })
      .from(modelFunding)
      .leftJoin(developerModels, eq(modelFunding.modelId, developerModels.id))
      .where(eq(modelFunding.investorId, userId))
      .orderBy(desc(modelFunding.createdAt));
    } catch (error) {
      console.error('Error fetching user model funding:', error);
      return []; // Return empty array if query fails
    }
  }

  // Placeholder implementations for missing methods
  async getModelComments(modelId: number): Promise<ModelComment[]> {
    return [];
  }

  async createModelComment(comment: InsertModelComment): Promise<ModelComment> {
    throw new Error("Method not implemented");
  }

  async getModelRatings(modelId: number): Promise<ModelRating[]> {
    return [];
  }

  async createModelRating(rating: InsertModelRating): Promise<ModelRating> {
    throw new Error("Method not implemented");
  }

  // Web3 Wallet operations
  async getUserWallets(userId: string): Promise<Web3Wallet[]> {
    return await db.select().from(web3Wallets).where(eq(web3Wallets.userId, userId));
  }

  async getWallet(walletId: number): Promise<Web3Wallet | undefined> {
    const [wallet] = await db.select().from(web3Wallets).where(eq(web3Wallets.id, walletId));
    return wallet;
  }

  async addWallet(wallet: InsertWeb3Wallet): Promise<Web3Wallet> {
    const [newWallet] = await db.insert(web3Wallets).values(wallet).returning();
    return newWallet;
  }

  async updateWallet(walletId: number, updates: Partial<InsertWeb3Wallet>): Promise<Web3Wallet> {
    const [updatedWallet] = await db
      .update(web3Wallets)
      .set(updates)
      .where(eq(web3Wallets.id, walletId))
      .returning();
    return updatedWallet;
  }

  async removeWallet(walletId: number): Promise<void> {
    await db.delete(web3Wallets).where(eq(web3Wallets.id, walletId));
  }

  // Crypto Holdings operations
  async getWalletHoldings(walletId: number): Promise<CryptoHolding[]> {
    return await db.select().from(cryptoHoldings).where(eq(cryptoHoldings.walletId, walletId));
  }

  async getUserCryptoHoldings(userId: string): Promise<CryptoHolding[]> {
    return await db.select().from(cryptoHoldings).where(eq(cryptoHoldings.userId, userId));
  }

  async addCryptoHolding(holding: InsertCryptoHolding): Promise<CryptoHolding> {
    const [newHolding] = await db.insert(cryptoHoldings).values(holding).returning();
    return newHolding;
  }

  async updateCryptoHolding(holdingId: number, updates: Partial<InsertCryptoHolding>): Promise<CryptoHolding> {
    const [updatedHolding] = await db
      .update(cryptoHoldings)
      .set(updates)
      .where(eq(cryptoHoldings.id, holdingId))
      .returning();
    return updatedHolding;
  }

  async removeCryptoHolding(holdingId: number): Promise<void> {
    await db.delete(cryptoHoldings).where(eq(cryptoHoldings.id, holdingId));
  }

  // DeFi Positions operations
  async getWalletDefiPositions(walletId: number): Promise<DefiPosition[]> {
    return await db.select().from(defiPositions).where(eq(defiPositions.walletId, walletId));
  }

  async getUserDefiPositions(userId: string): Promise<DefiPosition[]> {
    return await db.select().from(defiPositions).where(eq(defiPositions.userId, userId));
  }

  async addDefiPosition(position: InsertDefiPosition): Promise<DefiPosition> {
    const [newPosition] = await db.insert(defiPositions).values(position).returning();
    return newPosition;
  }

  async updateDefiPosition(positionId: number, updates: Partial<InsertDefiPosition>): Promise<DefiPosition> {
    const [updatedPosition] = await db
      .update(defiPositions)
      .set(updates)
      .where(eq(defiPositions.id, positionId))
      .returning();
    return updatedPosition;
  }

  async removeDefiPosition(positionId: number): Promise<void> {
    await db.delete(defiPositions).where(eq(defiPositions.id, positionId));
  }

  // DeFi Transactions operations
  async getWalletTransactions(walletId: number, limit: number = 50): Promise<DefiTransaction[]> {
    return await db
      .select()
      .from(defiTransactions)
      .where(eq(defiTransactions.walletId, walletId))
      .orderBy(desc(defiTransactions.timestamp))
      .limit(limit);
  }

  async getUserTransactions(userId: string, limit: number = 50): Promise<DefiTransaction[]> {
    return await db
      .select()
      .from(defiTransactions)
      .where(eq(defiTransactions.userId, userId))
      .orderBy(desc(defiTransactions.timestamp))
      .limit(limit);
  }

  async addTransaction(transaction: InsertDefiTransaction): Promise<DefiTransaction> {
    const [newTransaction] = await db.insert(defiTransactions).values(transaction).returning();
    return newTransaction;
  }

  // Yield Farming operations
  async getWalletYieldPositions(walletId: number): Promise<YieldFarmingPosition[]> {
    return await db.select().from(yieldFarmingPositions).where(eq(yieldFarmingPositions.walletId, walletId));
  }

  async getUserYieldPositions(userId: string): Promise<YieldFarmingPosition[]> {
    return await db.select().from(yieldFarmingPositions).where(eq(yieldFarmingPositions.userId, userId));
  }

  async addYieldPosition(position: InsertYieldFarmingPosition): Promise<YieldFarmingPosition> {
    const [newPosition] = await db.insert(yieldFarmingPositions).values(position).returning();
    return newPosition;
  }

  async updateYieldPosition(positionId: number, updates: Partial<InsertYieldFarmingPosition>): Promise<YieldFarmingPosition> {
    const [updatedPosition] = await db
      .update(yieldFarmingPositions)
      .set(updates)
      .where(eq(yieldFarmingPositions.id, positionId))
      .returning();
    return updatedPosition;
  }

  // NFT Holdings operations
  async getWalletNFTs(walletId: number): Promise<NftHolding[]> {
    return await db.select().from(nftHoldings).where(eq(nftHoldings.walletId, walletId));
  }

  async getUserNFTs(userId: string): Promise<NftHolding[]> {
    return await db.select().from(nftHoldings).where(eq(nftHoldings.userId, userId));
  }

  async addNFT(nft: InsertNftHolding): Promise<NftHolding> {
    const [newNFT] = await db.insert(nftHoldings).values(nft).returning();
    return newNFT;
  }

  async updateNFT(nftId: number, updates: Partial<InsertNftHolding>): Promise<NftHolding> {
    const [updatedNFT] = await db
      .update(nftHoldings)
      .set(updates)
      .where(eq(nftHoldings.id, nftId))
      .returning();
    return updatedNFT;
  }

  // Bot Funding operations
  async getAllBotFundingRequests(): Promise<BotFundingRequest[]> {
    return await db.select()
      .from(botFundingRequests)
      .orderBy(desc(botFundingRequests.createdAt));
  }

  async getBotFundingRequest(id: number): Promise<BotFundingRequest | undefined> {
    const [request] = await db.select()
      .from(botFundingRequests)
      .where(eq(botFundingRequests.id, id));
    return request;
  }

  async createBotFundingRequest(request: InsertBotFundingRequest): Promise<BotFundingRequest> {
    const [newRequest] = await db.insert(botFundingRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getUserBotFundingRequests(userId: string): Promise<BotFundingRequest[]> {
    return await db.select()
      .from(botFundingRequests)
      .where(eq(botFundingRequests.developerId, userId))
      .orderBy(desc(botFundingRequests.createdAt));
  }

  async createBotFundingContribution(contribution: InsertBotFundingContribution): Promise<BotFundingContribution> {
    const [newContribution] = await db.insert(botFundingContributions)
      .values(contribution)
      .returning();
    
    // Update the funding raised amount
    const request = await this.getBotFundingRequest(contribution.requestId);
    if (request) {
      const newRaised = parseFloat(request.fundingRaised) + parseFloat(contribution.amount);
      await db.update(botFundingRequests)
        .set({ 
          fundingRaised: newRaised.toString(),
          updatedAt: new Date()
        })
        .where(eq(botFundingRequests.id, contribution.requestId));
    }
    
    return newContribution;
  }

  async getUserBotFundingContributions(userId: string): Promise<any[]> {
    return await db.select({
      id: botFundingContributions.id,
      requestId: botFundingContributions.requestId,
      amount: botFundingContributions.amount,
      message: botFundingContributions.message,
      status: botFundingContributions.status,
      createdAt: botFundingContributions.createdAt,
      requestTitle: botFundingRequests.title,
      requestStatus: botFundingRequests.status,
    })
    .from(botFundingContributions)
    .leftJoin(botFundingRequests, eq(botFundingContributions.requestId, botFundingRequests.id))
    .where(eq(botFundingContributions.contributorId, userId))
    .orderBy(desc(botFundingContributions.createdAt));
  }

  async getBotFundingRequestWithContributions(requestId: number): Promise<any> {
    const request = await this.getBotFundingRequest(requestId);
    if (!request) return null;

    const contributions = await db.select()
      .from(botFundingContributions)
      .where(eq(botFundingContributions.requestId, requestId));

    return {
      ...request,
      contributions
    };
  }

  // Data Provider operations
  async createDataProvider(provider: InsertDataProvider): Promise<DataProvider> {
    const [newProvider] = await db.insert(dataProviders).values(provider).returning();
    return newProvider;
  }

  async getDataProvider(userId: string): Promise<DataProvider | undefined> {
    const [provider] = await db.select().from(dataProviders).where(eq(dataProviders.userId, userId));
    return provider;
  }

  async updateDataProvider(id: number, updates: Partial<InsertDataProvider>): Promise<DataProvider> {
    const [provider] = await db
      .update(dataProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dataProviders.id, id))
      .returning();
    return provider;
  }

  // Dataset operations
  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const [newDataset] = await db.insert(datasets).values(dataset).returning();
    return newDataset;
  }

  async getDatasets(providerId?: number, category?: string): Promise<Dataset[]> {
    let query = db.select().from(datasets);
    
    if (providerId) {
      query = query.where(eq(datasets.providerId, providerId));
    }
    
    if (category) {
      query = query.where(eq(datasets.category, category));
    }
    
    return await query.orderBy(desc(datasets.createdAt));
  }

  async getDatasetById(id: number): Promise<Dataset | undefined> {
    const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
    return dataset;
  }

  async updateDataset(id: number, updates: Partial<InsertDataset>): Promise<Dataset> {
    const [dataset] = await db
      .update(datasets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(datasets.id, id))
      .returning();
    return dataset;
  }

  async deleteDataset(id: number): Promise<void> {
    await db.delete(datasets).where(eq(datasets.id, id));
  }

  // Dataset usage operations
  async recordDatasetUsage(usage: InsertDatasetUsage): Promise<DatasetUsage> {
    const [newUsage] = await db.insert(datasetUsage).values(usage).returning();
    return newUsage;
  }

  async getDatasetUsage(datasetId: number, userId?: string): Promise<DatasetUsage[]> {
    let query = db.select().from(datasetUsage).where(eq(datasetUsage.datasetId, datasetId));
    
    if (userId) {
      query = query.where(eq(datasetUsage.userId, userId));
    }
    
    return await query.orderBy(desc(datasetUsage.timestamp));
  }

  // Dataset subscription operations
  async createDatasetSubscription(subscription: InsertDatasetSubscription): Promise<DatasetSubscription> {
    const [newSubscription] = await db.insert(datasetSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async getDatasetSubscriptions(userId: string): Promise<DatasetSubscription[]> {
    return await db.select().from(datasetSubscriptions)
      .where(eq(datasetSubscriptions.userId, userId))
      .orderBy(desc(datasetSubscriptions.createdAt));
  }

  async updateDatasetSubscription(id: number, updates: Partial<InsertDatasetSubscription>): Promise<DatasetSubscription> {
    const [subscription] = await db
      .update(datasetSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(datasetSubscriptions.id, id))
      .returning();
    return subscription;
  }

  // Data quality operations
  async updateDataQualityMetrics(metrics: InsertDataQualityMetrics): Promise<DataQualityMetrics> {
    const [qualityMetrics] = await db
      .insert(dataQualityMetrics)
      .values(metrics)
      .onConflictDoUpdate({
        target: dataQualityMetrics.datasetId,
        set: { ...metrics, lastUpdated: new Date() },
      })
      .returning();
    return qualityMetrics;
  }

  async getDataQualityMetrics(datasetId: number): Promise<DataQualityMetrics | undefined> {
    const [metrics] = await db.select().from(dataQualityMetrics).where(eq(dataQualityMetrics.datasetId, datasetId));
    return metrics;
  }

  // Data collaboration operations
  async createDataCollaboration(collaboration: InsertDataCollaboration): Promise<DataCollaboration> {
    const [newCollaboration] = await db.insert(dataCollaborations).values(collaboration).returning();
    return newCollaboration;
  }

  async getDataCollaborations(providerId?: number, developerId?: string): Promise<DataCollaboration[]> {
    let query = db.select().from(dataCollaborations);
    
    if (providerId) {
      query = query.where(eq(dataCollaborations.providerId, providerId));
    }
    
    if (developerId) {
      query = query.where(eq(dataCollaborations.modelDeveloperId, developerId));
    }
    
    return await query.orderBy(desc(dataCollaborations.createdAt));
  }

  async updateDataCollaboration(id: number, updates: Partial<InsertDataCollaboration>): Promise<DataCollaboration> {
    const [collaboration] = await db
      .update(dataCollaborations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dataCollaborations.id, id))
      .returning();
    return collaboration;
  }

  // Dataset review operations
  async createDatasetReview(review: InsertDatasetReview): Promise<DatasetReview> {
    const [newReview] = await db.insert(datasetReviews).values(review).returning();
    return newReview;
  }

  async getDatasetReviews(datasetId: number): Promise<DatasetReview[]> {
    return await db.select().from(datasetReviews)
      .where(eq(datasetReviews.datasetId, datasetId))
      .orderBy(desc(datasetReviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
