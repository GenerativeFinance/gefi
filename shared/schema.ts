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
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  plan: varchar("plan").notNull().default("monthly"), // 'monthly', 'yearly'
  status: varchar("status").notNull().default("active"), // 'active', 'cancelled', 'expired', 'paused'
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  renewalDate: timestamp("renewal_date").notNull(),
  lastPaymentDate: timestamp("last_payment_date"),
  cancelledAt: timestamp("cancelled_at"),
  pausedAt: timestamp("paused_at"),
  totalUsageHours: decimal("total_usage_hours", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
});

export const modelUsageHistory = pgTable("model_usage_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => userModelSubscriptions.id),
  sessionDuration: decimal("session_duration", { precision: 10, scale: 2 }).notNull(), // in hours
  performanceResult: decimal("performance_result", { precision: 8, scale: 4 }),
  profitLoss: decimal("profit_loss", { precision: 12, scale: 2 }),
  usageType: varchar("usage_type").notNull(), // 'backtesting', 'live_trading', 'analysis'
  sessionStarted: timestamp("session_started").notNull(),
  sessionEnded: timestamp("session_ended"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Bounty system tables
export const bounties = pgTable("bounties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull(), // beginner, intermediate, advanced, expert
  category: varchar("category", { length: 100 }).notNull(),
  requirements: text("requirements").array().default([]),
  status: varchar("status", { length: 50 }).notNull().default("open"), // open, claimed, in_progress, completed, expired
  deadline: timestamp("deadline"),
  claimedBy: varchar("claimed_by").references(() => users.id),
  completedBy: varchar("completed_by").references(() => users.id),
  submissionCount: integer("submission_count").default(0),
  teamAllowed: boolean("team_allowed").default(false),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const bountySubmissions = pgTable("bounty_submissions", {
  id: serial("id").primaryKey(),
  bountyId: integer("bounty_id").notNull().references(() => bounties.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  solutionUrl: varchar("solution_url", { length: 500 }),
  githubUrl: varchar("github_url", { length: 500 }),
  demoUrl: varchar("demo_url", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default("submitted"), // submitted, under_review, approved, rejected
  feedback: text("feedback"),
  score: integer("score"), // 1-100
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Bounty funding requests and management
export const bountyFundingRequests = pgTable("bounty_funding_requests", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  fundingRequired: decimal("funding_required", { precision: 12, scale: 2 }).notNull(),
  fundingRaised: decimal("funding_raised", { precision: 12, scale: 2 }).default("0.00"),
  timeline: varchar("timeline", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull(), // beginner, intermediate, advanced, expert
  skills: text("skills").array().default([]),
  deliverables: text("deliverables").array().default([]),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, submitted, approved, funded, in_progress, completed, rejected
  estimatedReward: decimal("estimated_reward", { precision: 12, scale: 2 }),
  developerName: varchar("developer_name", { length: 255 }),
  submitterId: varchar("submitter_id").notNull().references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  backers: integer("backers").default(0),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  fundedAt: timestamp("funded_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bountyFundingContributions = pgTable("bounty_funding_contributions", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => bountyFundingRequests.id),
  contributorId: varchar("contributor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, refunded, claimed
  contributedAt: timestamp("contributed_at").defaultNow(),
  claimedAt: timestamp("claimed_at"),
});

// User profiles and performance tracking
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  displayName: varchar("display_name", { length: 255 }),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 500 }),
  githubUsername: varchar("github_username", { length: 255 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  skills: text("skills").array().default([]),
  specializations: text("specializations").array().default([]),
  yearsExperience: integer("years_experience"),
  
  // Profile setup fields
  company: varchar("company"),
  jobTitle: varchar("job_title"),
  investmentExperience: varchar("investment_experience"), // 'beginner', 'intermediate', 'advanced', 'expert'
  riskTolerance: varchar("risk_tolerance"), // 'conservative', 'moderate', 'aggressive'
  preferredAssetTypes: jsonb("preferred_asset_types"), // array of strings
  investmentGoals: jsonb("investment_goals"), // array of strings
  tradingFrequency: varchar("trading_frequency"), // 'daily', 'weekly', 'monthly', 'longterm'
  portfolioSize: varchar("portfolio_size"), // 'under10k', '10k-50k', etc.
  interestedInDeveloping: boolean("interested_in_developing").default(false),
  notifications: jsonb("notifications"), // notification preferences object
  profileCompleted: boolean("profile_completed").default(false),
  
  // Performance metrics
  totalBountiesCompleted: integer("total_bounties_completed").default(0),
  totalRewardsEarned: integer("total_rewards_earned").default(0),
  averageCompletionTime: integer("average_completion_time"), // in days
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0.00"), // percentage
  
  // Reputation and rankings
  reputationScore: integer("reputation_score").default(0),
  globalRank: integer("global_rank"),
  categoryRanks: jsonb("category_ranks"), // { "Portfolio Management": 15, "Risk Management": 8 }
  
  // Activity stats
  activeDays: integer("active_days").default(0),
  streakDays: integer("streak_days").default(0),
  lastActiveAt: timestamp("last_active_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 100 }),
  rarity: varchar("rarity", { length: 50 }).default("common"), // common, rare, epic, legendary
  pointsAwarded: integer("points_awarded").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const userSkillRatings = pgTable("user_skill_ratings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  skill: varchar("skill", { length: 100 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(), // 1.0 to 5.0
  endorsements: integer("endorsements").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
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

// Bounty System Types
export type Bounty = typeof bounties.$inferSelect;
export type InsertBounty = typeof bounties.$inferInsert;
export type BountySubmission = typeof bountySubmissions.$inferSelect;
export type InsertBountySubmission = typeof bountySubmissions.$inferInsert;
export type BountyFundingRequest = typeof bountyFundingRequests.$inferSelect;
export type InsertBountyFundingRequest = typeof bountyFundingRequests.$inferInsert;
export type BountyFundingContribution = typeof bountyFundingContributions.$inferSelect;
export type InsertBountyFundingContribution = typeof bountyFundingContributions.$inferInsert;

// Trading Bots Tables
export const tradingBots = pgTable("trading_bots", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // spot_grid, futures_grid, arbitrage_bot, etc.
  symbol: varchar("symbol", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, stopped
  configuration: jsonb("configuration"), // Bot-specific settings
  investment: decimal("investment", { precision: 15, scale: 2 }).notNull(),
  currentPnL: decimal("current_pnl", { precision: 15, scale: 2 }).default("0.00"),
  totalTrades: integer("total_trades").default(0),
  successfulTrades: integer("successful_trades").default(0),
  runtime: varchar("runtime", { length: 100 }),
  priceRange: varchar("price_range", { length: 100 }),
  grids: integer("grids"),
  profitPerGrid: decimal("profit_per_grid", { precision: 5, scale: 2 }),
  mode: varchar("mode", { length: 50 }), // geometric, arithmetic
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  startedAt: timestamp("started_at"),
  stoppedAt: timestamp("stopped_at"),
});

export const botTrades = pgTable("bot_trades", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").notNull().references(() => tradingBots.id),
  tradeType: varchar("trade_type", { length: 10 }).notNull(), // buy, sell
  symbol: varchar("symbol", { length: 50 }).notNull(),
  quantity: decimal("quantity", { precision: 15, scale: 8 }).notNull(),
  price: decimal("price", { precision: 15, scale: 8 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 15, scale: 8 }).default("0.00"),
  profit: decimal("profit", { precision: 15, scale: 2 }),
  executedAt: timestamp("executed_at").defaultNow(),
  gridLevel: integer("grid_level"),
});

export const botPerformance = pgTable("bot_performance", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").notNull().references(() => tradingBots.id),
  date: date("date").notNull(),
  pnl: decimal("pnl", { precision: 15, scale: 2 }).notNull(),
  roi: decimal("roi", { precision: 5, scale: 2 }).notNull(),
  trades: integer("trades").default(0),
  volume: decimal("volume", { precision: 15, scale: 2 }).default("0.00"),
  fees: decimal("fees", { precision: 15, scale: 8 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trading Bot Relations
export const tradingBotsRelations = relations(tradingBots, ({ many }) => ({
  trades: many(botTrades),
  performance: many(botPerformance),
}));

export const botTradesRelations = relations(botTrades, ({ one }) => ({
  bot: one(tradingBots, {
    fields: [botTrades.botId],
    references: [tradingBots.id],
  }),
}));

export const botPerformanceRelations = relations(botPerformance, ({ one }) => ({
  bot: one(tradingBots, {
    fields: [botPerformance.botId],
    references: [tradingBots.id],
  }),
}));

// Bot Funding Tables
export const botFunding = pgTable("bot_funding", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").notNull().references(() => tradingBots.id),
  investorId: varchar("investor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  stake: decimal("stake", { precision: 5, scale: 2 }), // percentage stake in bot profits
  status: varchar("status", { length: 50 }).notNull().default("pledged"), // pledged, confirmed, refunded
  transactionId: varchar("transaction_id", { length: 255 }),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }), // expected annual return %
  riskLevel: varchar("risk_level", { length: 20 }).default("medium"), // low, medium, high
  investmentPeriod: integer("investment_period").default(30), // days
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const botFundingRequests = pgTable("bot_funding_requests", {
  id: serial("id").primaryKey(),
  developerId: varchar("developer_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  botType: varchar("bot_type").notNull(), // spot_grid, futures_grid, arbitrage, etc.
  fundingGoal: decimal("funding_goal", { precision: 12, scale: 2 }).notNull(),
  fundingRaised: decimal("funding_raised", { precision: 12, scale: 2 }).default("0.00"),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(),
  minimumInvestment: decimal("minimum_investment", { precision: 12, scale: 2 }).default("100.00"),
  maximumInvestment: decimal("maximum_investment", { precision: 12, scale: 2 }),
  tradingStrategy: text("trading_strategy").notNull(),
  backtestResults: jsonb("backtest_results"), // JSON with performance metrics
  requiredSkills: text("required_skills").array().default([]),
  deliverables: text("deliverables").array().default([]),
  timeline: varchar("timeline").notNull(), // "30 days", "3 months", etc.
  status: varchar("status").notNull().default("open"), // open, funded, completed, cancelled
  category: varchar("category").notNull(), // "DeFi", "Grid Trading", "Arbitrage", etc.
  tags: text("tags").array().default([]),
  developerExperience: text("developer_experience"),
  fundingDeadline: timestamp("funding_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const botFundingContributions = pgTable("bot_funding_contributions", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => botFundingRequests.id),
  contributorId: varchar("contributor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  message: text("message"),
  status: varchar("status").notNull().default("pledged"), // pledged, confirmed, refunded
  transactionId: varchar("transaction_id"),
  expectedStake: decimal("expected_stake", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bot Funding Relations
export const botFundingRelations = relations(botFunding, ({ one }) => ({
  bot: one(tradingBots, {
    fields: [botFunding.botId],
    references: [tradingBots.id],
  }),
  investor: one(users, {
    fields: [botFunding.investorId],
    references: [users.id],
  }),
}));

export const botFundingRequestsRelations = relations(botFundingRequests, ({ one, many }) => ({
  developer: one(users, {
    fields: [botFundingRequests.developerId],
    references: [users.id],
  }),
  contributions: many(botFundingContributions),
}));

export const botFundingContributionsRelations = relations(botFundingContributions, ({ one }) => ({
  request: one(botFundingRequests, {
    fields: [botFundingContributions.requestId],
    references: [botFundingRequests.id],
  }),
  contributor: one(users, {
    fields: [botFundingContributions.contributorId],
    references: [users.id],
  }),
}));

// User Profile Types
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type UserSkillRating = typeof userSkillRatings.$inferSelect;
export type InsertUserSkillRating = typeof userSkillRatings.$inferInsert;

// Trading Bot Types
export type TradingBot = typeof tradingBots.$inferSelect;
export type InsertTradingBot = typeof tradingBots.$inferInsert;
export type BotTrade = typeof botTrades.$inferSelect;
export type InsertBotTrade = typeof botTrades.$inferInsert;
export type BotPerformance = typeof botPerformance.$inferSelect;
export type InsertBotPerformance = typeof botPerformance.$inferInsert;

// Bot Funding Types
export type BotFunding = typeof botFunding.$inferSelect;
export type InsertBotFunding = typeof botFunding.$inferInsert;
export type BotFundingRequest = typeof botFundingRequests.$inferSelect;
export type InsertBotFundingRequest = typeof botFundingRequests.$inferInsert;
export type BotFundingContribution = typeof botFundingContributions.$inferSelect;
export type InsertBotFundingContribution = typeof botFundingContributions.$inferInsert;

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

// Web3 Wallets table
export const web3Wallets = pgTable("web3_wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletAddress: varchar("wallet_address").notNull(),
  walletType: varchar("wallet_type").notNull(), // MetaMask, WalletConnect, etc.
  chainId: integer("chain_id").notNull(), // 1 for Ethereum, 56 for BSC, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cryptocurrency Holdings table
export const cryptoHoldings = pgTable("crypto_holdings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletId: integer("wallet_id").references(() => web3Wallets.id),
  tokenAddress: varchar("token_address").notNull(), // Contract address or "native" for ETH/BNB
  tokenSymbol: varchar("token_symbol").notNull(),
  tokenName: varchar("token_name").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).notNull(),
  usdValue: decimal("usd_value", { precision: 12, scale: 2 }),
  chainId: integer("chain_id").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// DeFi Positions table
export const defiPositions = pgTable("defi_positions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletId: integer("wallet_id").references(() => web3Wallets.id),
  protocol: varchar("protocol").notNull(), // Uniswap, Aave, Compound, etc.
  positionType: varchar("position_type").notNull(), // liquidity, lending, borrowing, staking
  tokenPair: varchar("token_pair"), // For LP positions like ETH/USDC
  principal: decimal("principal", { precision: 20, scale: 8 }).notNull(),
  currentValue: decimal("current_value", { precision: 20, scale: 8 }),
  rewards: decimal("rewards", { precision: 20, scale: 8 }).default("0"),
  apy: decimal("apy", { precision: 5, scale: 2 }),
  chainId: integer("chain_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// DeFi Transactions table
export const defiTransactions = pgTable("defi_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletId: integer("wallet_id").references(() => web3Wallets.id),
  transactionHash: varchar("transaction_hash").notNull(),
  protocol: varchar("protocol").notNull(),
  action: varchar("action").notNull(), // swap, deposit, withdraw, claim
  tokenIn: varchar("token_in"),
  tokenOut: varchar("token_out"),
  amountIn: decimal("amount_in", { precision: 20, scale: 8 }),
  amountOut: decimal("amount_out", { precision: 20, scale: 8 }),
  gasUsed: decimal("gas_used", { precision: 12, scale: 0 }),
  gasFee: decimal("gas_fee", { precision: 12, scale: 8 }),
  chainId: integer("chain_id").notNull(),
  blockNumber: integer("block_number"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Yield Farming Positions table
export const yieldFarmingPositions = pgTable("yield_farming_positions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletId: integer("wallet_id").references(() => web3Wallets.id),
  protocol: varchar("protocol").notNull(),
  poolName: varchar("pool_name").notNull(),
  lpTokenAddress: varchar("lp_token_address").notNull(),
  stakedAmount: decimal("staked_amount", { precision: 20, scale: 8 }).notNull(),
  rewardTokens: jsonb("reward_tokens").notNull(), // Array of reward token info
  totalRewards: decimal("total_rewards", { precision: 20, scale: 8 }).default("0"),
  apy: decimal("apy", { precision: 5, scale: 2 }),
  chainId: integer("chain_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// NFT Holdings table
export const nftHoldings = pgTable("nft_holdings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  walletId: integer("wallet_id").references(() => web3Wallets.id),
  contractAddress: varchar("contract_address").notNull(),
  tokenId: varchar("token_id").notNull(),
  name: varchar("name"),
  description: text("description"),
  imageUrl: varchar("image_url"),
  collectionName: varchar("collection_name"),
  floorPrice: decimal("floor_price", { precision: 12, scale: 8 }),
  lastSalePrice: decimal("last_sale_price", { precision: 12, scale: 8 }),
  chainId: integer("chain_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Web3 Relations
export const web3WalletsRelations = relations(web3Wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [web3Wallets.userId],
    references: [users.id],
  }),
  cryptoHoldings: many(cryptoHoldings),
  defiPositions: many(defiPositions),
  defiTransactions: many(defiTransactions),
  yieldFarmingPositions: many(yieldFarmingPositions),
  nftHoldings: many(nftHoldings),
}));

export const cryptoHoldingsRelations = relations(cryptoHoldings, ({ one }) => ({
  user: one(users, {
    fields: [cryptoHoldings.userId],
    references: [users.id],
  }),
  wallet: one(web3Wallets, {
    fields: [cryptoHoldings.walletId],
    references: [web3Wallets.id],
  }),
}));

export const defiPositionsRelations = relations(defiPositions, ({ one }) => ({
  user: one(users, {
    fields: [defiPositions.userId],
    references: [users.id],
  }),
  wallet: one(web3Wallets, {
    fields: [defiPositions.walletId],
    references: [web3Wallets.id],
  }),
}));

// Web3 Types
export type Web3Wallet = typeof web3Wallets.$inferSelect;
export type InsertWeb3Wallet = typeof web3Wallets.$inferInsert;
export type CryptoHolding = typeof cryptoHoldings.$inferSelect;
export type InsertCryptoHolding = typeof cryptoHoldings.$inferInsert;
export type DefiPosition = typeof defiPositions.$inferSelect;
export type InsertDefiPosition = typeof defiPositions.$inferInsert;
export type DefiTransaction = typeof defiTransactions.$inferSelect;
export type InsertDefiTransaction = typeof defiTransactions.$inferInsert;
export type YieldFarmingPosition = typeof yieldFarmingPositions.$inferSelect;
export type InsertYieldFarmingPosition = typeof yieldFarmingPositions.$inferInsert;
export type NftHolding = typeof nftHoldings.$inferSelect;
export type InsertNftHolding = typeof nftHoldings.$inferInsert;

// Web3 Insert Schemas
export const insertWeb3WalletSchema = createInsertSchema(web3Wallets).omit({
  id: true,
  createdAt: true,
});

export const insertCryptoHoldingSchema = createInsertSchema(cryptoHoldings).omit({
  id: true,
  lastUpdated: true,
});

export const insertDefiPositionSchema = createInsertSchema(defiPositions).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertDefiTransactionSchema = createInsertSchema(defiTransactions).omit({
  id: true,
  timestamp: true,
});

export const insertYieldFarmingPositionSchema = createInsertSchema(yieldFarmingPositions).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertNftHoldingSchema = createInsertSchema(nftHoldings).omit({
  id: true,
  createdAt: true,
});

// AI Marketplace Recommendation Engine Tables
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  riskTolerance: varchar("risk_tolerance").notNull(), // conservative, moderate, aggressive
  investmentHorizon: varchar("investment_horizon").notNull(), // short, medium, long
  preferredCategories: text("preferred_categories").array(), // Array of category IDs or names
  excludedCategories: text("excluded_categories").array(),
  maxMonthlySpend: decimal("max_monthly_spend", { precision: 10, scale: 2 }),
  preferredCompliance: text("preferred_compliance").array(), // GDPR, SOX, MiFID II, etc.
  financialGoals: text("financial_goals").array(), // retirement, wealth_building, income_generation
  experienceLevel: varchar("experience_level").notNull(), // beginner, intermediate, advanced
  preferredRegions: text("preferred_regions").array(),
  autoSubscribe: boolean("auto_subscribe").default(false),
  notificationPrefs: jsonb("notification_prefs"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modelRecommendations = pgTable("model_recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  score: decimal("score", { precision: 5, scale: 4 }).notNull(), // 0.0000 to 1.0000
  reasonCode: varchar("reason_code").notNull(), // portfolio_match, risk_alignment, performance_history, etc.
  reasoning: text("reasoning").notNull(),
  recommendationType: varchar("recommendation_type").notNull(), // personalized, trending, collaborative, content_based
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  isViewed: boolean("is_viewed").default(false),
  isInteracted: boolean("is_interacted").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userModelInteractions = pgTable("user_model_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  interactionType: varchar("interaction_type").notNull(), // view, like, subscribe, trial, review, share
  sessionDuration: integer("session_duration"), // in seconds
  clickDepth: integer("click_depth"), // how many clicks into model details
  rating: decimal("rating", { precision: 3, scale: 2 }), // User rating 1.00 to 5.00
  review: text("review"),
  metadata: jsonb("metadata"), // Additional interaction data
  timestamp: timestamp("timestamp").defaultNow(),
});

export const similarityScores = pgTable("similarity_scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  similarUserId: varchar("similar_user_id").references(() => users.id).notNull(),
  score: decimal("score", { precision: 5, scale: 4 }).notNull(), // 0.0000 to 1.0000
  sharedModels: integer("shared_models").default(0),
  sharedCategories: integer("shared_categories").default(0),
  similarityType: varchar("similarity_type").notNull(), // behavioral, demographic, portfolio_based
  lastCalculated: timestamp("last_calculated").defaultNow(),
});

export const recommendationMetrics = pgTable("recommendation_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  recommendationId: integer("recommendation_id").references(() => modelRecommendations.id),
  metricType: varchar("metric_type").notNull(), // ctr, conversion, satisfaction, retention
  metricValue: decimal("metric_value", { precision: 8, scale: 6 }).notNull(),
  timeFrame: varchar("time_frame").notNull(), // daily, weekly, monthly
  timestamp: timestamp("timestamp").defaultNow(),
});

export const trendingModels = pgTable("trending_models", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  rank: integer("rank").notNull(),
  category: varchar("category"),
  trendScore: decimal("trend_score", { precision: 8, scale: 4 }).notNull(),
  viewCount: integer("view_count").default(0),
  subscriptionCount: integer("subscription_count").default(0),
  ratingCount: integer("rating_count").default(0),
  avgRating: decimal("avg_rating", { precision: 3, scale: 2 }),
  timeFrame: varchar("time_frame").notNull(), // daily, weekly, monthly
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const personalizedFeed = pgTable("personalized_feed", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentType: varchar("content_type").notNull(), // model_recommendation, trending_model, educational_content
  contentId: integer("content_id").notNull(), // References the actual content (model ID, article ID, etc.)
  score: decimal("score", { precision: 5, scale: 4 }).notNull(),
  position: integer("position").notNull(), // Order in feed
  isViewed: boolean("is_viewed").default(false),
  isInteracted: boolean("is_interacted").default(false),
  feedType: varchar("feed_type").notNull(), // home, category, search
  generatedAt: timestamp("generated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Recommendation Engine Relations
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const modelRecommendationsRelations = relations(modelRecommendations, ({ one, many }) => ({
  user: one(users, {
    fields: [modelRecommendations.userId],
    references: [users.id],
  }),
  model: one(aiModels, {
    fields: [modelRecommendations.modelId],
    references: [aiModels.id],
  }),
  metrics: many(recommendationMetrics),
}));

export const userModelInteractionsRelations = relations(userModelInteractions, ({ one }) => ({
  user: one(users, {
    fields: [userModelInteractions.userId],
    references: [users.id],
  }),
  model: one(aiModels, {
    fields: [userModelInteractions.modelId],
    references: [aiModels.id],
  }),
}));

export const trendingModelsRelations = relations(trendingModels, ({ one }) => ({
  model: one(aiModels, {
    fields: [trendingModels.modelId],
    references: [aiModels.id],
  }),
}));

export const personalizedFeedRelations = relations(personalizedFeed, ({ one }) => ({
  user: one(users, {
    fields: [personalizedFeed.userId],
    references: [users.id],
  }),
}));

// Insert schemas for recommendation engine
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModelRecommendationSchema = createInsertSchema(modelRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserModelInteractionSchema = createInsertSchema(userModelInteractions).omit({
  id: true,
  timestamp: true,
});

export const insertTrendingModelSchema = createInsertSchema(trendingModels).omit({
  id: true,
  calculatedAt: true,
});

export const insertPersonalizedFeedSchema = createInsertSchema(personalizedFeed).omit({
  id: true,
  generatedAt: true,
});

// Type definitions
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type ModelRecommendation = typeof modelRecommendations.$inferSelect;
export type InsertModelRecommendation = z.infer<typeof insertModelRecommendationSchema>;

export type UserModelInteraction = typeof userModelInteractions.$inferSelect;
export type InsertUserModelInteraction = z.infer<typeof insertUserModelInteractionSchema>;

export type TrendingModel = typeof trendingModels.$inferSelect;
export type InsertTrendingModel = z.infer<typeof insertTrendingModelSchema>;

export type PersonalizedFeed = typeof personalizedFeed.$inferSelect;
export type InsertPersonalizedFeed = z.infer<typeof insertPersonalizedFeedSchema>;
