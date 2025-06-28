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
  smartContracts,
  contractInvestments,
  revenueDistributions,
  userTokenBalances,
  blockchainTransactions,
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
  type SmartContract,
  type InsertSmartContract,
  type ContractInvestment,
  type InsertContractInvestment,
  type RevenueDistribution,
  type InsertRevenueDistribution,
  type UserTokenBalance,
  type InsertUserTokenBalance,
  type BlockchainTransaction,
  type InsertBlockchainTransaction,
  aiModelCategories,
  aiModelSubcategories,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

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
  
  // AI Model Categories operations
  getAiModelCategories(): Promise<AiModelCategory[]>;
  createAiModelCategory(category: InsertAiModelCategory): Promise<AiModelCategory>;
  getAiModelSubcategories(): Promise<AiModelSubcategory[]>;
  getAiModelSubcategoriesByCategory(categoryId: number): Promise<AiModelSubcategory[]>;
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
  
  // Smart Contract operations
  getAllSmartContracts(): Promise<SmartContract[]>;
  getSmartContract(id: number): Promise<SmartContract | undefined>;
  getSmartContractByAddress(address: string): Promise<SmartContract | undefined>;
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  updateSmartContract(id: number, updates: Partial<InsertSmartContract>): Promise<SmartContract>;
  getUserSmartContracts(userId: string): Promise<SmartContract[]>;
  
  // Investment operations
  getContractInvestments(contractId: number): Promise<ContractInvestment[]>;
  getUserInvestments(userId: string): Promise<ContractInvestment[]>;
  createInvestment(investment: InsertContractInvestment): Promise<ContractInvestment>;
  updateInvestmentStatus(id: number, status: string, transactionHash?: string): Promise<ContractInvestment>;
  
  // Revenue distribution operations
  getRevenueDistributions(contractId: number): Promise<RevenueDistribution[]>;
  createRevenueDistribution(distribution: InsertRevenueDistribution): Promise<RevenueDistribution>;
  
  // Token balance operations
  getUserTokenBalances(userId: string): Promise<UserTokenBalance[]>;
  getTokenBalance(userId: string, contractId: number): Promise<UserTokenBalance | undefined>;
  updateTokenBalance(userId: string, contractId: number, balance: string): Promise<UserTokenBalance>;
  
  // Blockchain transaction operations
  getUserTransactions(userId: string): Promise<BlockchainTransaction[]>;
  createTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction>;
  updateTransactionStatus(hash: string, status: string, blockNumber?: number): Promise<BlockchainTransaction>;
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

  // Smart Contract operations
  async getAllSmartContracts(): Promise<SmartContract[]> {
    return await db.select().from(smartContracts).orderBy(desc(smartContracts.createdAt));
  }

  async getSmartContract(id: number): Promise<SmartContract | undefined> {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.id, id));
    return contract;
  }

  async getSmartContractByAddress(address: string): Promise<SmartContract | undefined> {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.contractAddress, address));
    return contract;
  }

  async createSmartContract(contract: InsertSmartContract): Promise<SmartContract> {
    const [newContract] = await db.insert(smartContracts).values(contract).returning();
    return newContract;
  }

  async updateSmartContract(id: number, updates: Partial<InsertSmartContract>): Promise<SmartContract> {
    const [updatedContract] = await db.update(smartContracts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smartContracts.id, id))
      .returning();
    return updatedContract;
  }

  async getUserSmartContracts(userId: string): Promise<SmartContract[]> {
    return await db.select().from(smartContracts)
      .where(eq(smartContracts.creatorId, userId))
      .orderBy(desc(smartContracts.createdAt));
  }

  // Investment operations
  async getContractInvestments(contractId: number): Promise<ContractInvestment[]> {
    return await db.select().from(contractInvestments)
      .where(eq(contractInvestments.contractId, contractId))
      .orderBy(desc(contractInvestments.investedAt));
  }

  async getUserInvestments(userId: string): Promise<ContractInvestment[]> {
    return await db.select().from(contractInvestments)
      .where(eq(contractInvestments.investorId, userId))
      .orderBy(desc(contractInvestments.investedAt));
  }

  async createInvestment(investment: InsertContractInvestment): Promise<ContractInvestment> {
    const [newInvestment] = await db.insert(contractInvestments).values(investment).returning();
    return newInvestment;
  }

  async updateInvestmentStatus(id: number, status: string, transactionHash?: string): Promise<ContractInvestment> {
    const updates: Partial<InsertContractInvestment> = { status };
    if (transactionHash) {
      updates.transactionHash = transactionHash;
    }
    const [updatedInvestment] = await db.update(contractInvestments)
      .set(updates)
      .where(eq(contractInvestments.id, id))
      .returning();
    return updatedInvestment;
  }

  // Revenue distribution operations
  async getRevenueDistributions(contractId: number): Promise<RevenueDistribution[]> {
    return await db.select().from(revenueDistributions)
      .where(eq(revenueDistributions.contractId, contractId))
      .orderBy(desc(revenueDistributions.distributedAt));
  }

  async createRevenueDistribution(distribution: InsertRevenueDistribution): Promise<RevenueDistribution> {
    const [newDistribution] = await db.insert(revenueDistributions).values(distribution).returning();
    return newDistribution;
  }

  // Token balance operations
  async getUserTokenBalances(userId: string): Promise<UserTokenBalance[]> {
    return await db.select().from(userTokenBalances)
      .where(eq(userTokenBalances.userId, userId))
      .orderBy(desc(userTokenBalances.updatedAt));
  }

  async getTokenBalance(userId: string, contractId: number): Promise<UserTokenBalance | undefined> {
    const [balance] = await db.select().from(userTokenBalances)
      .where(and(
        eq(userTokenBalances.userId, userId),
        eq(userTokenBalances.contractId, contractId)
      ));
    return balance;
  }

  async updateTokenBalance(userId: string, contractId: number, balance: string): Promise<UserTokenBalance> {
    const existing = await this.getTokenBalance(userId, contractId);
    if (existing) {
      const [updated] = await db.update(userTokenBalances)
        .set({ tokenBalance: balance, updatedAt: new Date() })
        .where(and(
          eq(userTokenBalances.userId, userId),
          eq(userTokenBalances.contractId, contractId)
        ))
        .returning();
      return updated;
    } else {
      const [newBalance] = await db.insert(userTokenBalances)
        .values({ userId, contractId, tokenBalance: balance })
        .returning();
      return newBalance;
    }
  }

  // Blockchain transaction operations
  async getUserTransactions(userId: string): Promise<BlockchainTransaction[]> {
    return await db.select().from(blockchainTransactions)
      .where(eq(blockchainTransactions.userId, userId))
      .orderBy(desc(blockchainTransactions.createdAt));
  }

  async createTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const [newTransaction] = await db.insert(blockchainTransactions).values(transaction).returning();
    return newTransaction;
  }

  async updateTransactionStatus(hash: string, status: string, blockNumber?: number): Promise<BlockchainTransaction> {
    const updates: Partial<InsertBlockchainTransaction> = { 
      status,
      confirmedAt: status === 'confirmed' ? new Date() : undefined
    };
    if (blockNumber) {
      updates.blockNumber = blockNumber;
    }
    const [updatedTransaction] = await db.update(blockchainTransactions)
      .set(updates)
      .where(eq(blockchainTransactions.transactionHash, hash))
      .returning();
    return updatedTransaction;
  }
}

export const storage = new DatabaseStorage();
