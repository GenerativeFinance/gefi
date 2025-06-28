import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalInvestment: decimal("total_investment", { precision: 12, scale: 2 }).notNull(),
  livePnL: decimal("live_pnl", { precision: 12, scale: 2 }).notNull(),
  annualReturns: decimal("annual_returns", { precision: 5, scale: 2 }).notNull(),
  sharpeRatio: decimal("sharpe_ratio", { precision: 4, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioAssets = pgTable("portfolio_assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  symbol: varchar("symbol").notNull(),
  assetType: varchar("asset_type").notNull(), // 'Stock', 'Bond', 'ETF', 'Crypto', 'REIT', 'Commodity'
  allocation: decimal("allocation", { precision: 5, scale: 2 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }).notNull(),
  quantity: decimal("quantity", { precision: 16, scale: 8 }).notNull(),
});

// AI Model Categories and Subcategories
export const aiModelCategories = pgTable("ai_model_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  icon: varchar("icon"), // Lucide icon name
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const aiModelSubcategories = pgTable("ai_model_subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => aiModelCategories.id),
  name: varchar("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // Keep for backward compatibility
  categoryId: integer("category_id").references(() => aiModelCategories.id),
  subcategoryId: integer("subcategory_id").references(() => aiModelSubcategories.id),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  creator: varchar("creator").notNull(),
  isActive: boolean("is_active").default(true),
  features: jsonb("features"),
  performance: jsonb("performance"),
  // Enhanced categorization fields
  tags: text("tags").array(), // Additional tags for filtering
  aiTechnique: varchar("ai_technique"), // ML, Deep Learning, NLP, etc.
  targetUserType: varchar("target_user_type"), // Retail Banking, Investment Banking, etc.
  financialInstrument: varchar("financial_instrument"), // Equities, Fixed Income, etc.
  riskLevel: varchar("risk_level"), // Low, Medium, High
  minInvestment: decimal("min_investment", { precision: 12, scale: 2 }),
  dataRequirements: text("data_requirements").array(),
  supportedRegions: text("supported_regions").array(),
  complianceFrameworks: text("compliance_frameworks").array(), // BASEL III, MiFID II, etc.
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userModelSubscriptions = pgTable("user_model_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const portfolioAiModels = pgTable("portfolio_ai_models", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  modelType: varchar("model_type").notNull(), // 'conservative', 'aggressive'
  modelName: varchar("model_name").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  performance: decimal("performance", { precision: 5, scale: 2 }).default("0"),
});

export const marketInsights = pgTable("market_insights", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // 'sentiment', 'macroeconomic', 'fed_prediction'
  title: varchar("title").notNull(),
  value: varchar("value"),
  trend: varchar("trend"), // 'up', 'down', 'stable'
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const riskAlerts = pgTable("risk_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // 'warning', 'error', 'info'
  title: varchar("title").notNull(),
  description: text("description"),
  severity: varchar("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // 'monthly_performance', 'risk_compliance', 'portfolio_optimization'
  title: varchar("title").notNull(),
  status: varchar("status").notNull(), // 'generated', 'pending', 'failed'
  lastUpdated: timestamp("last_updated").defaultNow(),
  metadata: jsonb("metadata"),
});

// Compliance and Regulatory Reporting Tables
export const complianceFrameworks = pgTable("compliance_frameworks", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // 'GDPR', 'SOX', 'MiFID II', 'BASEL III'
  version: varchar("version").notNull(),
  description: text("description"),
  requirements: text("requirements").array(), // JSON array of requirement descriptions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const complianceChecks = pgTable("compliance_checks", {
  id: serial("id").primaryKey(),
  frameworkId: integer("framework_id").references(() => complianceFrameworks.id),
  userId: varchar("user_id").notNull(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id),
  checkType: varchar("check_type").notNull(), // 'risk_limit', 'diversification', 'liquidity', 'concentration'
  status: varchar("status").notNull(), // 'compliant', 'warning', 'violation'
  details: text("details"),
  threshold: decimal("threshold", { precision: 10, scale: 4 }),
  currentValue: decimal("current_value", { precision: 10, scale: 4 }),
  lastChecked: timestamp("last_checked").defaultNow(),
  nextCheckDue: timestamp("next_check_due"),
});

export const auditTrail = pgTable("audit_trail", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  entityType: varchar("entity_type").notNull(), // 'portfolio', 'trade', 'user', 'compliance'
  entityId: varchar("entity_id").notNull(),
  action: varchar("action").notNull(), // 'create', 'update', 'delete', 'trade', 'compliance_check'
  oldValues: text("old_values"), // JSON
  newValues: text("new_values"), // JSON
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  riskScore: integer("risk_score"), // 1-100
});

export const regulatoryReports = pgTable("regulatory_reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  reportType: varchar("report_type").notNull(), // 'daily_risk', 'monthly_summary', 'quarterly_filing'
  frameworkId: integer("framework_id").references(() => complianceFrameworks.id),
  reportData: text("report_data"), // JSON formatted report
  filePath: varchar("file_path"), // for PDF/Excel exports
  status: varchar("status").notNull().default("pending"), // 'pending', 'generated', 'submitted', 'approved'
  generatedAt: timestamp("generated_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
});

export const riskLimits = pgTable("risk_limits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id),
  limitType: varchar("limit_type").notNull(), // 'var', 'concentration', 'sector', 'geography', 'leverage'
  limitValue: decimal("limit_value", { precision: 10, scale: 4 }),
  currentValue: decimal("current_value", { precision: 10, scale: 4 }),
  utilizationPercentage: decimal("utilization_percentage", { precision: 5, scale: 2 }),
  isBreached: boolean("is_breached").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
  alertThreshold: decimal("alert_threshold", { precision: 5, scale: 2 }).default("80.00"), // Alert at 80% utilization
});

export const complianceDocuments = pgTable("compliance_documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  documentType: varchar("document_type").notNull(), // 'policy', 'procedure', 'certification', 'audit_report'
  title: varchar("title").notNull(),
  description: text("description"),
  filePath: varchar("file_path"),
  version: varchar("version"),
  expiryDate: timestamp("expiry_date"),
  status: varchar("status").notNull().default("active"), // 'active', 'expired', 'pending_review'
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  lastReviewed: timestamp("last_reviewed"),
  reviewedBy: varchar("reviewed_by"),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = typeof portfolios.$inferInsert;
export type PortfolioAsset = typeof portfolioAssets.$inferSelect;
export type InsertPortfolioAsset = typeof portfolioAssets.$inferInsert;
export type AiModel = typeof aiModels.$inferSelect;
export type InsertAiModel = typeof aiModels.$inferInsert;
export type UserModelSubscription = typeof userModelSubscriptions.$inferSelect;
export type InsertUserModelSubscription = typeof userModelSubscriptions.$inferInsert;
export type PortfolioAiModel = typeof portfolioAiModels.$inferSelect;
export type InsertPortfolioAiModel = typeof portfolioAiModels.$inferInsert;
export type MarketInsight = typeof marketInsights.$inferSelect;
export type InsertMarketInsight = typeof marketInsights.$inferInsert;
export type RiskAlert = typeof riskAlerts.$inferSelect;
export type InsertRiskAlert = typeof riskAlerts.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type InsertComplianceFramework = typeof complianceFrameworks.$inferInsert;
export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertComplianceCheck = typeof complianceChecks.$inferInsert;
export type AuditTrail = typeof auditTrail.$inferSelect;
export type InsertAuditTrail = typeof auditTrail.$inferInsert;
export type RegulatoryReport = typeof regulatoryReports.$inferSelect;
export type InsertRegulatoryReport = typeof regulatoryReports.$inferInsert;
export type RiskLimit = typeof riskLimits.$inferSelect;
export type InsertRiskLimit = typeof riskLimits.$inferInsert;
export type ComplianceDocument = typeof complianceDocuments.$inferSelect;
export type InsertComplianceDocument = typeof complianceDocuments.$inferInsert;
export type AiModelCategory = typeof aiModelCategories.$inferSelect;
export type InsertAiModelCategory = typeof aiModelCategories.$inferInsert;
export type AiModelSubcategory = typeof aiModelSubcategories.$inferSelect;
export type InsertAiModelSubcategory = typeof aiModelSubcategories.$inferInsert;

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiModelSchema = createInsertSchema(aiModels).omit({
  id: true,
  createdAt: true,
});

export const insertRiskAlertSchema = createInsertSchema(riskAlerts).omit({
  id: true,
  createdAt: true,
});
