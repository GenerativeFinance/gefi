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

export const modelComments = pgTable("model_comments", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modelRatings = pgTable("model_ratings", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Developer Dashboard Tables
export const developerModels = pgTable("developer_models", {
  id: serial("id").primaryKey(),
  developerId: varchar("developer_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, submitted, approved, rejected, testing, deployed
  fundingGoal: decimal("funding_goal", { precision: 12, scale: 2 }).notNull(),
  fundingRaised: decimal("funding_raised", { precision: 12, scale: 2 }).notNull().default("0.00"),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array().default([]),
  githubRepo: varchar("github_repo", { length: 255 }),
  apiEndpoint: varchar("api_endpoint", { length: 255 }),
  deploymentUrl: varchar("deployment_url", { length: 255 }),
  fileUrl: varchar("file_url", { length: 255 }),
  fileName: varchar("file_name", { length: 255 }),
  testResults: jsonb("test_results"),
  performanceMetrics: jsonb("performance_metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modelFunding = pgTable("model_funding", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  investorId: varchar("investor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  stake: decimal("stake", { precision: 5, scale: 2 }), // percentage stake
  status: varchar("status", { length: 50 }).notNull().default("pledged"), // pledged, confirmed, refunded
  transactionId: varchar("transaction_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modelCollaborators = pgTable("model_collaborators", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).notNull(), // owner, collaborator, tester
  permissions: text("permissions").array().default([]), // read, write, deploy, admin
  invitedAt: timestamp("invited_at").defaultNow(),
  joinedAt: timestamp("joined_at"),
  status: varchar("status", { length: 50 }).notNull().default("invited"), // invited, active, inactive
});

export const modelVersions = pgTable("model_versions", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  version: varchar("version", { length: 50 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 255 }),
  fileName: varchar("file_name", { length: 255 }),
  changes: text("changes"),
  commitHash: varchar("commit_hash", { length: 255 }),
  testResults: jsonb("test_results"),
  deployedAt: timestamp("deployed_at"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modelTests = pgTable("model_tests", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  testerId: varchar("tester_id").notNull().references(() => users.id),
  testType: varchar("test_type", { length: 50 }).notNull(), // unit, integration, performance, security
  status: varchar("status", { length: 50 }).notNull(), // pending, running, passed, failed
  results: jsonb("results"),
  feedback: text("feedback"),
  score: integer("score"), // 1-100
  duration: integer("duration"), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const modelChat = pgTable("model_chat", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  messageType: varchar("message_type", { length: 50 }).notNull().default("text"), // text, file, code, issue
  parentId: integer("parent_id").references(() => modelChat.id),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modelRewards = pgTable("model_rewards", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(), // funding_stake, bonus_points, revenue_share
  amount: decimal("amount", { precision: 12, scale: 2 }),
  points: integer("points"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, active, claimed, expired
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  claimedAt: timestamp("claimed_at"),
});

// Backtesting Environment Tables
export const backtests = pgTable("backtests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  modelId: integer("model_id").notNull().references(() => developerModels.id),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("running"), // running, completed, failed, stopped
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialCapital: decimal("initial_capital", { precision: 15, scale: 2 }).notNull(),
  finalValue: decimal("final_value", { precision: 15, scale: 2 }),
  totalReturn: decimal("total_return", { precision: 8, scale: 6 }),
  annualizedReturn: decimal("annualized_return", { precision: 8, scale: 6 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 6 }),
  volatility: decimal("volatility", { precision: 8, scale: 6 }),
  winRate: decimal("win_rate", { precision: 8, scale: 6 }),
  profitFactor: decimal("profit_factor", { precision: 8, scale: 4 }),
  benchmark: varchar("benchmark", { length: 50 }).notNull(),
  commission: decimal("commission", { precision: 8, scale: 6 }).notNull().default("0.001"),
  slippage: decimal("slippage", { precision: 8, scale: 6 }).notNull().default("0.0005"),
  riskFreeRate: decimal("risk_free_rate", { precision: 8, scale: 6 }).notNull().default("0.02"),
  metrics: jsonb("metrics"), // Additional metrics like beta, alpha, etc.
  config: jsonb("config"), // Backtest configuration parameters
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const backtestTrades = pgTable("backtest_trades", {
  id: serial("id").primaryKey(),
  backtestId: integer("backtest_id").notNull().references(() => backtests.id),
  tradeDate: timestamp("trade_date").notNull(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  action: varchar("action", { length: 10 }).notNull(), // buy, sell
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  price: decimal("price", { precision: 15, scale: 6 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 15, scale: 6 }).notNull(),
  slippage: decimal("slippage", { precision: 15, scale: 6 }).notNull(),
  pnl: decimal("pnl", { precision: 15, scale: 2 }),
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).notNull(),
  signal: varchar("signal", { length: 255 }), // AI model signal that triggered the trade
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // Model confidence level
  createdAt: timestamp("created_at").defaultNow(),
});

export const backtestPerformance = pgTable("backtest_performance", {
  id: serial("id").primaryKey(),
  backtestId: integer("backtest_id").notNull().references(() => backtests.id),
  date: timestamp("date").notNull(),
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).notNull(),
  benchmarkValue: decimal("benchmark_value", { precision: 15, scale: 2 }).notNull(),
  dailyReturn: decimal("daily_return", { precision: 8, scale: 6 }),
  cumulativeReturn: decimal("cumulative_return", { precision: 8, scale: 6 }),
  drawdown: decimal("drawdown", { precision: 8, scale: 6 }),
  volatility: decimal("volatility", { precision: 8, scale: 6 }),
  cashPosition: decimal("cash_position", { precision: 15, scale: 2 }).notNull(),
  positionsValue: decimal("positions_value", { precision: 15, scale: 2 }).notNull(),
  exposure: decimal("exposure", { precision: 5, scale: 4 }), // Market exposure percentage
  createdAt: timestamp("created_at").defaultNow(),
});

export const backtestPositions = pgTable("backtest_positions", {
  id: serial("id").primaryKey(),
  backtestId: integer("backtest_id").notNull().references(() => backtests.id),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  avgPrice: decimal("avg_price", { precision: 15, scale: 6 }).notNull(),
  currentPrice: decimal("current_price", { precision: 15, scale: 6 }),
  marketValue: decimal("market_value", { precision: 15, scale: 2 }),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 15, scale: 2 }),
  realizedPnl: decimal("realized_pnl", { precision: 15, scale: 2 }),
  openDate: timestamp("open_date").notNull(),
  closeDate: timestamp("close_date"),
  status: varchar("status", { length: 20 }).notNull().default("open"), // open, closed
  sector: varchar("sector", { length: 100 }),
  marketCap: varchar("market_cap", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export type ModelComment = typeof modelComments.$inferSelect;
export type InsertModelComment = typeof modelComments.$inferInsert;
export type ModelRating = typeof modelRatings.$inferSelect;
export type InsertModelRating = typeof modelRatings.$inferInsert;

// Developer Dashboard Types
export type DeveloperModel = typeof developerModels.$inferSelect;
export type InsertDeveloperModel = typeof developerModels.$inferInsert;
export type ModelFunding = typeof modelFunding.$inferSelect;
export type InsertModelFunding = typeof modelFunding.$inferInsert;
export type ModelCollaborator = typeof modelCollaborators.$inferSelect;
export type InsertModelCollaborator = typeof modelCollaborators.$inferInsert;
export type ModelVersion = typeof modelVersions.$inferSelect;
export type InsertModelVersion = typeof modelVersions.$inferInsert;
export type ModelTest = typeof modelTests.$inferSelect;
export type InsertModelTest = typeof modelTests.$inferInsert;
export type ModelChatMessage = typeof modelChat.$inferSelect;
export type InsertModelChatMessage = typeof modelChat.$inferInsert;
export type ModelReward = typeof modelRewards.$inferSelect;
export type InsertModelReward = typeof modelRewards.$inferInsert;

// Backtesting Types
export type Backtest = typeof backtests.$inferSelect;
export type InsertBacktest = typeof backtests.$inferInsert;
export type BacktestTrade = typeof backtestTrades.$inferSelect;
export type InsertBacktestTrade = typeof backtestTrades.$inferInsert;
export type BacktestPerformance = typeof backtestPerformance.$inferSelect;
export type InsertBacktestPerformance = typeof backtestPerformance.$inferInsert;
export type BacktestPosition = typeof backtestPositions.$inferSelect;
export type InsertBacktestPosition = typeof backtestPositions.$inferInsert;

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
