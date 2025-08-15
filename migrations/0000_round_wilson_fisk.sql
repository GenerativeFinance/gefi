CREATE TABLE "ai_model_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon" varchar,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "ai_model_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ai_model_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"name" varchar NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "ai_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"category_id" integer,
	"subcategory_id" integer,
	"price" numeric(8, 2) NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0',
	"total_ratings" integer DEFAULT 0,
	"creator" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"features" jsonb,
	"performance" jsonb,
	"tags" text[],
	"ai_technique" varchar,
	"target_user_type" varchar,
	"financial_instrument" varchar,
	"risk_level" varchar,
	"min_investment" numeric(12, 2),
	"data_requirements" text[],
	"supported_regions" text[],
	"compliance_frameworks" text[],
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_trail" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"entity_type" varchar NOT NULL,
	"entity_id" varchar NOT NULL,
	"action" varchar NOT NULL,
	"old_values" text,
	"new_values" text,
	"timestamp" timestamp DEFAULT now(),
	"ip_address" varchar,
	"user_agent" varchar,
	"risk_score" integer
);
--> statement-breakpoint
CREATE TABLE "backtest_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"backtest_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"portfolio_value" numeric(15, 2) NOT NULL,
	"benchmark_value" numeric(15, 2) NOT NULL,
	"daily_return" numeric(8, 6),
	"cumulative_return" numeric(8, 6),
	"drawdown" numeric(8, 6),
	"volatility" numeric(8, 6),
	"cash_position" numeric(15, 2) NOT NULL,
	"positions_value" numeric(15, 2) NOT NULL,
	"exposure" numeric(5, 4),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backtest_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"backtest_id" integer NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"quantity" numeric(15, 6) NOT NULL,
	"avg_price" numeric(15, 6) NOT NULL,
	"current_price" numeric(15, 6),
	"market_value" numeric(15, 2),
	"unrealized_pnl" numeric(15, 2),
	"realized_pnl" numeric(15, 2),
	"open_date" timestamp NOT NULL,
	"close_date" timestamp,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"sector" varchar(100),
	"market_cap" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backtest_trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"backtest_id" integer NOT NULL,
	"trade_date" timestamp NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"action" varchar(10) NOT NULL,
	"quantity" numeric(15, 6) NOT NULL,
	"price" numeric(15, 6) NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"commission" numeric(15, 6) NOT NULL,
	"slippage" numeric(15, 6) NOT NULL,
	"pnl" numeric(15, 2),
	"portfolio_value" numeric(15, 2) NOT NULL,
	"signal" varchar(255),
	"confidence" numeric(5, 4),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backtests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"model_name" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'running' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"initial_capital" numeric(15, 2) NOT NULL,
	"final_value" numeric(15, 2),
	"total_return" numeric(8, 6),
	"annualized_return" numeric(8, 6),
	"sharpe_ratio" numeric(8, 4),
	"max_drawdown" numeric(8, 6),
	"volatility" numeric(8, 6),
	"win_rate" numeric(8, 6),
	"profit_factor" numeric(8, 4),
	"benchmark" varchar(50) NOT NULL,
	"commission" numeric(8, 6) DEFAULT '0.001' NOT NULL,
	"slippage" numeric(8, 6) DEFAULT '0.0005' NOT NULL,
	"risk_free_rate" numeric(8, 6) DEFAULT '0.02' NOT NULL,
	"metrics" jsonb,
	"config" jsonb,
	"created_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bot_funding" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" integer NOT NULL,
	"investor_id" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"stake" numeric(5, 2),
	"status" varchar(50) DEFAULT 'pledged' NOT NULL,
	"transaction_id" varchar(255),
	"expected_return" numeric(5, 2),
	"risk_level" varchar(20) DEFAULT 'medium',
	"investment_period" integer DEFAULT 30,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_funding_contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"contributor_id" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"message" text,
	"status" varchar DEFAULT 'pledged' NOT NULL,
	"transaction_id" varchar,
	"expected_stake" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_funding_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"developer_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"bot_type" varchar NOT NULL,
	"funding_goal" numeric(12, 2) NOT NULL,
	"funding_raised" numeric(12, 2) DEFAULT '0.00',
	"expected_return" numeric(5, 2) NOT NULL,
	"risk_level" varchar(20) NOT NULL,
	"minimum_investment" numeric(12, 2) DEFAULT '100.00',
	"maximum_investment" numeric(12, 2),
	"trading_strategy" text NOT NULL,
	"backtest_results" jsonb,
	"required_skills" text[] DEFAULT '{}',
	"deliverables" text[] DEFAULT '{}',
	"timeline" varchar NOT NULL,
	"status" varchar DEFAULT 'open' NOT NULL,
	"category" varchar NOT NULL,
	"tags" text[] DEFAULT '{}',
	"developer_experience" text,
	"funding_deadline" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" integer NOT NULL,
	"date" date NOT NULL,
	"pnl" numeric(15, 2) NOT NULL,
	"roi" numeric(5, 2) NOT NULL,
	"trades" integer DEFAULT 0,
	"volume" numeric(15, 2) DEFAULT '0.00',
	"fees" numeric(15, 8) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" integer NOT NULL,
	"trade_type" varchar(10) NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"quantity" numeric(15, 8) NOT NULL,
	"price" numeric(15, 8) NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"fees" numeric(15, 8) DEFAULT '0.00',
	"profit" numeric(15, 2),
	"executed_at" timestamp DEFAULT now(),
	"grid_level" integer
);
--> statement-breakpoint
CREATE TABLE "bounties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"reward" integer NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"category" varchar(100) NOT NULL,
	"requirements" text[] DEFAULT '{}',
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"deadline" timestamp,
	"claimed_by" varchar,
	"completed_by" varchar,
	"submission_count" integer DEFAULT 0,
	"team_allowed" boolean DEFAULT false,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bounty_funding_contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"contributor_id" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"contributed_at" timestamp DEFAULT now(),
	"claimed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bounty_funding_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"funding_required" numeric(12, 2) NOT NULL,
	"funding_raised" numeric(12, 2) DEFAULT '0.00',
	"timeline" varchar(100) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"skills" text[] DEFAULT '{}',
	"deliverables" text[] DEFAULT '{}',
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"estimated_reward" numeric(12, 2),
	"developer_name" varchar(255),
	"submitter_id" varchar NOT NULL,
	"approved_by" varchar,
	"backers" integer DEFAULT 0,
	"submitted_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"funded_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bounty_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"bounty_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"solution_url" varchar(500),
	"github_url" varchar(500),
	"demo_url" varchar(500),
	"status" varchar(50) DEFAULT 'submitted' NOT NULL,
	"feedback" text,
	"score" integer,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chatbot_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"session_id" varchar NOT NULL,
	"user_profile" varchar,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"profile_confidence" numeric(3, 2) DEFAULT '0.0',
	"current_question_index" integer DEFAULT 0,
	"completed_questions" jsonb DEFAULT '[]'::jsonb,
	"user_goals" jsonb DEFAULT '[]'::jsonb,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"feedback_provided" boolean DEFAULT false,
	"conversation_status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chatbot_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer,
	"user_id" varchar,
	"rating" integer,
	"feedback_text" text,
	"improvement_suggestions" jsonb DEFAULT '[]'::jsonb,
	"was_helpful" boolean,
	"recommended_features" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chatbot_user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"profile_type" varchar NOT NULL,
	"confidence" numeric(3, 2) NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"responses" jsonb DEFAULT '[]'::jsonb,
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "cloud_provider_credentials" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"credential_name" varchar NOT NULL,
	"credentials" text,
	"region" varchar,
	"is_active" boolean DEFAULT true,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"framework_id" integer,
	"user_id" varchar NOT NULL,
	"portfolio_id" integer,
	"check_type" varchar NOT NULL,
	"status" varchar NOT NULL,
	"details" text,
	"threshold" numeric(10, 4),
	"current_value" numeric(10, 4),
	"last_checked" timestamp DEFAULT now(),
	"next_check_due" timestamp
);
--> statement-breakpoint
CREATE TABLE "compliance_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"document_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"file_path" varchar,
	"version" varchar,
	"expiry_date" timestamp,
	"status" varchar DEFAULT 'active' NOT NULL,
	"uploaded_at" timestamp DEFAULT now(),
	"last_reviewed" timestamp,
	"reviewed_by" varchar
);
--> statement-breakpoint
CREATE TABLE "compliance_frameworks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"version" varchar NOT NULL,
	"description" text,
	"requirements" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_id" integer NOT NULL,
	"entity_type" varchar NOT NULL,
	"reporter_id" varchar NOT NULL,
	"assigned_regulator_id" varchar,
	"issue_type" varchar NOT NULL,
	"severity" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"evidence_files" text[] DEFAULT '{}',
	"regulatory_framework" varchar,
	"status" varchar DEFAULT 'open',
	"resolution" text,
	"actions_taken" jsonb,
	"communication_log" jsonb,
	"report_date" timestamp DEFAULT now(),
	"resolution_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crypto_holdings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_id" integer,
	"token_address" varchar NOT NULL,
	"token_symbol" varchar NOT NULL,
	"token_name" varchar NOT NULL,
	"balance" numeric(20, 8) NOT NULL,
	"usd_value" numeric(12, 2),
	"chain_id" integer NOT NULL,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"report_type" varchar NOT NULL,
	"date_range" varchar NOT NULL,
	"custom_start_date" timestamp,
	"custom_end_date" timestamp,
	"metrics" text[],
	"visualizations" text[],
	"filters" text,
	"schedule" varchar,
	"is_public" boolean DEFAULT false,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_run_at" timestamp,
	"next_run_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "data_collaborations" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"model_developer_id" varchar NOT NULL,
	"provider_id" integer NOT NULL,
	"collaboration_type" varchar NOT NULL,
	"access_level" varchar NOT NULL,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"revenue_share" numeric(5, 2),
	"status" varchar DEFAULT 'active',
	"agreement_terms" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"company_name" varchar,
	"description" text,
	"specialization" varchar NOT NULL,
	"compliance_certifications" text[],
	"data_quality_rating" numeric(3, 2) DEFAULT '0.00',
	"total_revenue" numeric(15, 2) DEFAULT '0.00',
	"total_datasets" integer DEFAULT 0,
	"active_subscriptions" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_quality_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"completeness" numeric(5, 2),
	"accuracy" numeric(5, 2),
	"consistency" numeric(5, 2),
	"timeliness" numeric(5, 2),
	"validity" numeric(5, 2),
	"uniqueness" numeric(5, 2),
	"overall_score" numeric(5, 2),
	"last_updated" timestamp DEFAULT now(),
	"validation_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "dataset_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"auditor_id" varchar NOT NULL,
	"audit_type" varchar NOT NULL,
	"status" varchar DEFAULT 'in_progress',
	"compliance_score" numeric(5, 2),
	"privacy_assessment" jsonb,
	"data_quality_review" jsonb,
	"gdpr_compliance" jsonb,
	"retention_policy" jsonb,
	"access_controls" jsonb,
	"flagged_concerns" text[] DEFAULT '{}',
	"recommendations" text,
	"approval_status" varchar DEFAULT 'under_review',
	"audit_date" timestamp DEFAULT now(),
	"completion_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dataset_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"use_case_description" text,
	"quality_rating" integer,
	"value_rating" integer,
	"support_rating" integer,
	"would_recommend" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dataset_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_type" varchar NOT NULL,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"total_paid" numeric(10, 2) DEFAULT '0.00',
	"usage_limit" integer,
	"current_usage" integer DEFAULT 0,
	"auto_renew" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dataset_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"usage_type" varchar NOT NULL,
	"records_accessed" integer,
	"bytes_transferred" integer,
	"cost" numeric(10, 2),
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"subcategory" varchar,
	"data_type" varchar NOT NULL,
	"file_size" integer,
	"record_count" integer,
	"update_frequency" varchar,
	"date_range" jsonb,
	"schema" jsonb,
	"sample_data" jsonb,
	"quality_score" numeric(3, 2) DEFAULT '0.00',
	"price_per_record" numeric(10, 6),
	"monthly_subscription_fee" numeric(10, 2),
	"one_time_purchase_price" numeric(10, 2),
	"license_type" varchar NOT NULL,
	"usage_restrictions" text,
	"tags" text[],
	"download_count" integer DEFAULT 0,
	"subscription_count" integer DEFAULT 0,
	"revenue" numeric(15, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"compliance_status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "defi_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_id" integer,
	"protocol" varchar NOT NULL,
	"position_type" varchar NOT NULL,
	"token_pair" varchar,
	"principal" numeric(20, 8) NOT NULL,
	"current_value" numeric(20, 8),
	"rewards" numeric(20, 8) DEFAULT '0',
	"apy" numeric(5, 2),
	"chain_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "defi_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_id" integer,
	"transaction_hash" varchar NOT NULL,
	"protocol" varchar NOT NULL,
	"action" varchar NOT NULL,
	"token_in" varchar,
	"token_out" varchar,
	"amount_in" numeric(20, 8),
	"amount_out" numeric(20, 8),
	"gas_used" numeric(12, 0),
	"gas_fee" numeric(12, 8),
	"chain_id" integer NOT NULL,
	"block_number" integer,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "developer_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"developer_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"funding_goal" numeric(12, 2) NOT NULL,
	"funding_raised" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"category" varchar(100) NOT NULL,
	"tags" text[] DEFAULT '{}',
	"github_repo" varchar(255),
	"api_endpoint" varchar(255),
	"deployment_url" varchar(255),
	"file_url" varchar(255),
	"file_name" varchar(255),
	"test_results" jsonb,
	"performance_metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "federated_learning_nodes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"server_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"node_id" varchar NOT NULL,
	"node_type" varchar NOT NULL,
	"model_id" integer,
	"status" varchar DEFAULT 'inactive' NOT NULL,
	"performance" jsonb,
	"rewards" numeric(18, 8) DEFAULT '0.00000000',
	"reputation" numeric(5, 2) DEFAULT '0.00',
	"last_sync_at" timestamp,
	"joined_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "federated_learning_nodes_node_id_unique" UNIQUE("node_id")
);
--> statement-breakpoint
CREATE TABLE "market_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"value" varchar,
	"trend" varchar,
	"confidence" numeric(5, 2),
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"auditor_id" varchar NOT NULL,
	"audit_type" varchar NOT NULL,
	"status" varchar DEFAULT 'in_progress',
	"compliance_score" numeric(5, 2),
	"findings" jsonb,
	"recommendations" text,
	"risk_level" varchar,
	"regulatory_framework" varchar NOT NULL,
	"documentation_review" jsonb,
	"validation_results" jsonb,
	"flagged_issues" text[] DEFAULT '{}',
	"approval_status" varchar DEFAULT 'under_review',
	"audit_date" timestamp DEFAULT now(),
	"completion_date" timestamp,
	"next_review_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_chat" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar(50) DEFAULT 'text' NOT NULL,
	"parent_id" integer,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_collaborators" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar(50) NOT NULL,
	"permissions" text[] DEFAULT '{}',
	"invited_at" timestamp DEFAULT now(),
	"joined_at" timestamp,
	"status" varchar(50) DEFAULT 'invited' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"text" text NOT NULL,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_funding" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"investor_id" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"stake" numeric(5, 2),
	"status" varchar(50) DEFAULT 'pledged' NOT NULL,
	"transaction_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"score" numeric(5, 4) NOT NULL,
	"reason_code" varchar NOT NULL,
	"reasoning" text NOT NULL,
	"recommendation_type" varchar NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"is_viewed" boolean DEFAULT false,
	"is_interacted" boolean DEFAULT false,
	"is_dismissed" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"amount" numeric(12, 2),
	"points" integer,
	"percentage" numeric(5, 2),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"claimed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "model_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"tester_id" varchar NOT NULL,
	"test_type" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"results" jsonb,
	"feedback" text,
	"score" integer,
	"duration" integer,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "model_usage_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"subscription_id" integer,
	"session_duration" numeric(10, 2) NOT NULL,
	"performance_result" numeric(8, 4),
	"profit_loss" numeric(12, 2),
	"usage_type" varchar NOT NULL,
	"session_started" timestamp NOT NULL,
	"session_ended" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"version" varchar(50) NOT NULL,
	"description" text,
	"file_url" varchar(255),
	"file_name" varchar(255),
	"changes" text,
	"commit_hash" varchar(255),
	"test_results" jsonb,
	"deployed_at" timestamp,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nft_holdings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_id" integer,
	"contract_address" varchar NOT NULL,
	"token_id" varchar NOT NULL,
	"name" varchar,
	"description" text,
	"image_url" varchar,
	"collection_name" varchar,
	"floor_price" numeric(12, 8),
	"last_sale_price" numeric(12, 8),
	"chain_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "personalized_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"content_type" varchar NOT NULL,
	"content_id" integer NOT NULL,
	"score" numeric(5, 4) NOT NULL,
	"position" integer NOT NULL,
	"is_viewed" boolean DEFAULT false,
	"is_interacted" boolean DEFAULT false,
	"feed_type" varchar NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "portfolio_ai_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"model_type" varchar NOT NULL,
	"model_name" varchar NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"performance" numeric(5, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "portfolio_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"symbol" varchar NOT NULL,
	"asset_type" varchar NOT NULL,
	"allocation" numeric(5, 2) NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"purchase_price" numeric(12, 2) NOT NULL,
	"current_value" numeric(12, 2) NOT NULL,
	"quantity" numeric(16, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"total_investment" numeric(12, 2) NOT NULL,
	"live_pnl" numeric(12, 2) NOT NULL,
	"annual_returns" numeric(5, 2) NOT NULL,
	"sharpe_ratio" numeric(4, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recommendation_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"recommendation_id" integer,
	"metric_type" varchar NOT NULL,
	"metric_value" numeric(8, 6) NOT NULL,
	"time_frame" varchar NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "regulator_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"regulator_id" varchar NOT NULL,
	"recipient_id" varchar NOT NULL,
	"recipient_type" varchar NOT NULL,
	"entity_id" integer,
	"entity_type" varchar,
	"communication_type" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"message" text NOT NULL,
	"priority" varchar DEFAULT 'normal',
	"status" varchar DEFAULT 'sent',
	"response_required" boolean DEFAULT false,
	"response_deadline" timestamp,
	"attachments" text[] DEFAULT '{}',
	"read_at" timestamp,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "regulator_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"organization_name" varchar NOT NULL,
	"regulatory_body" varchar NOT NULL,
	"jurisdiction" varchar NOT NULL,
	"certification_level" varchar NOT NULL,
	"specializations" text[] DEFAULT '{}' NOT NULL,
	"years_experience" integer,
	"contact_info" jsonb,
	"is_active" boolean DEFAULT true,
	"verification_status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "regulator_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "regulatory_compliance_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"generated_by" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"period" varchar NOT NULL,
	"framework" varchar NOT NULL,
	"total_entities_reviewed" integer,
	"compliant_entities" integer,
	"non_compliant_entities" integer,
	"flagged_issues" integer,
	"resolved_issues" integer,
	"report_data" jsonb,
	"summary" text,
	"recommendations" text,
	"status" varchar DEFAULT 'draft',
	"submission_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "regulatory_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"framework_id" integer,
	"report_data" text,
	"file_path" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"submitted_at" timestamp,
	"approved_by" varchar,
	"approved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "regulatory_standards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"framework" varchar NOT NULL,
	"version" varchar NOT NULL,
	"effective_date" timestamp NOT NULL,
	"description" text,
	"requirements" jsonb,
	"applicable_regions" text[] DEFAULT '{}',
	"compliance_guidelines" jsonb,
	"update_frequency" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "report_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" integer,
	"user_id" varchar NOT NULL,
	"status" varchar DEFAULT 'running' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"error" text,
	"result_data" text,
	"file_path" varchar,
	"download_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "report_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"default_metrics" text[],
	"default_visualizations" text[],
	"default_filters" text,
	"default_schedule" varchar,
	"is_public" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"status" varchar NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "risk_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"severity" varchar NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "risk_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" integer,
	"limit_type" varchar NOT NULL,
	"limit_value" numeric(10, 4),
	"current_value" numeric(10, 4),
	"utilization_percentage" numeric(5, 2),
	"is_breached" boolean DEFAULT false,
	"last_updated" timestamp DEFAULT now(),
	"alert_threshold" numeric(5, 2) DEFAULT '80.00'
);
--> statement-breakpoint
CREATE TABLE "server_deployments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"server_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"deployment_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"configuration" jsonb,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"endpoint" varchar,
	"health_check_url" varchar,
	"logs" text,
	"metrics" jsonb,
	"deployed_at" timestamp,
	"last_health_check" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "server_infrastructure" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"region" varchar NOT NULL,
	"instance_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"ip_address" varchar,
	"ssh_key" text,
	"configuration" jsonb,
	"cost_per_hour" numeric(10, 4),
	"total_cost" numeric(12, 2) DEFAULT '0.00',
	"last_health_check" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "server_metrics" (
	"id" uuid PRIMARY KEY NOT NULL,
	"server_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"cpu_usage" numeric(5, 2),
	"memory_usage" numeric(5, 2),
	"disk_usage" numeric(5, 2),
	"network_inbound" numeric(12, 2),
	"network_outbound" numeric(12, 2),
	"active_connections" integer,
	"response_time" numeric(8, 3),
	"error_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "similarity_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"similar_user_id" varchar NOT NULL,
	"score" numeric(5, 4) NOT NULL,
	"shared_models" integer DEFAULT 0,
	"shared_categories" integer DEFAULT 0,
	"similarity_type" varchar NOT NULL,
	"last_calculated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_bots" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"configuration" jsonb,
	"investment" numeric(15, 2) NOT NULL,
	"current_pnl" numeric(15, 2) DEFAULT '0.00',
	"total_trades" integer DEFAULT 0,
	"successful_trades" integer DEFAULT 0,
	"runtime" varchar(100),
	"price_range" varchar(100),
	"grids" integer,
	"profit_per_grid" numeric(5, 2),
	"mode" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"stopped_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trending_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"rank" integer NOT NULL,
	"category" varchar,
	"trend_score" numeric(8, 4) NOT NULL,
	"view_count" integer DEFAULT 0,
	"subscription_count" integer DEFAULT 0,
	"rating_count" integer DEFAULT 0,
	"avg_rating" numeric(3, 2),
	"time_frame" varchar NOT NULL,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"achievement_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"icon_name" varchar(100),
	"rarity" varchar(50) DEFAULT 'common',
	"points_awarded" integer DEFAULT 0,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"issuing_organization" varchar NOT NULL,
	"issue_date" date,
	"expiration_date" date,
	"credential_id" varchar,
	"credential_url" varchar,
	"description" text,
	"is_visible" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"degree" varchar NOT NULL,
	"field_of_study" varchar NOT NULL,
	"institution" varchar NOT NULL,
	"start_year" integer,
	"end_year" integer,
	"gpa" numeric(3, 2),
	"honors" text,
	"relevant_coursework" jsonb,
	"is_visible" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"company" varchar NOT NULL,
	"location" varchar,
	"start_date" date,
	"end_date" date,
	"is_current" boolean DEFAULT false,
	"description" text,
	"key_achievements" jsonb,
	"technologies" jsonb,
	"is_visible" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_model_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"interaction_type" varchar NOT NULL,
	"session_duration" integer,
	"click_depth" integer,
	"rating" numeric(3, 2),
	"review" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_model_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"model_id" integer NOT NULL,
	"plan" varchar DEFAULT 'monthly' NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"price" numeric(8, 2) NOT NULL,
	"subscribed_at" timestamp DEFAULT now(),
	"renewal_date" timestamp NOT NULL,
	"last_payment_date" timestamp,
	"cancelled_at" timestamp,
	"paused_at" timestamp,
	"total_usage_hours" numeric(10, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"risk_tolerance" varchar NOT NULL,
	"investment_horizon" varchar NOT NULL,
	"preferred_categories" text[],
	"excluded_categories" text[],
	"max_monthly_spend" numeric(10, 2),
	"preferred_compliance" text[],
	"financial_goals" text[],
	"experience_level" varchar NOT NULL,
	"preferred_regions" text[],
	"auto_subscribe" boolean DEFAULT false,
	"notification_prefs" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar(255),
	"bio" text,
	"location" varchar(255),
	"website" varchar(500),
	"github_username" varchar(255),
	"linkedin_url" varchar(500),
	"twitter_url" varchar(500),
	"skills" text[] DEFAULT '{}',
	"specializations" text[] DEFAULT '{}',
	"years_experience" integer,
	"professional_alias" varchar,
	"hourly_rate" numeric(8, 2),
	"project_fee" numeric(10, 2),
	"methodology" text,
	"collaboration_style" text,
	"overall_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"completed_projects" integer DEFAULT 0,
	"response_time" varchar,
	"languages" jsonb,
	"timezone" varchar,
	"profile_views" integer DEFAULT 0,
	"is_available_for_projects" boolean DEFAULT true,
	"company" varchar,
	"job_title" varchar,
	"investment_experience" varchar,
	"risk_tolerance" varchar,
	"preferred_asset_types" jsonb,
	"investment_goals" jsonb,
	"trading_frequency" varchar,
	"portfolio_size" varchar,
	"interested_in_developing" boolean DEFAULT false,
	"notifications" jsonb,
	"profile_completed" boolean DEFAULT false,
	"total_bounties_completed" integer DEFAULT 0,
	"total_rewards_earned" integer DEFAULT 0,
	"average_completion_time" integer,
	"success_rate" numeric(5, 2) DEFAULT '0.00',
	"reputation_score" integer DEFAULT 0,
	"global_rank" integer,
	"category_ranks" jsonb,
	"active_days" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"last_active_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"journal" varchar,
	"publication_date" date,
	"doi" varchar,
	"url" varchar,
	"co_authors" jsonb,
	"abstract" text,
	"keywords" jsonb,
	"citation_count" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"reviewed_user_id" varchar NOT NULL,
	"reviewer_user_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"project_title" varchar,
	"project_category" varchar,
	"delivery_rating" integer,
	"communication_rating" integer,
	"quality_rating" integer,
	"is_verified" boolean DEFAULT false,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_skill_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"skill" varchar(100) NOT NULL,
	"rating" numeric(3, 1) NOT NULL,
	"endorsements" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"category" varchar NOT NULL,
	"name" varchar NOT NULL,
	"proficiency_level" varchar NOT NULL,
	"years_of_experience" integer,
	"last_used" date,
	"is_endorsed" boolean DEFAULT false,
	"endorsement_count" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"total_earnings" numeric(12, 2) DEFAULT '0',
	"total_projects" integer DEFAULT 0,
	"successful_projects" integer DEFAULT 0,
	"average_delivery_time" integer,
	"repeat_client_rate" numeric(5, 2) DEFAULT '0',
	"on_time_delivery_rate" numeric(5, 2) DEFAULT '100',
	"total_models_sold" integer DEFAULT 0,
	"total_revenue" numeric(12, 2) DEFAULT '0',
	"top_category" varchar,
	"rank_in_category" integer,
	"overall_rank" integer,
	"badges_earned" jsonb,
	"streak_days" integer DEFAULT 0,
	"last_active_date" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"public_address" varchar NOT NULL,
	"private_key" varchar NOT NULL,
	"balance" numeric(18, 8) DEFAULT '0.00000000',
	"is_active" boolean DEFAULT true,
	"last_transaction_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_wallets_public_address_unique" UNIQUE("public_address")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'user',
	"subscription_tier" varchar DEFAULT 'free',
	"provider" varchar,
	"status" varchar DEFAULT 'active',
	"risk_score" integer DEFAULT 0,
	"last_login_at" timestamp,
	"total_trades" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"wallet_id" uuid NOT NULL,
	"type" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"from_address" varchar,
	"to_address" varchar,
	"transaction_hash" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"block_number" varchar,
	"gas_used" numeric(18, 8),
	"gas_price" numeric(18, 8),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"confirmed_at" timestamp,
	CONSTRAINT "wallet_transactions_transaction_hash_unique" UNIQUE("transaction_hash")
);
--> statement-breakpoint
CREATE TABLE "web3_wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_address" varchar NOT NULL,
	"wallet_type" varchar NOT NULL,
	"chain_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yield_farming_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_id" integer,
	"protocol" varchar NOT NULL,
	"pool_name" varchar NOT NULL,
	"lp_token_address" varchar NOT NULL,
	"staked_amount" numeric(20, 8) NOT NULL,
	"reward_tokens" jsonb NOT NULL,
	"total_rewards" numeric(20, 8) DEFAULT '0',
	"apy" numeric(5, 2),
	"chain_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_model_subcategories" ADD CONSTRAINT "ai_model_subcategories_category_id_ai_model_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ai_model_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_models" ADD CONSTRAINT "ai_models_category_id_ai_model_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ai_model_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_models" ADD CONSTRAINT "ai_models_subcategory_id_ai_model_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."ai_model_subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backtest_performance" ADD CONSTRAINT "backtest_performance_backtest_id_backtests_id_fk" FOREIGN KEY ("backtest_id") REFERENCES "public"."backtests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backtest_positions" ADD CONSTRAINT "backtest_positions_backtest_id_backtests_id_fk" FOREIGN KEY ("backtest_id") REFERENCES "public"."backtests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backtest_trades" ADD CONSTRAINT "backtest_trades_backtest_id_backtests_id_fk" FOREIGN KEY ("backtest_id") REFERENCES "public"."backtests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backtests" ADD CONSTRAINT "backtests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backtests" ADD CONSTRAINT "backtests_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_funding" ADD CONSTRAINT "bot_funding_bot_id_trading_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."trading_bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_funding" ADD CONSTRAINT "bot_funding_investor_id_users_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_funding_contributions" ADD CONSTRAINT "bot_funding_contributions_request_id_bot_funding_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."bot_funding_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_funding_contributions" ADD CONSTRAINT "bot_funding_contributions_contributor_id_users_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_funding_requests" ADD CONSTRAINT "bot_funding_requests_developer_id_users_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_performance" ADD CONSTRAINT "bot_performance_bot_id_trading_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."trading_bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_trades" ADD CONSTRAINT "bot_trades_bot_id_trading_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."trading_bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_funding_contributions" ADD CONSTRAINT "bounty_funding_contributions_request_id_bounty_funding_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."bounty_funding_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_funding_contributions" ADD CONSTRAINT "bounty_funding_contributions_contributor_id_users_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_funding_requests" ADD CONSTRAINT "bounty_funding_requests_submitter_id_users_id_fk" FOREIGN KEY ("submitter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_funding_requests" ADD CONSTRAINT "bounty_funding_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_submissions" ADD CONSTRAINT "bounty_submissions_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounty_submissions" ADD CONSTRAINT "bounty_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbot_conversations" ADD CONSTRAINT "chatbot_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbot_feedback" ADD CONSTRAINT "chatbot_feedback_conversation_id_chatbot_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chatbot_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbot_feedback" ADD CONSTRAINT "chatbot_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbot_user_profiles" ADD CONSTRAINT "chatbot_user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_provider_credentials" ADD CONSTRAINT "cloud_provider_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_framework_id_compliance_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."compliance_frameworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_issues" ADD CONSTRAINT "compliance_issues_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_issues" ADD CONSTRAINT "compliance_issues_assigned_regulator_id_users_id_fk" FOREIGN KEY ("assigned_regulator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_holdings" ADD CONSTRAINT "crypto_holdings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_holdings" ADD CONSTRAINT "crypto_holdings_wallet_id_web3_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."web3_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_collaborations" ADD CONSTRAINT "data_collaborations_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_collaborations" ADD CONSTRAINT "data_collaborations_model_developer_id_users_id_fk" FOREIGN KEY ("model_developer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_collaborations" ADD CONSTRAINT "data_collaborations_provider_id_data_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."data_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_providers" ADD CONSTRAINT "data_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_metrics" ADD CONSTRAINT "data_quality_metrics_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_audits" ADD CONSTRAINT "dataset_audits_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_audits" ADD CONSTRAINT "dataset_audits_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_reviews" ADD CONSTRAINT "dataset_reviews_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_reviews" ADD CONSTRAINT "dataset_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_subscriptions" ADD CONSTRAINT "dataset_subscriptions_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_subscriptions" ADD CONSTRAINT "dataset_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_usage" ADD CONSTRAINT "dataset_usage_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_usage" ADD CONSTRAINT "dataset_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_provider_id_data_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."data_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "defi_positions" ADD CONSTRAINT "defi_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "defi_positions" ADD CONSTRAINT "defi_positions_wallet_id_web3_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."web3_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "defi_transactions" ADD CONSTRAINT "defi_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "defi_transactions" ADD CONSTRAINT "defi_transactions_wallet_id_web3_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."web3_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "developer_models" ADD CONSTRAINT "developer_models_developer_id_users_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_learning_nodes" ADD CONSTRAINT "federated_learning_nodes_server_id_server_infrastructure_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server_infrastructure"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_learning_nodes" ADD CONSTRAINT "federated_learning_nodes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_learning_nodes" ADD CONSTRAINT "federated_learning_nodes_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_audits" ADD CONSTRAINT "model_audits_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_chat" ADD CONSTRAINT "model_chat_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_chat" ADD CONSTRAINT "model_chat_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_chat" ADD CONSTRAINT "model_chat_parent_id_model_chat_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."model_chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_collaborators" ADD CONSTRAINT "model_collaborators_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_collaborators" ADD CONSTRAINT "model_collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_comments" ADD CONSTRAINT "model_comments_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_comments" ADD CONSTRAINT "model_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_funding" ADD CONSTRAINT "model_funding_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_funding" ADD CONSTRAINT "model_funding_investor_id_users_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_ratings" ADD CONSTRAINT "model_ratings_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_ratings" ADD CONSTRAINT "model_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_recommendations" ADD CONSTRAINT "model_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_recommendations" ADD CONSTRAINT "model_recommendations_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_rewards" ADD CONSTRAINT "model_rewards_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_rewards" ADD CONSTRAINT "model_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_tests" ADD CONSTRAINT "model_tests_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_tests" ADD CONSTRAINT "model_tests_tester_id_users_id_fk" FOREIGN KEY ("tester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_usage_history" ADD CONSTRAINT "model_usage_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_usage_history" ADD CONSTRAINT "model_usage_history_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_usage_history" ADD CONSTRAINT "model_usage_history_subscription_id_user_model_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."user_model_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_model_id_developer_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."developer_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_holdings" ADD CONSTRAINT "nft_holdings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_holdings" ADD CONSTRAINT "nft_holdings_wallet_id_web3_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."web3_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personalized_feed" ADD CONSTRAINT "personalized_feed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_ai_models" ADD CONSTRAINT "portfolio_ai_models_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_metrics" ADD CONSTRAINT "recommendation_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_metrics" ADD CONSTRAINT "recommendation_metrics_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_metrics" ADD CONSTRAINT "recommendation_metrics_recommendation_id_model_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."model_recommendations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulator_communications" ADD CONSTRAINT "regulator_communications_regulator_id_users_id_fk" FOREIGN KEY ("regulator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulator_communications" ADD CONSTRAINT "regulator_communications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulator_profiles" ADD CONSTRAINT "regulator_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_compliance_reports" ADD CONSTRAINT "regulatory_compliance_reports_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_reports" ADD CONSTRAINT "regulatory_reports_framework_id_compliance_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."compliance_frameworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_runs" ADD CONSTRAINT "report_runs_report_id_custom_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."custom_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_alerts" ADD CONSTRAINT "risk_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_limits" ADD CONSTRAINT "risk_limits_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_deployments" ADD CONSTRAINT "server_deployments_server_id_server_infrastructure_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server_infrastructure"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_deployments" ADD CONSTRAINT "server_deployments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_infrastructure" ADD CONSTRAINT "server_infrastructure_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_metrics" ADD CONSTRAINT "server_metrics_server_id_server_infrastructure_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server_infrastructure"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "similarity_scores" ADD CONSTRAINT "similarity_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "similarity_scores" ADD CONSTRAINT "similarity_scores_similar_user_id_users_id_fk" FOREIGN KEY ("similar_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trending_models" ADD CONSTRAINT "trending_models_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_certifications" ADD CONSTRAINT "user_certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_education" ADD CONSTRAINT "user_education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_experience" ADD CONSTRAINT "user_experience_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_model_interactions" ADD CONSTRAINT "user_model_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_model_interactions" ADD CONSTRAINT "user_model_interactions_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_model_subscriptions" ADD CONSTRAINT "user_model_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_model_subscriptions" ADD CONSTRAINT "user_model_subscriptions_model_id_ai_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_publications" ADD CONSTRAINT "user_publications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_reviewed_user_id_users_id_fk" FOREIGN KEY ("reviewed_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_ratings" ADD CONSTRAINT "user_skill_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "user_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_user_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."user_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web3_wallets" ADD CONSTRAINT "web3_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yield_farming_positions" ADD CONSTRAINT "yield_farming_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yield_farming_positions" ADD CONSTRAINT "yield_farming_positions_wallet_id_web3_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."web3_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");