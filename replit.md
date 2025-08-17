# GeFi - AI Financial Platform

## Overview
GeFi is a comprehensive AI-powered financial platform that enables developers to create and monetize AI financial models. It also provides investors with access to sophisticated financial analytics and risk management tools. The platform combines modern web technologies with machine learning to deliver real-time portfolio management, risk assessment, and market insights, aiming to be a central hub for AI in finance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with TypeScript schema definitions
- **Session Storage**: PostgreSQL-backed session store
- **Migrations**: Drizzle Kit

### Key Features
- **Authentication & Authorization**: Replit Auth, secure HTTP-only cookies, PostgreSQL-backed sessions, route-level protection.
- **Portfolio Management**: Real-time analytics, AI model integration for optimization, performance tracking.
- **AI Model Marketplace**: Discovery, subscription system, developer tools for model management, performance metrics.
- **Risk Management System**: Real-time monitoring, stress testing, VaR calculation, automated alerts.
- **Reporting & Analytics**: AI-generated market analysis, automated financial reporting, compliance tracking, custom dashboards.
- **Web3 & DeFi Integration**: Wallet connectivity, crypto holdings, DeFi positions, multi-chain support.
- **Smart Contracts**: Transparent revenue sharing and crowdfunding using Solidity.
- **Advanced Backtesting Environment**: Comprehensive testing platform for AI financial models with historical data analysis, performance metrics (Sharpe ratio, max drawdown, volatility, win rate), risk analysis (VaR, expected shortfall), trade tracking, and visual performance charts. Supports multiple data sources (Yahoo Finance, Alpha Vantage, IEX Cloud, Quandl) and configurable risk parameters.
- **Real-time Trading Platform**: Live market data via WebSockets, order management (market, limit, stop), position tracking.
- **Sentiment Visualizer**: AI-powered sentiment analysis across various asset classes with real-time updates.
- **Comprehensive User Profiles**: Role-specific profiles (Developer, Investor, Data Provider, Regulator, Admin, Moderator) with detailed information, performance metrics, and activity tracking.
- **Admin & Moderator Dashboards**: Dedicated pages for user management, content moderation, security, support, and analytics with role-based access control.
- **AI Chatbot System**: Intelligent conversation management with user profile detection, personalized recommendations, and adaptive questioning.
- **Advanced Data Provider Tools**: Dataset upload/management, financial tracking, collaboration platforms, compliance tools, and advanced trend analysis.

## Recent Updates (August 17, 2025)

### PDF Report Generation System & Enhanced UI (August 17, 2025)
- **Fixed ES Modules Issue**: Resolved `__dirname is not defined` error by implementing proper ES modules compatibility with fileURLToPath
- **Enhanced Reports Dashboard**: Implemented comprehensive reports dashboard with professional header/footer navigation structure
- **Professional Headers**: Added breadcrumb navigation, contextual icons, and detailed page descriptions for better user orientation
- **Comprehensive Footer**: Created multi-column footer with report type links, quick actions, support resources, and system status indicators
- **Report API Endpoints**: Added complete API system for report generation, download, and status checking (`/api/reports/generate`, `/api/reports/:id/download`)
- **Categorized Navigation**: Organized reports into Performance, Risk Assessment, Regulatory Compliance, and Client Reports sections
- **Worker System**: Created background report processing system in `server/workers/reportGenerator.ts` with proper Node.js ES modules support
- **Executive-Quality Output**: Reports include cover pages, executive summaries, data visualizations, and comprehensive financial analysis sections
- **Schema Enhancements**: Updated reports database schema with PDF URL tracking, error handling, and status management
- **Activity Tracking**: Added recent activity indicators and system status displays in footer for operational transparency

### Account Creation & Calendly Integration
- **Chatbot Signup Account Creation**: Fully implemented `/api/auth/complete-chatbot-signup` endpoint that processes user preferences (experience level, platform intent, areas of focus) and creates pending accounts with proper role mapping (Expert → analyst, Intermediate → trader, Beginner → investor).
- **Calendly Demo Booking Integration**: Created `/demo-booking` page that redirects users to https://calendly.com/generativefinance after account creation, allowing them to schedule demos while waiting for account approval.
- **User Preference Processing**: Enhanced chatbot signup flow to capture and store comprehensive user data including finance areas of interest, company information, and platform usage intentions.
- **Pending Account Workflow**: All chatbot signups now create accounts with 'pending' status requiring admin approval before activation.

### Model Subscription & Funding Features
- **Model Subscription Management**: Added comprehensive subscription system with `/my-subscriptions` page for users to manage AI model subscriptions, including pause, resume, and cancel functionality.
- **Fund Models Platform**: Enhanced `/model-funding` page with full funding request management, contribution tracking, and investment opportunities for AI financial models.
- **Navigation Updates**: Added "Model Subscriptions" and "Fund Models" to mobile and desktop navigation menus for easy access.
- **Database Schema**: Created model_subscriptions, model_funding_requests, and model_funding_contributions tables to support subscription and funding operations.
- **API Endpoints**: Implemented RESTful APIs for subscription management (`/api/my-subscriptions`, `/api/subscriptions/:id/:action`) and funding operations.

### Portfolio Optimization & HRP AI Model (August 17, 2025)
- **New AI Model Added**: Portfolio Optimization & Asset Allocation (Hierarchical Risk Parity with AI adjustments) - Model ID 9
- **Specialized Lightbox Page**: Created comprehensive `/hrp-portfolio-optimization` page with advanced portfolio management interface
- **HRP Algorithm Features**: Hierarchical Risk Parity with AI-enhanced asset allocation, correlation analysis, and risk decomposition
- **Interactive Dashboard**: Multi-tab interface with allocation visualization, correlation matrices, performance metrics, and scenario analysis
- **Executive-Friendly Design**: Balanced quant insights with clear executive-level reporting and visualization
- **Route Integration**: Added specialized route handling in AI marketplace for direct navigation to HRP optimization interface

### Security Enhancements & Bug Fixes (August 17, 2025)
- **Fixed Stale State Bug**: Resolved critical security vulnerability in ChatbotSignup.tsx where securityAttempts was checked before state update completed
- **Enhanced Error Handling**: Improved JSON parsing error handling for all API responses with proper fallback messages
- **Captcha Security**: Enhanced generateCaptcha function with more varied questions to prevent predictable patterns
- **Session ID Security**: Replaced timestamp-based session IDs with crypto.randomUUID() for better security
- **Development-Only Debug Info**: Added environment variable checks to only show verification codes in development mode
- **Calendly Integration**: Enhanced demo booking with prefilled user information (name, email, company, role, experience level)
- **Race Condition Protection**: Added isMountedRef cleanup handling to prevent memory leaks and race conditions
- **TypeScript Improvements**: Fixed type comparison errors and enhanced component type safety
- **Attempt Limit Fix**: Corrected security check to allow 2 attempts instead of failing after first incorrect answer

### Runtime Error Prevention & Stability (August 17, 2025)
- **Error Boundary Implementation**: Added comprehensive ErrorBoundary component to prevent full app crashes from component errors
- **Null-Safe toLowerCase() Calls**: Added defensive null checking to all toLowerCase() function calls across the codebase (strategies.tsx, model-card.tsx, risk-distribution.tsx, docs.tsx, ai-marketplace.tsx)
- **TypeScript Error Resolution**: Fixed critical type errors in ai-models.tsx and model-detail.tsx with proper type assertions and API parameter corrections
- **Defensive Data Access**: Enhanced all data access patterns with optional chaining and default values to prevent undefined property access
- **Import Error Prevention**: Verified and secured all component imports including CheckCircle, DataProviderEnhanced, and other critical UI components
- **API Parameter Fixes**: Corrected apiRequest function calls to use proper parameter signatures throughout the application

### Profile Compatibility & Enhanced Routing (August 17, 2025)
- **Profile Compatibility Routes**: Created comprehensive profileCompat.ts with defensive user lookup strategies supporting multiple authentication providers
- **Multi-Route Parameter Support**: Enhanced model-detail.tsx with dual route pattern support (/model/:id and /marketplace/:id) and fallback pathname parsing
- **Storage Layer Enhancement**: Added getUserById, getUserByProviderId, and findUser methods to storage layer for flexible user lookups
- **Defensive Profile Resolution**: Implemented multiple fallback mechanisms for user profile resolution across different user types and authentication flows
- **Enhanced Error Handling**: Added comprehensive error handling for model detail loading with improved user experience and diagnostic feedback
- **Route Integration**: Fully integrated profile compatibility routes into the main server routing system with proper initialization and registration

### ChatBot Signup Endpoint Standardization (August 17, 2025)
- **Centralized Account Creation**: Added createPendingAccount function to ChatbotSignup component for standardized account creation flow
- **Canonical Endpoint Usage**: Updated all signup flows to use /api/chatbot/signup/complete (server's canonical endpoint) for consistent processing
- **Auth Compatibility Route**: Created authCompat.ts providing legacy support for /api/auth/complete-chatbot-signup endpoint by forwarding to canonical route
- **SessionStorage Integration**: Enhanced pending user data persistence in sessionStorage for seamless /account-pending page transitions
- **Error Handling Standardization**: Unified error handling across all chatbot signup paths with consistent user feedback messaging
- **Server Route Registration**: Fully integrated auth compatibility routes into main server routing system with proper initialization logging

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect authentication
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **vite**: Build tool
- **typescript**: Language
- **drizzle-kit**: Database schema management
- **Web3Modal**: Web3 wallet connection
- **ethers.js**: Ethereum blockchain interaction
- **Recharts**: Charting library
- **Chart.js**: Charting library