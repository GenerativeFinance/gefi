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
  type User,
  type UpsertUser,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
    return await db
      .select()
      .from(aiModels)
      .where(eq(aiModels.isActive, true))
      .orderBy(desc(aiModels.rating));
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
}

export const storage = new DatabaseStorage();
