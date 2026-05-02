import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  integer,
  decimal,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// Admin and Moderator Tables
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  role: varchar("role").notNull(), // 'admin', 'moderator'
  permissions: jsonb("permissions").$type<string[]>(),
  assignedBy: varchar("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Moderation Queue
export const moderationQueue = pgTable("moderation_queue", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type").notNull(), // 'ai_model', 'dataset', 'user_profile', 'comment'
  contentId: varchar("content_id").notNull(),
  submittedBy: varchar("submitted_by").references(() => users.id),
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'flagged'
  priority: varchar("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  flaggedReason: text("flagged_reason"),
  moderatorNotes: text("moderator_notes"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  autoFlags: jsonb("auto_flags").$type<string[]>(), // AI-detected issues
  complianceChecks: jsonb("compliance_checks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Security Alerts and Monitoring
export const securityAlerts = pgTable("security_alerts", {
  id: serial("id").primaryKey(),
  alertType: varchar("alert_type").notNull(), // 'suspicious_login', 'multiple_failures', 'unusual_activity', 'potential_breach'
  severity: varchar("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  userId: varchar("user_id").references(() => users.id),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  location: varchar("location"),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  status: varchar("status").notNull().default("open"), // 'open', 'investigating', 'resolved', 'false_positive'
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support Tickets and Litigation
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: varchar("ticket_number").notNull().unique(),
  userId: varchar("user_id").references(() => users.id),
  category: varchar("category").notNull(), // 'technical', 'billing', 'dispute', 'compliance', 'legal'
  priority: varchar("priority").notNull().default("medium"),
  status: varchar("status").notNull().default("open"), // 'open', 'in_progress', 'waiting_response', 'resolved', 'closed'
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  tags: text("tags").array(),
  resolutionNotes: text("resolution_notes"),
  escalationLevel: integer("escalation_level").default(0),
  isLegalDispute: boolean("is_legal_dispute").default(false),
  disputeAmount: decimal("dispute_amount", { precision: 12, scale: 2 }),
  lastResponseAt: timestamp("last_response_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ticket Messages
export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  messageType: varchar("message_type").default("message"), // 'message', 'internal_note', 'status_change'
  content: text("content").notNull(),
  attachments: jsonb("attachments").$type<string[]>(),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Analytics and Metrics
export const platformMetrics = pgTable("platform_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type").notNull(), // 'users', 'revenue', 'models', 'transactions', 'performance'
  metricName: varchar("metric_name").notNull(),
  value: decimal("value", { precision: 16, scale: 4 }).notNull(),
  unit: varchar("unit"), // 'count', 'usd', 'percentage', 'seconds'
  category: varchar("category"), // 'investor', 'developer', 'data_provider', 'regulator'
  periodType: varchar("period_type").notNull(), // 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metadata: jsonb("metadata"),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// User Activity Monitoring
export const userActivityLog = pgTable("user_activity_log", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  actionType: varchar("action_type").notNull(), // 'login', 'logout', 'model_subscription', 'trade', 'upload', 'profile_update'
  entityType: varchar("entity_type"), // 'ai_model', 'portfolio', 'user', 'dataset'
  entityId: varchar("entity_id"),
  details: text("details"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  location: varchar("location"),
  sessionId: varchar("session_id"),
  riskScore: integer("risk_score"), // 1-100
  flagged: boolean("flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial Oversight
export const transactionMonitoring = pgTable("transaction_monitoring", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id").notNull().unique(),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  transactionType: varchar("transaction_type").notNull(), // 'subscription', 'refund', 'payout', 'fee'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  status: varchar("status").notNull(), // 'pending', 'completed', 'failed', 'disputed', 'refunded'
  paymentMethod: varchar("payment_method"),
  platformFee: decimal("platform_fee", { precision: 12, scale: 2 }),
  relatedEntityType: varchar("related_entity_type"), // 'ai_model', 'bounty', 'dataset'
  relatedEntityId: varchar("related_entity_id"),
  flaggedFor: text("flagged_for").array(), // ['unusual_amount', 'suspicious_pattern', 'compliance_check']
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Configuration
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(), // 'platform', 'security', 'compliance', 'features'
  settingKey: varchar("setting_key").notNull(),
  settingValue: text("setting_value").notNull(),
  dataType: varchar("data_type").notNull(), // 'string', 'number', 'boolean', 'json'
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
  lastModifiedAt: timestamp("last_modified_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  user: one(users, { fields: [adminUsers.userId], references: [users.id] }),
  assignedByUser: one(users, { fields: [adminUsers.assignedBy], references: [users.id] }),
}));

export const moderationQueueRelations = relations(moderationQueue, ({ one }) => ({
  submitter: one(users, { fields: [moderationQueue.submittedBy], references: [users.id] }),
  reviewer: one(users, { fields: [moderationQueue.reviewedBy], references: [users.id] }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, { fields: [supportTickets.userId], references: [users.id] }),
  assignedUser: one(users, { fields: [supportTickets.assignedTo], references: [users.id] }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(supportTickets, { fields: [ticketMessages.ticketId], references: [supportTickets.id] }),
  sender: one(users, { fields: [ticketMessages.senderId], references: [users.id] }),
}));

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

export type ModerationQueue = typeof moderationQueue.$inferSelect;
export type InsertModerationQueue = typeof moderationQueue.$inferInsert;

export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = typeof securityAlerts.$inferInsert;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

export type PlatformMetric = typeof platformMetrics.$inferSelect;
export type InsertPlatformMetric = typeof platformMetrics.$inferInsert;

export type UserActivityLog = typeof userActivityLog.$inferSelect;
export type InsertUserActivityLog = typeof userActivityLog.$inferInsert;

export type TransactionMonitoring = typeof transactionMonitoring.$inferSelect;
export type InsertTransactionMonitoring = typeof transactionMonitoring.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

// Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  assignedAt: true,
  createdAt: true,
});

export const insertModerationQueueSchema = createInsertSchema(moderationQueue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTicketMessageSchema = createInsertSchema(ticketMessages).omit({
  id: true,
  createdAt: true,
});